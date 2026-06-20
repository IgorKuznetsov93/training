import type { WorkoutBlockDTO, WorkoutIntensity } from './workout.types';

export interface WorkoutOverrideDTO {
  blocks: WorkoutBlockDTO[];
  intensity: WorkoutIntensity;
  totalDuration?: string;
  weekLabel?: string;
  isRestDay?: boolean;
  modifiedAt: string;
}

export interface SyncDataDTO {
  version: 1;
  updatedAt: string;
  overrides: Record<string, WorkoutOverrideDTO>;
}

export interface SyncConfigDTO {
  token: string;
  gistId: string;
  lastRevision: string;
}

export interface RemoteChangesDTO {
  changedDates: string[];
  remoteData: SyncDataDTO;
}

export interface GitHubUserDTO {
  login: string;
}

export interface GitHubGistFileDTO {
  content?: string;
}

export interface GitHubGistDTO {
  id: string;
  updated_at: string;
  description: string | null;
  files: Record<string, GitHubGistFileDTO>;
}

export interface GitHubErrorDTO {
  message: string;
}
