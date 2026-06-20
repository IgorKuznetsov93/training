import { addMonths, format, subMonths } from 'date-fns';
import { ru } from 'date-fns/locale';
import { getCalendarMonthDays } from '../../utils/dateUtils';
import { CalendarDay } from './CalendarDay';
import './Calendar.css';

interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  onMonthChange: (month: Date) => void;
  onSelectDate: (date: Date) => void;
}

const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export function Calendar({
  currentMonth,
  selectedDate,
  onMonthChange,
  onSelectDate,
}: CalendarProps) {
  const days = getCalendarMonthDays(currentMonth);
  const monthLabel = format(currentMonth, 'LLLL yyyy', { locale: ru }).replace(/^./, (c) =>
    c.toUpperCase(),
  );

  const isSameDate = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  return (
    <section className="calendar">
      <header className="calendar__header">
        <h2 className="calendar__title">{monthLabel}</h2>
        <div className="calendar__nav">
          <button
            type="button"
            className="calendar__nav-btn"
            onClick={() => onMonthChange(subMonths(currentMonth, 1))}
            aria-label="Предыдущий месяц"
          >
            ‹
          </button>
          <button
            type="button"
            className="calendar__nav-btn"
            onClick={() => onMonthChange(addMonths(currentMonth, 1))}
            aria-label="Следующий месяц"
          >
            ›
          </button>
        </div>
      </header>

      <div className="calendar__weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="calendar__weekday">
            {label}
          </span>
        ))}
      </div>

      <div className="calendar__grid">
        {days.map((date, index) =>
          date ? (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              isSelected={isSameDate(date, selectedDate)}
              onSelect={onSelectDate}
            />
          ) : (
            <span key={`empty-${index}`} className="calendar__empty" />
          ),
        )}
      </div>
    </section>
  );
}
