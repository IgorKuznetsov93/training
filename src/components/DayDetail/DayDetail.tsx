import type { WorkoutDayDTO } from '../../types/workout.types';
import { IntensityBadge } from '../IntensityBadge/IntensityBadge';
import './DayDetail.css';

interface DayDetailProps {
  workout: WorkoutDayDTO;
  isSelected: boolean;
}

export function DayDetail({ workout, isSelected }: DayDetailProps) {
  return (
    <section className={`day-detail ${isSelected ? 'day-detail--selected' : ''}`}>
      <header className="day-detail__header">
        <h2 className="day-detail__title">{workout.dayLabel}</h2>
        {workout.weekLabel && <p className="day-detail__week">{workout.weekLabel}</p>}
        <div className="day-detail__meta">
          <IntensityBadge intensity={workout.intensity} />
          {workout.totalDuration && (
            <span className="day-detail__duration">{workout.totalDuration}</span>
          )}
        </div>
      </header>

      <div className="day-detail__blocks">
        {workout.blocks.map((block) => (
          <article key={block.title} className="day-detail__block">
            <div className="day-detail__block-header">
              <h3 className="day-detail__block-title">{block.title}</h3>
              {block.duration && (
                <span className="day-detail__block-duration">{block.duration}</span>
              )}
            </div>
            <p className="day-detail__block-text">{block.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
