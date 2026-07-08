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
import {
  areOverridesEqual,
  getChangedDates,
  mergeOverrides,
  mergeWorkoutWithOverride,
  pickWinningDates,
  workoutToOverride,
} from '../utils/workoutMerge';

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
  restoreFromGist: () => Promise<void>;
  setSyncPaused: (paused: boolean) => void;
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
  const isSyncPausedRef = useRef(false);
  const remoteChangesRef = useRef<RemoteChangesDTO | null>(null);

  useEffect(() => {
    remoteChangesRef.current = remoteChanges;
  }, [remoteChanges]);

  const isConfigured = Boolean(token && gistId);

  const setSyncPaused = useCallback((paused: boolean) => {
    isSyncPausedRef.current = paused;
  }, []);

  const applyMergedData = useCallback(
    (mergedOverrides: Record<string, WorkoutOverrideDTO>, revision: string) => {
      setOverrides(mergedOverrides);
      persistLocalState(mergedOverrides, revision);
      lastRevisionRef.current = revision;
    },
    [],
  );

  const checkRemoteChanges = useCallback(
    async (activeToken: string, activeGistId: string, silent = true) => {
      if (isSavingRef.current || isSyncPausedRef.current || remoteChangesRef.current) {
        return;
      }

      const gist = await fetchGist(activeToken, activeGistId);
      const remoteData = parseSyncData(gist);
      const localOverrides = loadLocalOverrides();
      const merged = mergeOverrides(localOverrides, remoteData.overrides, remoteData.updatedAt);
      const revisionMatches = gist.updated_at === lastRevisionRef.current;
      const localMatchesMerged = areOverridesEqual(localOverrides, merged);

      if (revisionMatches && localMatchesMerged) {
        return;
      }

      const incomingDates = pickWinningDates(localOverrides, merged);
      applyMergedData(merged, gist.updated_at);

      if (!silent || incomingDates.length === 0) {
        return;
      }

      setRemoteChanges({
        changedDates: incomingDates,
        remoteData: { ...remoteData, overrides: merged },
      });
    },
    [applyMergedData],
  );

  const refreshSync = useCallback(async () => {
    if (!token || !gistId) {
      return;
    }

    try {
      setSyncError(null);
      await checkRemoteChanges(token, gistId);
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Ошибка синхронизации');
    }
  }, [token, gistId, checkRemoteChanges]);

  const restoreFromGist = useCallback(async () => {
    if (!token) {
      throw new Error('Сначала подключи токен');
    }

    setSyncStatus('syncing');
    setSyncError(null);

    try {
      const latestGist = await findExistingGist(token);
      let activeGistId = latestGist?.id ?? gistId ?? loadGistId();
      let gist = latestGist;

      if (!gist && activeGistId) {
        gist = await fetchGist(token, activeGistId);
      }

      if (!gist || !activeGistId) {
        throw new Error('Gist с изменениями не найден на GitHub');
      }

      if (activeGistId !== gist.id) {
        saveGistId(gist.id);
        setGistId(gist.id);
        activeGistId = gist.id;
      }

      const remoteData = parseSyncData(gist);
      const remoteOverrides = remoteData.overrides;

      applyMergedData(remoteOverrides, gist.updated_at);

      if (Object.keys(remoteOverrides).length > 0 && activeGistId) {
        const data: SyncDataDTO = {
          version: 1,
          updatedAt: new Date().toISOString(),
          overrides: remoteOverrides,
        };
        const updated = await updateGist(token, activeGistId, data);
        persistLocalState(remoteOverrides, updated.updated_at);
        lastRevisionRef.current = updated.updated_at;
      }

      setSyncStatus('idle');
    } catch (error) {
      setSyncStatus('error');
      setSyncError(error instanceof Error ? error.message : 'Ошибка восстановления');
      throw error;
    }
  }, [token, gistId, applyMergedData]);

  const pushToGist = useCallback(
    async (nextOverrides: Record<string, WorkoutOverrideDTO>) => {
      if (!token || !gistId) {
        throw new Error('Синхронизация не настроена');
      }

      isSavingRef.current = true;
      setSyncStatus('syncing');
      setSyncError(null);

      try {
        const gist = await fetchGist(token, gistId);
        const remoteData = parseSyncData(gist);
        const merged = mergeOverrides(nextOverrides, remoteData.overrides, remoteData.updatedAt);

        const data: SyncDataDTO = {
          version: 1,
          updatedAt: new Date().toISOString(),
          overrides: merged,
        };
        const updatedGist = await updateGist(token, gistId, data);
        persistLocalState(merged, updatedGist.updated_at);
        lastRevisionRef.current = updatedGist.updated_at;
        setOverrides(merged);
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
        const merged = mergeOverrides(localOverrides, remoteData.overrides, remoteData.updatedAt);
        const changedDates = getChangedDates(localOverrides, remoteData.overrides);

        saveToken(newToken);
        saveGistId(activeGistId);
        setToken(newToken);
        setGistId(activeGistId);
        setUsername(user.login);
        applyMergedData(merged, gist.updated_at);

        if (changedDates.length > 0) {
          setRemoteChanges({
            changedDates,
            remoteData: { ...remoteData, overrides: merged },
          });
        }

        setSyncStatus('idle');
      } catch (error) {
        setSyncStatus('error');
        setSyncError(error instanceof Error ? error.message : 'Ошибка подключения');
        throw error;
      }
    },
    [applyMergedData],
  );

  const disconnect = useCallback(() => {
    clearAllSyncStorage();
    setToken(null);
    setGistId(null);
    setUsername(null);
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
      .then((user) => {
        setUsername(user.login);
        setSyncError(null);
      })
      .catch((error) => {
        setSyncError(error instanceof Error ? error.message : 'Не удалось проверить токен');
      });
  }, [token]);

  useEffect(() => {
    if (!token || !gistId) {
      return;
    }

    const bootstrap = async () => {
      try {
        await checkRemoteChanges(token, gistId, false);
      } catch (error) {
        setSyncError(error instanceof Error ? error.message : 'Ошибка загрузки данных');
      }
    };

    bootstrap();
  }, [token, gistId, checkRemoteChanges]);

  useEffect(() => {
    if (!isConfigured) {
      return;
    }

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
      restoreFromGist,
      setSyncPaused,
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
      restoreFromGist,
      setSyncPaused,
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
