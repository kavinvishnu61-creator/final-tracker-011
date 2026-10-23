import { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  Habit,
  CheckInMap,
  TrackerSettings,
  ViewMode,
  AppearanceMode,
  ToastMessage,
} from './types';
import { DEFAULT_HABITS, MONTH_NAMES, LIGHT_BACKGROUNDS, DARK_BACKGROUNDS } from './constants';
import {
  loadStoredHabits,
  saveStoredHabits,
  loadStoredCheckIns,
  saveStoredCheckIns,
  loadStoredSettings,
  saveStoredSettings,
  generateSampleCheckIns,
  exportMonthToCSV,
  downloadJSONBackup,
} from './utils/storage';
import { getDaysForView, shiftPeriod, formatPeriodLabel, formatDateKey } from './utils/date';
import { calculateHabitStats } from './utils/stats';
import { runAdaptiveContrast } from './utils/adaptiveContrast';
import { LandscapeBackground } from './components/LandscapeBackground';
import { SheetToolbar } from './components/SheetToolbar';
import { DashboardOverview } from './components/DashboardOverview';
import { HabitTable } from './components/HabitTable';
import { HabitModal } from './components/HabitModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { MonthPickerModal } from './components/MonthPickerModal';
import { BackgroundPickerModal } from './components/BackgroundPickerModal';
import { Toast } from './components/Toast';

export function App() {
  const [habits, setHabits] = useState<Habit[]>(loadStoredHabits);
  const [checkIns, setCheckIns] = useState<CheckInMap>(loadStoredCheckIns);
  const [settings, setSettings] = useState<TrackerSettings>(() => {
    const loaded = loadStoredSettings();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get('theme');
      if (themeParam === 'dark' || themeParam === 'light' || themeParam === 'system') {
        loaded.appearance = themeParam;
      }
      const viewParam = params.get('view');
      if (viewParam === 'week' || viewParam === 'fortnight' || viewParam === 'month') {
        loaded.view = viewParam;
      }
      if (params.get('stats') === '1') {
        loaded.showStats = true;
      }
    }
    return loaded;
  });
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [isSampleDataActive, setIsSampleDataActive] = useState<boolean>(true);

  const [isHabitModalOpen, setIsHabitModalOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const p = new URLSearchParams(window.location.search).get('modal');
    return p === 'add' || p === 'edit';
  });
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(() => {
    if (typeof window === 'undefined') return null;
    const p = new URLSearchParams(window.location.search).get('modal');
    if (p === 'edit') return loadStoredHabits()[0] || null;
    return null;
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('modal') === 'month';
  });
  const [isBgPickerOpen, setIsBgPickerOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('modal') === 'bg';
  });

  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((text: string, type: ToastMessage['type'] = 'info') => {
    setToast({
      id: String(Date.now()),
      text,
      type,
    });
  }, []);

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (settings.appearance === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return settings.appearance;
  }, [settings.appearance, systemIsDark]);

  useEffect(() => {
    document.documentElement.dataset.scene = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    saveStoredHabits(newHabits);
  }, []);

  const updateCheckIns = useCallback((newCheckIns: CheckInMap) => {
    setCheckIns(newCheckIns);
    saveStoredCheckIns(newCheckIns);
  }, []);

  const updateSettings = useCallback((newSettings: TrackerSettings) => {
    setSettings(newSettings);
    saveStoredSettings(newSettings);
  }, []);

  const days = useMemo(() => {
    return getDaysForView(settings.view, currentDate);
  }, [settings.view, currentDate]);

  const { range: periodRange, year: periodYear } = useMemo(() => {
    return formatPeriodLabel(settings.view, days);
  }, [settings.view, days]);

  const stats = useMemo(() => {
    return calculateHabitStats(habits, checkIns, currentDate);
  }, [habits, checkIns, currentDate]);

  // Dynamic Contrast Pass for tree / dark mountain backgrounds
  useEffect(() => {
    const currentList = resolvedTheme === 'dark' ? DARK_BACKGROUNDS : LIGHT_BACKGROUNDS;
    const currentIdx = resolvedTheme === 'dark' ? settings.backgroundIndex.dark : settings.backgroundIndex.light;
    const activePreset = currentList[currentIdx] || currentList[0];
    const src = settings.customBackgroundUrl || activePreset.src;
    const pos = settings.customBackgroundUrl ? '50% 50%' : activePreset.position;

    const timer = setTimeout(() => {
      runAdaptiveContrast(src, pos, resolvedTheme, document.getElementById('main-content'));
    }, 100);

    const onResize = () => {
      runAdaptiveContrast(src, pos, resolvedTheme, document.getElementById('main-content'));
    };

    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [resolvedTheme, settings.backgroundIndex, settings.customBackgroundUrl, settings.view, habits, checkIns]);

  const handleToggleCheckIn = useCallback(
    (habitId: string, date: Date) => {
      const key = `${habitId}:${formatDateKey(date)}`;
      const nextChecked = !checkIns[key];
      const next = { ...checkIns };
      if (nextChecked) {
        next[key] = true;
      } else {
        delete next[key];
      }
      updateCheckIns(next);
    },
    [checkIns, updateCheckIns]
  );

  const handleOpenAddHabit = () => {
    setHabitToEdit(null);
    setIsHabitModalOpen(true);
  };

  const handleOpenEditHabit = (habit: Habit) => {
    setHabitToEdit(habit);
    setIsHabitModalOpen(true);
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (habitToEdit) {
      const updated = habits.map((h) =>
        h.id === habitToEdit.id ? ({ ...h, ...habitData } as Habit) : h
      );
      updateHabits(updated);
      showToast(`Saved changes to “${habitData.name}”`, 'success');
    } else {
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        name: habitData.name || 'New habit',
        target: habitData.target,
        category: habitData.category || 'wellbeing',
        frequency: habitData.frequency || 'daily',
        icon: habitData.icon || 'leaf',
        createdAt: new Date().toISOString(),
        order: habits.length,
      };
      updateHabits([...habits, newHabit]);
      showToast(`Created habit “${newHabit.name}”`, 'success');
    }
  };

  const handleRequestDelete = (habit: Habit) => {
    setIsHabitModalOpen(false);
    setHabitToDelete(habit);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (habitId: string) => {
    const deletedHabit = habits.find((h) => h.id === habitId);
    const updatedHabits = habits.filter((h) => h.id !== habitId);
    updateHabits(updatedHabits);

    const nextCheckIns = { ...checkIns };
    Object.keys(nextCheckIns).forEach((key) => {
      if (key.startsWith(`${habitId}:`)) {
        delete nextCheckIns[key];
      }
    });
    updateCheckIns(nextCheckIns);

    setIsDeleteModalOpen(false);
    setHabitToDelete(null);
    showToast(`Deleted “${deletedHabit?.name || 'habit'}”`, 'info');
  };

  const handlePrevPeriod = () => {
    setCurrentDate((d) => shiftPeriod(d, settings.view, -1));
  };

  const handleNextPeriod = () => {
    setCurrentDate((d) => shiftPeriod(d, settings.view, 1));
  };

  const handleViewChange = (view: ViewMode) => {
    updateSettings({ ...settings, view });
  };

  const handleSelectMonthYear = (year: number, monthIndex: number) => {
    const next = new Date(year, monthIndex, 1, 12, 0, 0);
    setCurrentDate(next);
  };

  const handleJumpToToday = () => {
    setCurrentDate(new Date());
  };

  const handleToggleTheme = () => {
    const nextAppearance: AppearanceMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    updateSettings({ ...settings, appearance: nextAppearance });
  };

  const handleSetAppearance = (mode: AppearanceMode) => {
    updateSettings({ ...settings, appearance: mode });
    showToast(`Theme updated to ${mode}`);
  };

  const handleToggleStats = () => {
    const nextVal = !settings.showStats;
    updateSettings({ ...settings, showStats: nextVal });
    showToast(nextVal ? 'Statistics overview shown' : 'Statistics overview hidden');
  };

  const handleSelectBackground = (mode: 'light' | 'dark', index: number) => {
    const nextBgs = { ...settings.backgroundIndex, [mode]: index };
    updateSettings({
      ...settings,
      backgroundIndex: nextBgs,
      customBackgroundUrl: undefined,
    });
    showToast('Background updated', 'success');
  };

  const handleSetCustomUrl = (url: string | undefined) => {
    updateSettings({
      ...settings,
      customBackgroundUrl: url,
    });
    showToast(url ? 'Custom wallpaper applied' : 'Reset to nature wallpaper', 'success');
  };

  const handleExportCSV = () => {
    exportMonthToCSV(habits, checkIns, currentDate.getFullYear(), currentDate.getMonth());
    showToast('Exported habit data to CSV', 'success');
  };

  const handleBackupJSON = () => {
    downloadJSONBackup(habits, checkIns, settings);
    showToast('Downloaded full backup JSON', 'success');
  };

  const handleRestoreJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.habits)) {
          updateHabits(parsed.habits);
          if (parsed.checkIns) updateCheckIns(parsed.checkIns);
          if (parsed.settings) updateSettings({ ...settings, ...parsed.settings });
          showToast('Habit records restored successfully!', 'success');
        } else {
          showToast('Invalid backup file format.', 'error');
        }
      } catch {
        showToast('Error reading backup file.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    updateHabits([]);
    updateCheckIns({});
    setIsSampleDataActive(false);
    showToast('All habit records cleared', 'info');
  };

  const handleResetSampleData = () => {
    const sampleChecks = generateSampleCheckIns(DEFAULT_HABITS, currentDate);
    updateHabits(DEFAULT_HABITS);
    updateCheckIns(sampleChecks);
    setIsSampleDataActive(true);
    showToast('Sample habits and check-ins loaded', 'success');
  };

  return (
    <>
      <LandscapeBackground
        appearance={settings.appearance}
        resolvedTheme={resolvedTheme}
        lightIndex={settings.backgroundIndex.light}
        darkIndex={settings.backgroundIndex.dark}
        customUrl={settings.customBackgroundUrl}
      />

      <main className="sheet" id="main-content">
        <div className="demo-notice">
          Demo template — your changes won't be saved. Ask Kimi to build your own copy with fullstack enabled.
        </div>

        <SheetToolbar
          view={settings.view}
          onViewChange={handleViewChange}
          periodYear={periodYear}
          periodRange={periodRange}
          onPrevPeriod={handlePrevPeriod}
          onNextPeriod={handleNextPeriod}
          onOpenMonthPicker={() => setIsMonthPickerOpen(true)}
          appearance={settings.appearance}
          resolvedTheme={resolvedTheme}
          onToggleTheme={handleToggleTheme}
          onSetAppearance={handleSetAppearance}
          showStats={Boolean(settings.showStats)}
          onToggleStats={handleToggleStats}
          onOpenBackgroundPicker={() => setIsBgPickerOpen(true)}
          onExportCSV={handleExportCSV}
          onBackupJSON={handleBackupJSON}
          onRestoreJSON={handleRestoreJSON}
          onClearData={handleClearData}
          onResetSampleData={handleResetSampleData}
        />

        {settings.showStats && (
          <DashboardOverview
            stats={stats}
            monthName={MONTH_NAMES[currentDate.getMonth()]}
          />
        )}

        <HabitTable
          habits={habits}
          view={settings.view}
          days={days}
          checkIns={checkIns}
          onToggleCheckIn={handleToggleCheckIn}
          onAddHabit={handleOpenAddHabit}
          onEditHabit={handleOpenEditHabit}
          isSampleDataActive={isSampleDataActive}
        />
      </main>

      <HabitModal
        isOpen={isHabitModalOpen}
        onClose={() => setIsHabitModalOpen(false)}
        habitToEdit={habitToEdit}
        onSave={handleSaveHabit}
        onRequestDelete={handleRequestDelete}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        habit={habitToDelete}
        onConfirm={handleConfirmDelete}
      />

      <MonthPickerModal
        isOpen={isMonthPickerOpen}
        onClose={() => setIsMonthPickerOpen(false)}
        currentDate={currentDate}
        onSelectMonthYear={handleSelectMonthYear}
        onJumpToToday={handleJumpToToday}
      />

      <BackgroundPickerModal
        isOpen={isBgPickerOpen}
        onClose={() => setIsBgPickerOpen(false)}
        resolvedTheme={resolvedTheme}
        lightIndex={settings.backgroundIndex.light}
        darkIndex={settings.backgroundIndex.dark}
        onSelectBackground={handleSelectBackground}
        customUrl={settings.customBackgroundUrl}
        onSetCustomUrl={handleSetCustomUrl}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}

export default App;
