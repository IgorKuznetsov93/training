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
