import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Sun, Moon, MoreHorizontal, BarChart2 } from 'lucide-react';
import type { ViewMode, AppearanceMode } from '../types';
import { OptionsMenu } from './OptionsMenu';

interface SheetToolbarProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  periodYear: string;
  periodRange: string;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  onOpenMonthPicker: () => void;
  appearance: AppearanceMode;
  resolvedTheme: 'light' | 'dark';
  onToggleTheme: () => void;
  onSetAppearance: (mode: AppearanceMode) => void;
  showStats: boolean;
  onToggleStats: () => void;
  onOpenBackgroundPicker: () => void;
  onExportCSV: () => void;
  onBackupJSON: () => void;
  onRestoreJSON: (file: File) => void;
  onClearData: () => void;
  onResetSampleData: () => void;
}

export const SheetToolbar: React.FC<SheetToolbarProps> = ({
  view,
  onViewChange,
  periodYear,
  periodRange,
  onPrevPeriod,
  onNextPeriod,
  onOpenMonthPicker,
  appearance,
  resolvedTheme,
  onToggleTheme,
  onSetAppearance,
  showStats,
  onToggleStats,
  onOpenBackgroundPicker,
  onExportCSV,
  onBackupJSON,
  onRestoreJSON,
  onClearData,
  onResetSampleData,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('menu') === '1';
  });

  return (
    <header className="sheet-toolbar" aria-label="Habit sheet controls">
      <nav className="view-switch" aria-label="Calendar view selector">
        <button
          type="button"
          className={view === 'week' ? 'active' : ''}
          onClick={() => onViewChange('week')}
          aria-pressed={view === 'week'}
        >
          Week
        </button>
        <button
          type="button"
          className={view === 'fortnight' ? 'active' : ''}
          onClick={() => onViewChange('fortnight')}
          aria-pressed={view === 'fortnight'}
        >
          2 weeks
        </button>
        <button
          type="button"
          className={view === 'month' ? 'active' : ''}
          onClick={() => onViewChange('month')}
          aria-pressed={view === 'month'}
        >
          Month
        </button>
      </nav>

      <div className="period-switcher">
        <span className="period-year">{periodYear}</span>

        <button
          type="button"
          className="icon-button period-arrow"
          onClick={onPrevPeriod}
          aria-label="Previous period"
          title="Previous period"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          className="period-label"
          onClick={onOpenMonthPicker}
          aria-label="Select month or date"
          title="Click to jump to month"
        >
          <h1 className="period-range">{periodRange}</h1>
        </button>

        <button
          type="button"
          className="icon-button period-arrow"
          onClick={onNextPeriod}
          aria-label="Next period"
          title="Next period"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="toolbar-end">
        <button
          type="button"
          className={`icon-button ${showStats ? 'active-icon' : ''}`}
          onClick={onToggleStats}
          aria-label={showStats ? 'Hide statistics' : 'Show statistics'}
          title="Habit statistics overview"
        >
          <BarChart2 size={16} />
        </button>

        <button
          type="button"
          className="icon-button appearance-toggle"
          onClick={onToggleTheme}
          aria-label={resolvedTheme === 'dark' ? 'Switch to light background' : 'Switch to dark background'}
          title={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <div className="menu-anchor">
          <button
            type="button"
            className="icon-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Tracker options"
            aria-expanded={isMenuOpen}
            title="Options and settings"
          >
            <MoreHorizontal size={17} />
          </button>

          <OptionsMenu
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onOpenBackgroundPicker={onOpenBackgroundPicker}
            onExportCSV={onExportCSV}
            onBackupJSON={onBackupJSON}
            onRestoreJSON={onRestoreJSON}
            onClearData={onClearData}
            onResetSampleData={onResetSampleData}
            appearance={appearance}
            onSetAppearance={onSetAppearance}
            showStats={showStats}
            onToggleStats={onToggleStats}
          />
        </div>
      </div>
    </header>
  );
};
