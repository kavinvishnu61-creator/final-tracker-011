export type AppearanceMode = 'light' | 'dark' | 'system';

export type ViewMode = 'week' | 'fortnight' | 'month';

export type HabitCategory = 'wellbeing' | 'growth' | 'lifestyle';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends';

export interface Habit {
  id: string;
  name: string;
  target?: string;
  icon: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  createdAt: string;
  order?: number;
}

export type CheckInMap = Record<string, boolean>;

export interface BackgroundPreset {
  id: string;
  name: string;
  src: string;
  position: string;
  mode: 'light' | 'dark';
}

export interface TrackerSettings {
  appearance: AppearanceMode;
  backgroundIndex: {
    light: number;
    dark: number;
  };
  customBackgroundUrl?: string;
  view: ViewMode;
  showNotice?: boolean;
  showStats?: boolean;
}

export interface HabitStats {
  totalHabits: number;
  completedToday: number;
  dailyPercentage: number;
  currentStreak: number;
  bestStreak: number;
  weeklyProgress: number;
  monthProgress: number;
  totalMonthCheckIns: number;
  possibleMonthCheckIns: number;
  habitStreaks: Record<string, number>;
  habitMonthRates: Record<string, number>;
}

export interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}
