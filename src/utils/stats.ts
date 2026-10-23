import type { Habit, CheckInMap, HabitStats } from '../types';
import { formatDateKey, isDateScheduled, getMonthDays, getWeekDays } from './date';

export function calculateHabitStreak(
  habit: Habit,
  checkIns: CheckInMap,
  today: Date = new Date()
): { currentStreak: number; bestStreak: number } {
  let currentStreak = 0;
  let tempStreak = 0;
  let bestStreak = 0;

  const todayKey = `${habit.id}:${formatDateKey(today)}`;
  const todayCompleted = !!checkIns[todayKey];

  let isCurrentStreakBroken = false;

  for (let i = 0; i < 90; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const scheduled = isDateScheduled(checkDate, habit.frequency);

    if (!scheduled) {
      continue;
    }

    const key = `${habit.id}:${formatDateKey(checkDate)}`;
    const completed = !!checkIns[key];

    if (completed) {
      tempStreak++;
      if (!isCurrentStreakBroken) {
        currentStreak++;
      }
      if (tempStreak > bestStreak) {
        bestStreak = tempStreak;
      }
    } else {
      if (i === 0 && !todayCompleted) {
        continue;
      } else {
        isCurrentStreakBroken = true;
        tempStreak = 0;
      }
    }
  }

  return { currentStreak, bestStreak };
}

export function calculateHabitStats(
  habits: Habit[],
  checkIns: CheckInMap,
  currentViewDate: Date = new Date()
): HabitStats {
  const today = new Date();
  const todayKeySuffix = formatDateKey(today);

  let completedToday = 0;
  let scheduledTodayCount = 0;

  habits.forEach((habit) => {
    if (isDateScheduled(today, habit.frequency)) {
      scheduledTodayCount++;
      const key = `${habit.id}:${todayKeySuffix}`;
      if (checkIns[key]) {
        completedToday++;
      }
    }
  });

  const dailyPercentage = scheduledTodayCount > 0 ? Math.round((completedToday / scheduledTodayCount) * 100) : 0;

  const habitStreaks: Record<string, number> = {};
  let overallBestStreak = 0;
  let overallCurrentStreak = 0;

  habits.forEach((habit) => {
    const { currentStreak, bestStreak } = calculateHabitStreak(habit, checkIns, today);
    habitStreaks[habit.id] = currentStreak;
    if (bestStreak > overallBestStreak) {
      overallBestStreak = bestStreak;
    }
    if (currentStreak > overallCurrentStreak) {
      overallCurrentStreak = currentStreak;
    }
  });

  const weekDays = getWeekDays(today);
  let weekCompleted = 0;
  let weekScheduled = 0;

  weekDays.forEach((day) => {
    const isPastOrToday = day.getTime() <= today.getTime() || day.toDateString() === today.toDateString();
    if (!isPastOrToday) return;

    const dayKey = formatDateKey(day);
    habits.forEach((habit) => {
      if (isDateScheduled(day, habit.frequency)) {
        weekScheduled++;
        if (checkIns[`${habit.id}:${dayKey}`]) {
          weekCompleted++;
        }
      }
    });
  });

  const weeklyProgress = weekScheduled > 0 ? Math.round((weekCompleted / weekScheduled) * 100) : 0;

  const monthDays = getMonthDays(currentViewDate.getFullYear(), currentViewDate.getMonth());
  let monthCompleted = 0;
  let monthScheduled = 0;
  const habitMonthRates: Record<string, number> = {};

  habits.forEach((habit) => {
    let hCompleted = 0;
    let hScheduled = 0;

    monthDays.forEach((day) => {
      const isPastOrToday = day.getTime() <= today.getTime() || day.toDateString() === today.toDateString();
      if (!isPastOrToday) return;

      if (isDateScheduled(day, habit.frequency)) {
        monthScheduled++;
        hScheduled++;
        const key = `${habit.id}:${formatDateKey(day)}`;
        if (checkIns[key]) {
          monthCompleted++;
          hCompleted++;
        }
      }
    });

    habitMonthRates[habit.id] = hScheduled > 0 ? Math.round((hCompleted / hScheduled) * 100) : 0;
  });

  const monthProgress = monthScheduled > 0 ? Math.round((monthCompleted / monthScheduled) * 100) : 0;

  return {
    totalHabits: habits.length,
    completedToday,
    dailyPercentage,
    currentStreak: overallCurrentStreak,
    bestStreak: overallBestStreak,
    weeklyProgress,
    monthProgress,
    totalMonthCheckIns: monthCompleted,
    possibleMonthCheckIns: monthScheduled,
    habitStreaks,
    habitMonthRates,
  };
}
