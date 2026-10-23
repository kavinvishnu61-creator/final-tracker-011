import React from 'react';
import type { HabitStats } from '../types';
import { Flame, CheckCircle, Target, TrendingUp, Calendar } from 'lucide-react';

interface DashboardOverviewProps {
  stats: HabitStats;
  monthName: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, monthName }) => {
  return (
    <section className="dashboard-overview" aria-label="Habit statistics overview">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Today's Progress</span>
            <CheckCircle size={15} className="stat-icon" />
          </div>
          <div className="stat-value-row">
            <span className="stat-value">{stats.completedToday} / {stats.totalHabits}</span>
            <span className="stat-pill">{stats.dailyPercentage}%</span>
          </div>
          <div className="stat-bar-track">
            <div
              className="stat-bar-fill"
              style={{ width: `${stats.dailyPercentage}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Best Streak</span>
            <Flame size={15} className="stat-icon streak-flame" />
          </div>
          <div className="stat-value-row">
            <span className="stat-value">{stats.bestStreak} <small>days</small></span>
            <span className="stat-sub">Active: {stats.currentStreak}d</span>
          </div>
          <div className="stat-desc">Consistent daily momentum</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">This Week</span>
            <TrendingUp size={15} className="stat-icon" />
          </div>
          <div className="stat-value-row">
            <span className="stat-value">{stats.weeklyProgress}%</span>
            <span className="stat-sub">past 7 days</span>
          </div>
          <div className="stat-bar-track">
            <div
              className="stat-bar-fill"
              style={{ width: `${stats.weeklyProgress}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">{monthName} Completion</span>
            <Calendar size={15} className="stat-icon" />
          </div>
          <div className="stat-value-row">
            <span className="stat-value">{stats.monthProgress}%</span>
            <span className="stat-sub">{stats.totalMonthCheckIns} checks</span>
          </div>
          <div className="stat-bar-track">
            <div
              className="stat-bar-fill"
              style={{ width: `${stats.monthProgress}%` }}
            />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-label">Active Habits</span>
            <Target size={15} className="stat-icon" />
          </div>
          <div className="stat-value-row">
            <span className="stat-value">{stats.totalHabits}</span>
            <span className="stat-sub">tracked daily</span>
          </div>
          <div className="stat-desc">Small steps, big results</div>
        </div>
      </div>
    </section>
  );
};
