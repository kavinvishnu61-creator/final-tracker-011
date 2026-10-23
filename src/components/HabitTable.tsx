import React from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';
import type { Habit, CheckInMap, ViewMode } from '../types';
import { HabitIcon } from './HabitIcon';
import { formatDateKey, isToday, isDateScheduled, getWeekdayAbbr } from '../utils/date';

interface HabitTableProps {
  habits: Habit[];
  view: ViewMode;
  days: Date[];
  checkIns: CheckInMap;
  onToggleCheckIn: (habitId: string, date: Date) => void;
  onAddHabit: () => void;
  onEditHabit: (habit: Habit) => void;
  isSampleDataActive?: boolean;
}

export const HabitTable: React.FC<HabitTableProps> = ({
  habits,
  view,
  days,
  checkIns,
  onToggleCheckIn,
  onAddHabit,
  onEditHabit,
  isSampleDataActive = false,
}) => {
  if (habits.length === 0) {
    return (
      <div className="empty-state">
        <Sparkles size={28} style={{ opacity: 0.6 }} />
        <p>No habits to track yet.</p>
        <button type="button" className="button" onClick={onAddHabit}>
          <Plus size={14} />
          <span>Add your first habit</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`table-wrap view-${view}`}>
      <div className="table-scroll-container">
        <table className="habit-table" aria-label="Habit tracking grid">
          <thead>
            <tr>
              <th className="habit-heading habit-col" scope="col">
                HABIT
                <span>HABIT / DAY</span>
              </th>

              {days.map((date) => {
                const today = isToday(date);
                const dayNum = date.getDate();
                const dayAbbr = getWeekdayAbbr(date);

                return (
                  <th
                    key={date.toISOString()}
                    className={today ? 'today-heading' : ''}
                    scope="col"
                    aria-label={`${dayAbbr}, day ${dayNum}${today ? ' (Today)' : ''}`}
                  >
                    <span className="weekday">{dayAbbr}</span>
                    <span className="date-number">{dayNum}</span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <th className="habit-name habit-col" scope="row">
                  <button
                    type="button"
                    onClick={() => onEditHabit(habit)}
                    title={`Edit habit: ${habit.name}${habit.target ? ` — ${habit.target}` : ''}`}
                    aria-label={`Edit habit ${habit.name}`}
                  >
                    <span className="habit-icon">
                      <HabitIcon name={habit.icon} />
                    </span>
                    <span>
                      <strong>{habit.name}</strong>
                      {habit.target && <small>{habit.target}</small>}
                    </span>
                  </button>
                </th>

                {days.map((date) => {
                  const dateKey = formatDateKey(date);
                  const isScheduled = isDateScheduled(date, habit.frequency);
                  const isChecked = !!checkIns[`${habit.id}:${dateKey}`];

                  if (!isScheduled) {
                    return (
                      <td key={dateKey}>
                        <div
                          className="check-cell unscheduled"
                          title="Rest day (outside habit schedule)"
                          aria-label="Rest day"
                        >
                          <div className="rest-dash" />
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={dateKey}>
                      <button
                        type="button"
                        className={`check-cell ${isChecked ? 'completed' : ''}`}
                        onClick={() => onToggleCheckIn(habit.id, date)}
                        title={`${habit.name}: ${dateKey} — ${isChecked ? 'Completed (click to undo)' : 'Click to check in'}`}
                        aria-label={`${habit.name}, ${dateKey}, ${isChecked ? 'Complete' : 'Incomplete'}`}
                        aria-pressed={isChecked}
                      >
                        {isChecked && <Check size={14} strokeWidth={1.5} />}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sheet-bottom">
        <button
          type="button"
          className="add-habit"
          onClick={onAddHabit}
          aria-label="Add a new habit"
        >
          <Plus size={14} />
          <span>Add habit</span>
        </button>

        <span className="space-hint">
          {isSampleDataActive ? 'Sample data' : `${habits.length} habits active`}
        </span>
      </div>
    </div>
  );
};
