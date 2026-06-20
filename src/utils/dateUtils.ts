import {
  addDays,
  differenceInCalendarDays,
  format,
  getDay,
  isBefore,
  isSameDay,
  parseISO,
  startOfDay,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  DAY_KEY_BY_INDEX,
  PROGRAM_WEEKS,
  SPECIAL_DAYS,
  WEEK_PLANS,
} from '../data/trainingPlan';
import type { WorkoutDayDTO, WorkoutTemplateDTO } from '../types/workout.types';

export const START_DATE = parseISO('2026-06-22');
export const END_DATE = addDays(START_DATE, PROGRAM_WEEKS * 7 - 1);

const REST_DAY_TEMPLATE: WorkoutTemplateDTO = {
  weekLabel: '',
  dayLabel: '',
  intensity: 'rest',
  isRestDay: true,
  blocks: [{ title: 'День отдыха', description: 'Сегодня тренировок нет. Отдыхай и восстанавливайся.' }],
};

const BEFORE_PROGRAM_TEMPLATE: WorkoutTemplateDTO = {
  weekLabel: '',
  dayLabel: '',
  intensity: 'rest',
  isRestDay: true,
  blocks: [{ title: 'Программа ещё не началась', description: 'Тренировки стартуют 22 июня 2026.' }],
};

const AFTER_PROGRAM_TEMPLATE: WorkoutTemplateDTO = {
  weekLabel: '',
  dayLabel: '',
  intensity: 'rest',
  isRestDay: true,
  blocks: [{ title: 'Программа завершена', description: '16 недель тренировок позади. Отличная работа!' }],
};

export function formatDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getWeekNumber(date: Date): number {
  const diff = differenceInCalendarDays(startOfDay(date), startOfDay(START_DATE));
  if (diff < 0) {
    return 0;
  }
  return Math.floor(diff / 7) + 1;
}

export function isBeforeProgram(date: Date): boolean {
  return isBefore(startOfDay(date), startOfDay(START_DATE));
}

export function isAfterProgram(date: Date): boolean {
  return differenceInCalendarDays(startOfDay(date), startOfDay(END_DATE)) > 0;
}

export function isPastDay(date: Date, reference: Date = new Date()): boolean {
  return isBefore(startOfDay(date), startOfDay(reference));
}

export function isToday(date: Date, reference: Date = new Date()): boolean {
  return isSameDay(date, reference);
}

function resolveTemplate(date: Date): WorkoutTemplateDTO | null {
  const dateKey = formatDateKey(date);

  if (SPECIAL_DAYS[dateKey]) {
    return SPECIAL_DAYS[dateKey];
  }

  if (isBeforeProgram(date) || isAfterProgram(date)) {
    return null;
  }

  const weekNumber = getWeekNumber(date);
  const dayKey = DAY_KEY_BY_INDEX[getDay(date)];
  const weekPlan = WEEK_PLANS[weekNumber];

  if (!weekPlan) {
    return null;
  }

  return weekPlan[dayKey] ?? null;
}

function buildWorkoutDay(date: Date, template: WorkoutTemplateDTO): WorkoutDayDTO {
  const weekNumber = getWeekNumber(date);
  const dayLabel =
    template.dayLabel || format(date, 'EEEE', { locale: ru }).replace(/^./, (c) => c.toUpperCase());

  return {
    date: formatDateKey(date),
    weekNumber: weekNumber > 0 ? weekNumber : 0,
    weekLabel: template.weekLabel,
    dayLabel,
    intensity: template.intensity,
    totalDuration: template.totalDuration,
    blocks: template.blocks,
    isRestDay: template.isRestDay,
  };
}

export function getWorkoutByDate(date: Date): WorkoutDayDTO {
  const formattedDay = format(date, 'd MMMM', { locale: ru });
  const dayLabelCapitalized = format(date, 'EEEE', { locale: ru }).replace(/^./, (c) => c.toUpperCase());

  if (isBeforeProgram(date)) {
    return {
      ...buildWorkoutDay(date, BEFORE_PROGRAM_TEMPLATE),
      dayLabel: `${dayLabelCapitalized}, ${formattedDay}`,
      weekLabel: 'До старта',
    };
  }

  if (isAfterProgram(date)) {
    return {
      ...buildWorkoutDay(date, AFTER_PROGRAM_TEMPLATE),
      dayLabel: `${dayLabelCapitalized}, ${formattedDay}`,
      weekLabel: 'После программы',
    };
  }

  const template = resolveTemplate(date);

  if (!template) {
    return {
      ...buildWorkoutDay(date, REST_DAY_TEMPLATE),
      dayLabel: `${dayLabelCapitalized}, ${formattedDay}`,
      weekLabel: getWeekNumber(date) > 0 ? `Неделя ${getWeekNumber(date)}` : '',
    };
  }

  return {
    ...buildWorkoutDay(date, template),
    dayLabel: `${dayLabelCapitalized}, ${formattedDay}`,
  };
}

export function getCalendarMonthDays(month: Date): (Date | null)[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const startOffset = (getDay(firstDay) + 6) % 7;
  const days: (Date | null)[] = Array.from({ length: startOffset }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    days.push(new Date(year, monthIndex, day));
  }

  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}

export function clampToProgramRange(date: Date): Date {
  if (isBeforeProgram(date)) {
    return START_DATE;
  }
  if (isAfterProgram(date)) {
    return END_DATE;
  }
  return date;
}
