import type { BackgroundPreset, Habit, HabitCategory, HabitFrequency } from '../types';

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
  { id: 'sun', label: 'Sun' },
  { id: 'moon', label: 'Moon' },
  { id: 'footprints', label: 'Walking' },
  { id: 'leaf', label: 'Leaf' },
  { id: 'heart', label: 'Heart' },
  { id: 'pencil', label: 'Writing' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'music', label: 'Music' },
];

export const DEFAULT_HABITS: Habit[] = [
  {
    id: 'habit-water',
    name: 'Water',
    target: 'Drink 8 glasses of water',
    icon: 'droplet',
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
