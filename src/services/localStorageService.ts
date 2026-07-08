import type { WorkoutOverrideDTO } from '../types/sync.types';

export const STORAGE_KEYS = {
  token: 'training_github_token',
  gistId: 'training_gist_id',
  lastRevision: 'training_last_revision',
  overrides: 'training_local_overrides',
} as const;

export function loadToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.token);
}

export function saveToken(token: string): void {
  localStorage.setItem(STORAGE_KEYS.token, token);
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEYS.token);
}

export function loadGistId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.gistId);
}

export function saveGistId(gistId: string): void {
  localStorage.setItem(STORAGE_KEYS.gistId, gistId);
}

export function clearGistId(): void {
  localStorage.removeItem(STORAGE_KEYS.gistId);
}

export function loadLastRevision(): string | null {
  return localStorage.getItem(STORAGE_KEYS.lastRevision);
}

export function saveLastRevision(revision: string): void {
  localStorage.setItem(STORAGE_KEYS.lastRevision, revision);
}

export function clearLastRevision(): void {
  localStorage.removeItem(STORAGE_KEYS.lastRevision);
}

export function clearAllSyncStorage(): void {
  clearToken();
  clearGistId();
  clearLastRevision();
}

export function clearLocalOverrides(): void {
  localStorage.removeItem(STORAGE_KEYS.overrides);
}

export function loadLocalOverrides(): Record<string, WorkoutOverrideDTO> {
  const raw = localStorage.getItem(STORAGE_KEYS.overrides);
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw) as Record<string, WorkoutOverrideDTO>;
  } catch {
    return {};
  }
}

export function saveLocalOverrides(overrides: Record<string, WorkoutOverrideDTO>): void {
  localStorage.setItem(STORAGE_KEYS.overrides, JSON.stringify(overrides));
}
