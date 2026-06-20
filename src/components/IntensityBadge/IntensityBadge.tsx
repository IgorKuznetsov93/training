import type { WorkoutIntensity } from '../../types/workout.types';
import './IntensityBadge.css';

interface IntensityBadgeProps {
  intensity: WorkoutIntensity;
}

const LABELS: Record<WorkoutIntensity, string> = {
  heavy: 'Тяжёлая',
  medium: 'Средняя',
  light: 'Лёгкая',
  recovery: 'Восстановление',
  rest: 'Отдых',
};

export function IntensityBadge({ intensity }: IntensityBadgeProps) {
  return (
    <span className={`intensity-badge intensity-badge--${intensity}`}>
      {LABELS[intensity]}
    </span>
  );
}
