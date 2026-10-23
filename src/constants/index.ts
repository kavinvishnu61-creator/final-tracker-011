import type { BackgroundPreset, Habit, HabitCategory, HabitFrequency, HabitColor } from '../types';

export const LIGHT_BACKGROUNDS: BackgroundPreset[] = [
  {
    id: 'lone-tree',
    name: 'Lone Tree',
    src: '/backgrounds/portfolio-mountain-07.webp',
    position: '6% 50%',
    mode: 'light',
  },
  {
    id: 'winter-river',
    name: 'Winter River',
    src: '/backgrounds/portfolio-mountain-11.webp',
    position: '50% 50%',
    mode: 'light',
  },
  {
    id: 'above-the-clouds',
    name: 'Above the Clouds',
    src: '/backgrounds/portfolio-mountain-01.webp',
    position: '50% 50%',
    mode: 'light',
  },
];

export const DARK_BACKGROUNDS: BackgroundPreset[] = [
  {
    id: 'starlit-peak',
    name: 'Starlit Peak',
    src: '/backgrounds/portfolio-mountain-04.webp',
    position: '60% 50%',
    mode: 'dark',
  },
  {
    id: 'blue-hour-ridge',
    name: 'Blue Hour Ridge',
    src: '/backgrounds/portfolio-mountain-02.webp',
    position: '50% 50%',
    mode: 'dark',
  },
  {
    id: 'blue-coast',
    name: 'Blue Coast',
    src: '/backgrounds/portfolio-coast-08.webp',
    position: '50% 50%',
    mode: 'dark',
  },
];

export const CATEGORIES: { id: HabitCategory; label: string }[] = [
  { id: 'wellbeing', label: 'Wellbeing' },
  { id: 'growth', label: 'Personal growth' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'health', label: 'Health & Fitness' },
];

export const FREQUENCIES: { id: HabitFrequency; label: string }[] = [
  { id: 'daily', label: 'Every day' },
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' },
];

export const AVAILABLE_ICONS = [
  { id: 'droplet', label: 'Water' },
  { id: 'book', label: 'Reading' },
  { id: 'dumbbell', label: 'Exercise' },
  { id: 'flower', label: 'Meditation' },
  { id: 'sun', label: 'Sun / Rise' },
  { id: 'moon', label: 'Moon / Sleep' },
  { id: 'footprints', label: 'Walking' },
  { id: 'leaf', label: 'Nutrition' },
  { id: 'heart', label: 'Gratitude' },
  { id: 'pencil', label: 'Writing' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'music', label: 'Music' },
  { id: 'bike', label: 'Cycling' },
  { id: 'flame', label: 'Focus' },
  { id: 'zap', label: 'Energy' },
  { id: 'target', label: 'Goal' },
];

export const AVAILABLE_COLORS: { id: HabitColor; label: string; hex: string; lightBg: string; darkBg: string }[] = [
  { id: 'blue', label: 'Blue', hex: '#3b82f6', lightBg: 'rgba(59, 130, 246, 0.12)', darkBg: 'rgba(59, 130, 246, 0.25)' },
  { id: 'purple', label: 'Purple', hex: '#a855f7', lightBg: 'rgba(168, 85, 247, 0.12)', darkBg: 'rgba(168, 85, 247, 0.25)' },
  { id: 'orange', label: 'Orange', hex: '#f97316', lightBg: 'rgba(249, 115, 22, 0.12)', darkBg: 'rgba(249, 115, 22, 0.25)' },
  { id: 'green', label: 'Green', hex: '#22c55e', lightBg: 'rgba(34, 197, 94, 0.12)', darkBg: 'rgba(34, 197, 94, 0.25)' },
  { id: 'teal', label: 'Teal', hex: '#14b8a6', lightBg: 'rgba(20, 184, 166, 0.12)', darkBg: 'rgba(20, 184, 166, 0.25)' },
  { id: 'rose', label: 'Rose', hex: '#f43f5e', lightBg: 'rgba(244, 63, 94, 0.12)', darkBg: 'rgba(244, 63, 94, 0.25)' },
  { id: 'amber', label: 'Amber', hex: '#f59e0b', lightBg: 'rgba(245, 158, 11, 0.12)', darkBg: 'rgba(245, 158, 11, 0.25)' },
  { id: 'indigo', label: 'Indigo', hex: '#6366f1', lightBg: 'rgba(99, 102, 241, 0.12)', darkBg: 'rgba(99, 102, 241, 0.25)' },
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-water',
    name: 'Water',
    target: 'Drink 8 glasses of water',
    icon: 'droplet',
    color: 'blue',
    category: 'wellbeing',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 0,
  },
  {
    id: 'habit-read',
    name: 'Read',
    target: 'Read for 20 minutes',
    icon: 'book',
    color: 'purple',
    category: 'growth',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: 'habit-move',
    name: 'Move',
    target: 'Move for 30 minutes',
    icon: 'dumbbell',
    color: 'orange',
    category: 'wellbeing',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: 'habit-pause',
    name: 'Pause',
    target: 'Meditate for 10 minutes',
    icon: 'flower',
    color: 'green',
    category: 'wellbeing',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 3,
  },
  {
    id: 'habit-rise',
    name: 'Rise',
    target: 'Wake up by 7:00 a.m.',
    icon: 'sun',
    color: 'orange',
    category: 'lifestyle',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 4,
  },
  {
    id: 'habit-eat',
    name: 'Eat',
    target: 'Enjoy a serving of fruit and vegetables',
    icon: 'leaf',
    color: 'teal',
    category: 'lifestyle',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 5,
  },
  {
    id: 'habit-thanks',
    name: 'Thanks',
    target: 'Write down one thing you appreciate',
    icon: 'heart',
    color: 'rose',
    category: 'growth',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 6,
  },
  {
    id: 'habit-sleep',
    name: 'Sleep',
    target: 'Put your phone away by 11:00 p.m.',
    icon: 'moon',
    color: 'purple',
    category: 'lifestyle',
    frequency: 'daily',
    createdAt: new Date().toISOString(),
    order: 7,
  },
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
