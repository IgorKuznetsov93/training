import type { WorkoutDayDTO } from '../types/workout.types';
import type { SyncDataDTO, WorkoutOverrideDTO } from '../types/sync.types';

export function mergeWorkoutWithOverride(
  base: WorkoutDayDTO,
  override?: WorkoutOverrideDTO,
): WorkoutDayDTO {
  if (!override) {
    return base;
  }

  return {
    ...base,
    blocks: override.blocks,
    intensity: override.intensity,
    totalDuration: override.totalDuration ?? base.totalDuration,
    weekLabel: override.weekLabel ?? base.weekLabel,
    isRestDay: override.isRestDay ?? base.isRestDay,
  };
}

export function workoutToOverride(workout: WorkoutDayDTO): WorkoutOverrideDTO {
  return {
    blocks: workout.blocks,
    intensity: workout.intensity,
    totalDuration: workout.totalDuration,
    weekLabel: workout.weekLabel,
    isRestDay: workout.isRestDay,
    modifiedAt: new Date().toISOString(),
  };
}

export function getChangedDates(
  localOverrides: Record<string, WorkoutOverrideDTO>,
  remoteOverrides: Record<string, WorkoutOverrideDTO>,
): string[] {
  const allDates = new Set([
    ...Object.keys(localOverrides),
    ...Object.keys(remoteOverrides),
  ]);

  const changed: string[] = [];

  for (const date of allDates) {
    const localJson = JSON.stringify(localOverrides[date] ?? null);
    const remoteJson = JSON.stringify(remoteOverrides[date] ?? null);
    if (localJson !== remoteJson) {
      changed.push(date);
    }
  }

  return changed.sort();
}

export function applySyncData(data: SyncDataDTO): Record<string, WorkoutOverrideDTO> {
  return { ...data.overrides };
}

export function mergeOverrides(
  localOverrides: Record<string, WorkoutOverrideDTO>,
  remoteOverrides: Record<string, WorkoutOverrideDTO>,
  _remoteUpdatedAt?: string,
): Record<string, WorkoutOverrideDTO> {
  const allDates = new Set([...Object.keys(localOverrides), ...Object.keys(remoteOverrides)]);
  const merged: Record<string, WorkoutOverrideDTO> = {};

  for (const date of allDates) {
    const local = localOverrides[date];
    const remote = remoteOverrides[date];

    if (!local) {
      if (remote) {
        merged[date] = remote;
      }
      continue;
    }

    if (!remote) {
      merged[date] = local;
      continue;
    }

    const localTime = getOverrideTimestamp(local);
    const remoteTime = getOverrideTimestamp(remote);

    if (localTime === 0 && remoteTime === 0) {
      merged[date] = remote;
      continue;
    }

    merged[date] = remoteTime >= localTime ? remote : local;
  }

  return merged;
}

function parseTimestamp(value: string | undefined): number {
  if (!value) {
    return 0;
  }
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function getOverrideTimestamp(override: WorkoutOverrideDTO): number {
  return parseTimestamp(override.modifiedAt);
}

export function pickWinningDates(
  localOverrides: Record<string, WorkoutOverrideDTO>,
  mergedOverrides: Record<string, WorkoutOverrideDTO>,
): string[] {
  return Object.keys(mergedOverrides)
    .filter((date) => JSON.stringify(localOverrides[date] ?? null) !== JSON.stringify(mergedOverrides[date] ?? null))
    .sort();
}

export function areOverridesEqual(
  left: Record<string, WorkoutOverrideDTO>,
  right: Record<string, WorkoutOverrideDTO>,
): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function countOverrides(overrides: Record<string, WorkoutOverrideDTO>): number {
  return Object.keys(overrides).length;
}
