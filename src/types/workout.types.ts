export type WorkoutIntensity = 'heavy' | 'medium' | 'light' | 'rest' | 'recovery';

export type DayOfWeekKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface WorkoutBlockDTO {
  title: string;
  duration?: string;
  description: string;
}

export interface WorkoutTemplateDTO {
  weekLabel: string;
  dayLabel: string;
  intensity: WorkoutIntensity;
  totalDuration?: string;
  blocks: WorkoutBlockDTO[];
  isRestDay?: boolean;
}

export interface WorkoutDayDTO {
  date: string;
  weekNumber: number;
  weekLabel: string;
  dayLabel: string;
  intensity: WorkoutIntensity;
  totalDuration?: string;
  blocks: WorkoutBlockDTO[];
  isRestDay?: boolean;
}

export type WeekPlanDTO = Partial<Record<DayOfWeekKey, WorkoutTemplateDTO>>;

export interface ProgramStatusDTO {
  isBeforeProgram: boolean;
  isAfterProgram: boolean;
  isRestDay: boolean;
  isProgramComplete: boolean;
}
