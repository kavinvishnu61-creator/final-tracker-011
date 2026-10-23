import type { Habit, CheckInMap, TrackerSettings } from '../types';
import { DEFAULT_HABITS, MONTH_NAMES } from '../constants';
import { formatDateKey, isDateScheduled, getMonthDays } from './date';

const STORAGE_KEYS = {
  HABITS: 'dayly-habits',
  CHECK_INS: 'dayly-checkins',
  SETTINGS: 'dayly-settings',
  APPEARANCE: 'dayly-appearance',
  BACKGROUNDS: 'dayly-backgrounds',
};

export const DEFAULT_SETTINGS: TrackerSettings = {
  appearance: 'light',
  backgroundIndex: {
    light: 0,
    dark: 0,
  },
  view: 'month',
  showStats: false,
  showNotice: true,
};

export function generateSampleCheckIns(habits: Habit[] = DEFAULT_HABITS, referenceDate: Date = new Date()): CheckInMap {
  const checkIns: CheckInMap = {};
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const todayDate = referenceDate.getDate();

  const patterns: Record<string, number[]> = {
    'habit-water': [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23],
    'habit-read': [1, 2, 3, 5, 6, 7, 10, 11, 12, 14, 15, 16, 17, 19, 21, 22],
    'habit-move': [1, 2, 4, 5, 6, 7, 8, 10, 13, 14, 16, 17, 19, 20, 21],
    'habit-pause': [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 19, 21, 22],
    'habit-rise': [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    'habit-eat': [1, 2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 20, 21, 22],
    'habit-thanks': [1, 2, 3, 4, 6, 7, 8, 10, 11, 12, 14, 15, 17, 18, 19, 21],
    'habit-sleep': [1, 2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16, 18, 19, 20, 21],
  };

  habits.forEach((habit) => {
    const activeDays = patterns[habit.id] || [];
    for (let day = 1; day <= todayDate; day++) {
      const d = new Date(year, month, day, 12, 0, 0);
      if (!isDateScheduled(d, habit.frequency)) continue;

      const isCompleted = activeDays.includes(day) || ((day + habit.name.length) % 3 !== 0 && day <= todayDate);
      if (isCompleted) {
        checkIns[`${habit.id}:${formatDateKey(d)}`] = true;
      }
    }
  });

  return checkIns;
}

export function loadStoredHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load stored habits', e);
  }
  return DEFAULT_HABITS;
}

export function saveStoredHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Failed to save habits to localStorage', e);
  }
}

export function loadStoredCheckIns(): CheckInMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load check-ins', e);
  }
  const sample = generateSampleCheckIns();
  saveStoredCheckIns(sample);
  return sample;
}

export function saveStoredCheckIns(checkIns: CheckInMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
  } catch (e) {
    console.error('Failed to save check-ins to localStorage', e);
  }
}

export function loadStoredSettings(): TrackerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
    const legacyApp = localStorage.getItem(STORAGE_KEYS.APPEARANCE);
    const legacyBgs = localStorage.getItem(STORAGE_KEYS.BACKGROUNDS);
    if (legacyApp || legacyBgs) {
      const bgs = legacyBgs ? JSON.parse(legacyBgs) : { light: 0, dark: 0 };
      return {
        ...DEFAULT_SETTINGS,
        appearance: (legacyApp as any) || 'light',
        backgroundIndex: bgs,
      };
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: TrackerSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem(STORAGE_KEYS.APPEARANCE, settings.appearance);
    localStorage.setItem(STORAGE_KEYS.BACKGROUNDS, JSON.stringify(settings.backgroundIndex));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function exportMonthToCSV(
  habits: Habit[],
  checkIns: CheckInMap,
  year: number,
  monthIndex: number
): void {
  const monthDays = getMonthDays(year, monthIndex);
  const monthName = MONTH_NAMES[monthIndex];

  const headers = ['Habit', 'Category', 'Goal', 'Frequency'];
  monthDays.forEach((d) => headers.push(String(d.getDate())));
  headers.push('Completed', 'Total Scheduled', 'Rate %');

  const rows: string[][] = [headers];

  habits.forEach((habit) => {
    let completedCount = 0;
    let scheduledCount = 0;

    const row = [
      `"${habit.name.replace(/"/g, '""')}"`,
      `"${habit.category}"`,
      `"${(habit.target || '').replace(/"/g, '""')}"`,
      `"${habit.frequency}"`,
    ];

    monthDays.forEach((day) => {
      const key = `${habit.id}:${formatDateKey(day)}`;
      const scheduled = isDateScheduled(day, habit.frequency);
      if (!scheduled) {
        row.push('—');
      } else {
        scheduledCount++;
        if (checkIns[key]) {
          completedCount++;
          row.push('1');
        } else {
          row.push('0');
        }
      }
    });

    const rate = scheduledCount > 0 ? Math.round((completedCount / scheduledCount) * 100) : 0;
    row.push(String(completedCount), String(scheduledCount), `${rate}%`);
    rows.push(row);
  });

  const csvContent = rows.map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `habit-tracker-${monthName.toLowerCase()}-${year}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadJSONBackup(
  habits: Habit[],
  checkIns: CheckInMap,
  settings: TrackerSettings
): void {
  const backup = {
    version: 1,
    appName: 'Habit Tracker',
    exportedAt: new Date().toISOString(),
    habits,
    checkIns,
    settings,
  };

  const jsonStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = formatDateKey(new Date());
  link.setAttribute('href', url);
  link.setAttribute('download', `habit-tracker-backup-${dateStr}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
