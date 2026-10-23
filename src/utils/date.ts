import { MONTH_NAMES, WEEKDAY_NAMES } from '../constants';
import type { ViewMode, HabitFrequency } from '../types';

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isFutureDate(date: Date): boolean {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  return date.getTime() > today.getTime();
}

export function isDateScheduled(date: Date, frequency: HabitFrequency): boolean {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  if (frequency === 'daily') return true;
  if (frequency === 'weekdays') return day >= 1 && day <= 5;
  if (frequency === 'weekends') return day === 0 || day === 6;
  return true;
}

export function getMonthDays(year: number, monthIndex: number): Date[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days: Date[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, monthIndex, i, 12, 0, 0));
  }
  return days;
}

export function getWeekDays(referenceDate: Date): Date[] {
  const current = new Date(referenceDate);
  current.setHours(12, 0, 0, 0);
  const dayOfWeek = current.getDay();
  const distanceToMonday = (dayOfWeek + 6) % 7;
  const monday = new Date(current);
  monday.setDate(current.getDate() - distanceToMonday);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function getFortnightDays(referenceDate: Date): Date[] {
  const week1 = getWeekDays(referenceDate);
  const monday = week1[0];
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

export function getDaysForView(view: ViewMode, currentDate: Date): Date[] {
  if (view === 'month') {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  } else if (view === 'week') {
    return getWeekDays(currentDate);
  } else {
    return getFortnightDays(currentDate);
  }
}

export function shiftPeriod(currentDate: Date, view: ViewMode, direction: -1 | 1): Date {
  const next = new Date(currentDate);
  if (view === 'month') {
    next.setMonth(next.getMonth() + direction);
  } else if (view === 'week') {
    next.setDate(next.getDate() + direction * 7);
  } else if (view === 'fortnight') {
    next.setDate(next.getDate() + direction * 14);
  }
  return next;
}

export function formatPeriodLabel(view: ViewMode, days: Date[]): { range: string; year: string } {
  if (!days.length) return { range: '', year: '' };
  const first = days[0];
  const last = days[days.length - 1];

  const year = String(first.getFullYear());

  if (view === 'month') {
    return {
      range: MONTH_NAMES[first.getMonth()],
      year,
    };
  }

  const shortMonthFirst = MONTH_NAMES[first.getMonth()].slice(0, 3);
  const shortMonthLast = MONTH_NAMES[last.getMonth()].slice(0, 3);

  if (first.getMonth() === last.getMonth()) {
    return {
      range: `${shortMonthFirst} ${first.getDate()}–${last.getDate()}`,
      year,
    };
  }

  return {
    range: `${shortMonthFirst} ${first.getDate()} – ${shortMonthLast} ${last.getDate()}`,
    year: first.getFullYear() === last.getFullYear() ? year : `${first.getFullYear()} / ${last.getFullYear()}`,
  };
}

export function getWeekdayAbbr(date: Date): string {
  return WEEKDAY_NAMES[date.getDay()];
}
