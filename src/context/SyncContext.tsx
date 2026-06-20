import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  createGist,
  fetchGist,
  findExistingGist,
  parseSyncData,
  updateGist,
  validateToken,
} from '../services/githubGistService';
import {
  clearAllSyncStorage,
  loadGistId,
  loadLastRevision,
  loadLocalOverrides,
  loadToken,
  saveGistId,
  saveLastRevision,
  saveLocalOverrides,
  saveToken,
} from '../services/localStorageService';
import type { RemoteChangesDTO, SyncDataDTO, WorkoutOverrideDTO } from '../types/sync.types';
import type { WorkoutDayDTO } from '../types/workout.types';
import { getWorkoutByDate } from '../utils/dateUtils';
import { applySyncData, getChangedDates, mergeWorkoutWithOverride, workoutToOverride } from '../utils/workoutMerge';

const POLL_INTERVAL_MS = 15_000;

interface SyncContextValue {
  isConfigured: boolean;
  username: string | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  syncError: string | null;
  overrides: Record<string, WorkoutOverrideDTO>;
  remoteChanges: RemoteChangesDTO | null;
  getWorkoutForDate: (date: Date) => WorkoutDayDTO;
  hasOverride: (dateKey: string) => boolean;
  saveWorkout: (workout: WorkoutDayDTO) => Promise<void>;
  resetWorkout: (dateKey: string) => Promise<void>;
  connect: (token: string) => Promise<void>;
  disconnect: () => void;
  dismissRemoteChanges: () => void;
  refreshSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextValue | null>(null);

function persistLocalState(
  overrides: Record<string, WorkoutOverrideDTO>,
  revision: string,
): void {
  saveLocalOverrides(overrides);
  saveLastRevision(revision);
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => loadToken());
  const [gistId, setGistId] = useState<string | null>(() => loadGistId());
  const [username, setUsername] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, WorkoutOverrideDTO>>(
    () => loadLocalOverrides(),
  );
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [remoteChanges, setRemoteChanges] = useState<RemoteChangesDTO | null>(null);
  const lastRevisionRef = useRef<string | null>(loadLastRevision());
  const isSavingRef = useRef(false);
  const remoteChangesRef = useRef<RemoteChangesDTO | null>(null);

  useEffect(() => {
    remoteChangesRef.current = remoteChanges;
  }, [remoteChanges]);

  const isConfigured = Boolean(token && gistId);

  const applyRemoteData = useCallback((data: SyncDataDTO, revision: string) => {
    const nextOverrides = applySyncData(data);
    setOverrides(nextOverrides);
    persistLocalState(nextOverrides, revision);
    lastRevisionRef.current = revision;
  }, []);

  const checkRemoteChanges = useCallback(
    async (activeToken: string, activeGistId: string) => {
      if (isSavingRef.current || remoteChangesRef.current) {
        return;
      }

      const gist = await fetchGist(activeToken, activeGistId);
      const remoteData = parseSyncData(gist);
      const lastRevision = lastRevisionRef.current;

      if (!lastRevision) {
        applyRemoteData(remoteData, gist.updated_at);
        return;
      }

      if (gist.updated_at === lastRevision) {
        return;
      }

      const localOverrides = loadLocalOverrides();
      const changedDates = getChangedDates(localOverrides, remoteData.overrides);

      if (changedDates.length === 0) {
        saveLastRevision(gist.updated_at);
        lastRevisionRef.current = gist.updated_at;
        return;
      }

      applyRemoteData(remoteData, gist.updated_at);
      setRemoteChanges({ changedDates, remoteData });
    },
    [applyRemoteData],
  );

  const refreshSync = useCallback(async () => {
    if (!token || !gistId) {
      return;
    }

    try {
      setSyncStatus('syncing');
      setSyncError(null);
      await checkRemoteChanges(token, gistId);
      setSyncStatus('idle');
    } catch (error) {
      setSyncStatus('error');
      setSyncError(error instanceof Error ? error.message : 'Ошибка синхронизации');
    }
  }, [token, gistId, checkRemoteChanges]);

  const pushToGist = useCallback(
    async (nextOverrides: Record<string, WorkoutOverrideDTO>) => {
      if (!token || !gistId) {
        throw new Error('Синхронизация не настроена');
      }

      isSavingRef.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const data: SyncDataDTO = {
          version: 1,
          updatedAt: new Date().toISOString(),
          overrides: nextOverrides,
        };
        const gist = await updateGist(token, gistId, data);
        persistLocalState(nextOverrides, gist.updated_at);
        lastRevisionRef.current = gist.updated_at;
        setOverrides(nextOverrides);
        setSyncStatus('idle');
      } catch (error) {
        setSyncStatus('error');
        setSyncError(error instanceof Error ? error.message : 'Ошибка сохранения');
        throw error;
      } finally {
        isSavingRef.current = false;
      }
    },
    [token, gistId],
  );

  const connect = useCallback(
    async (newToken: string) => {
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const user = await validateToken(newToken);
        let activeGistId: string | null = null;
        let gist: Awaited<ReturnType<typeof fetchGist>> | null = null;

        const existing = await findExistingGist(newToken);
        if (existing) {
          gist = existing;
          activeGistId = existing.id;
        } else {
          const storedGistId = loadGistId();
          if (storedGistId) {
            try {
              gist = await fetchGist(newToken, storedGistId);
              activeGistId = storedGistId;
            } catch {
              gist = null;
              activeGistId = null;
            }
          }
        }

        if (!gist || !activeGistId) {
          const localOverrides = loadLocalOverrides();
          const data: SyncDataDTO = {
            version: 1,
            updatedAt: new Date().toISOString(),
            overrides: localOverrides,
          };
          gist = await createGist(newToken, data);
          activeGistId = gist.id;
        }

        const remoteData = parseSyncData(gist);
        const localOverrides = loadLocalOverrides();
        const changedDates = getChangedDates(localOverrides, remoteData.overrides);

        saveToken(newToken);
        saveGistId(activeGistId);
        setToken(newToken);
        setGistId(activeGistId);
        setUsername(user.login);

        if (changedDates.length > 0) {
          applyRemoteData(remoteData, gist.updated_at);
          setRemoteChanges({ changedDates, remoteData });
        } else {
          applyRemoteData(remoteData, gist.updated_at);
        }

        setSyncStatus('idle');
      } catch (error) {
        setSyncStatus('error');
        setSyncError(error instanceof Error ? error.message : 'Ошибка подключения');
        throw error;
      }
    },
    [applyRemoteData],
  );

  const disconnect = useCallback(() => {
    clearAllSyncStorage();
    setToken(null);
    setGistId(null);
    setUsername(null);
    setOverrides({});
    setRemoteChanges(null);
    setSyncError(null);
    setSyncStatus('idle');
    lastRevisionRef.current = null;
  }, []);

  const dismissRemoteChanges = useCallback(() => {
    setRemoteChanges(null);
  }, []);

  const getWorkoutForDate = useCallback(
    (date: Date): WorkoutDayDTO => {
      const base = getWorkoutByDate(date);
      const dateKey = base.date;
      return mergeWorkoutWithOverride(base, overrides[dateKey]);
    },
    [overrides],
  );

  const hasOverride = useCallback(
    (dateKey: string): boolean => overrides[dateKey] !== undefined,
    [overrides],
  );

  const saveWorkout = useCallback(
    async (workout: WorkoutDayDTO) => {
      const nextOverrides = {
        ...overrides,
        [workout.date]: workoutToOverride(workout),
      };
      await pushToGist(nextOverrides);
    },
    [overrides, pushToGist],
  );

  const resetWorkout = useCallback(
    async (dateKey: string) => {
      const nextOverrides = { ...overrides };
      delete nextOverrides[dateKey];
      await pushToGist(nextOverrides);
    },
    [overrides, pushToGist],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    validateToken(token)
      .then((user) => setUsername(user.login))
      .catch(() => disconnect());
  }, [token, disconnect]);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

    refreshSync();

    const intervalId = window.setInterval(() => {
      refreshSync();
    }, POLL_INTERVAL_MS);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshSync();
      }
    };

    const handleFocus = () => {
      refreshSync();
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isConfigured, refreshSync]);

  const value = useMemo<SyncContextValue>(
    () => ({
      isConfigured,
      username,
      syncStatus,
      syncError,
      overrides,
      remoteChanges,
      getWorkoutForDate,
      hasOverride,
      saveWorkout,
      resetWorkout,
      connect,
      disconnect,
      dismissRemoteChanges,
      refreshSync,
    }),
    [
      isConfigured,
      username,
      syncStatus,
      syncError,
      overrides,
      remoteChanges,
      getWorkoutForDate,
      hasOverride,
      saveWorkout,
      resetWorkout,
      connect,
      disconnect,
      dismissRemoteChanges,
      refreshSync,
    ],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
}
