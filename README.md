# Minimalist Spreadsheet Habit Tracker

A modern, responsive habit-tracking web application faithfully recreated and enhanced from the reference design ([habit-sheet-en.kimi.site](https://habit-sheet-en.kimi.site/)).

Featuring calm, high-definition nature landscape photography backgrounds, a spreadsheet-inspired daily check-in grid, dynamic statistics calculations, and complete client-side persistence.

---

## ✨ Features

- **Spreadsheet-Inspired Daily Grid**:
  - Interactive rows for habits with icons, titles, and scheduled frequencies.
  - Columns for each day (Week, 2-week, or full Month view).
  - Clear visual distinction between completed (`✓`), incomplete, and unscheduled rest days (`—`).
  - Highlighting for today's date (`(23)`).
  - Smooth cell hover and focus states with keyboard accessibility.
  - Sticky habit name column on mobile devices for seamless horizontal scrolling.

- **Dynamic Landscape Photography Backgrounds**:
  - 3 Light Mode Presets: *Lone Tree*, *Winter River*, *Above the Clouds*.
  - 3 Dark Mode Presets: *Starlit Peak*, *Blue Hour Ridge*, *Blue Coast*.
  - Custom wallpaper URL support.
  - Dynamic Adaptive Contrast algorithm that samples the background photography and adjusts text/checkmark ink color for optimal readability over dark and bright areas.

- **Habit Management**:
  - Create new habits with live preview.
  - Edit habit name, optional small goal, category, frequency schedule, icon, and accent color.
  - Delete habits with confirmation dialog.
  - Categorization: *Wellbeing*, *Personal growth*, *Lifestyle*, *Productivity*, *Health & Fitness*.
  - Schedules: *Every day*, *Weekdays*, *Weekends*.

- **Dynamic Statistics & Progress**:
  - Today's completion count and percentage with progress indicator.
  - Current streak and all-time best streak tracking with momentum badge.
  - Rolling 7-day weekly completion percentage.
  - Month-to-date completion rate and total check-in count.
  - All statistics update in real-time on every check-in toggle.

- **Import, Export & Data Safety**:
  - **Local Persistence**: All habits, check-ins, and settings persist automatically to `localStorage`.
  - **Export CSV**: Download complete month record as formatted CSV with per-day binary check-ins and completion rate.
  - **JSON Backup**: Download a timestamped JSON backup of all habits, history, and preferences.
  - **Restore Backup**: One-click restore from JSON backup file.
  - **Sample Data**: Easy reset and clear options for testing.

- **Theme & Appearance**:
  - Light mode, Dark mode, or automatic System theme matching `prefers-color-scheme`.
  - Instant theme switching without layout shifts.

---

## 🛠️ Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Custom CSS Design System
- **Icons**: Lucide React
- **Typography**: DM Sans (Google Fonts)

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Quick Start
```bash
# Navigate to the project directory
cd habit-tracker

# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Or build and run production preview
npm run build
npm run preview
```

Open [http://localhost:5173/](http://localhost:5173/) in your web browser.

---

## 📁 Project Architecture

```
habit-tracker/
├── public/
│   └── backgrounds/          # High-definition WebP nature photography presets
├── src/
│   ├── components/
│   │   ├── BackgroundPickerModal.tsx  # Wallpaper gallery & custom URL dialog
│   │   ├── DashboardOverview.tsx      # Real-time habit statistics cards
│   │   ├── DeleteConfirmModal.tsx     # Destructive action confirmation dialog
│   │   ├── HabitIcon.tsx              # Dynamic Lucide icon mapper
│   │   ├── HabitModal.tsx             # Add & Edit habit dialog with live preview
│   │   ├── HabitTable.tsx             # Spreadsheet daily check-in grid
│   │   ├── LandscapeBackground.tsx    # HD wallpaper layer with smooth transitions
│   │   ├── MonthPickerModal.tsx       # Quick calendar month/year selector
│   │   ├── OptionsMenu.tsx            # Dropdown menu for export/backup/settings
│   │   ├── SheetToolbar.tsx           # Top navigation and period controls
│   │   └── Toast.tsx                  # User notification toasts
│   ├── constants/
│   │   └── index.ts                   # Presets, categories, colors, default habits
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces & types
│   ├── utils/
│   │   ├── adaptiveContrast.ts        # Dynamic canvas pixel luminance analyzer
│   │   ├── date.ts                    # Date math, ISO formatting & range utilities
│   │   ├── stats.ts                   # Real-time completion & streak algorithms
│   │   └── storage.ts                 # LocalStorage, CSV export & JSON backup/restore
│   ├── App.tsx                        # Main state orchestrator
│   ├── index.css                      # Design system, glassmorphism & responsive CSS
│   └── main.tsx                       # React application root
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
