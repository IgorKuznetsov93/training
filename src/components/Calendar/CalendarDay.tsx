import { getWorkoutByDate, isPastDay, isToday } from '../../utils/dateUtils';
import type { WorkoutIntensity } from '../../types/workout.types';
import './CalendarDay.css';

interface CalendarDayProps {
  date: Date;
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

function getIntensityColor(intensity: WorkoutIntensity): string {
  const colors: Record<WorkoutIntensity, string> = {
    heavy: 'var(--intensity-heavy)',
    medium: 'var(--intensity-medium)',
    light: 'var(--intensity-light)',
    recovery: 'var(--intensity-recovery)',
    rest: 'var(--intensity-rest)',
  };
  return colors[intensity];
}

export function CalendarDay({ date, isSelected, onSelect }: CalendarDayProps) {
  const workout = getWorkoutByDate(date);
  const past = isPastDay(date);
  const today = isToday(date);

  const showDot =
    !workout.isRestDay &&
    workout.blocks[0]?.title !== 'День отдыха' &&
    workout.blocks[0]?.title !== 'Программа ещё не началась' &&
    workout.blocks[0]?.title !== 'Программа завершена';

  const classNames = [
    'calendar-day',
    past && 'calendar-day--past',
    today && 'calendar-day--today',
    isSelected && 'calendar-day--selected',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classNames}
      onClick={() => onSelect(date)}
      aria-label={workout.dayLabel}
      aria-pressed={isSelected}
    >
      <span className="calendar-day__number">{date.getDate()}</span>
      {showDot && (
        <span
          className="calendar-day__dot"
          style={{ backgroundColor: getIntensityColor(workout.intensity) }}
        />
      )}
    </button>
  );
}
