import React from 'react';
import {
  Droplet,
  BookOpen,
  Dumbbell,
  Flower2,
  Sun,
  Moon,
  Footprints,
  Leaf,
  Heart,
  Pencil,
  Coffee,
  Music,
  Bike,
  Flame,
  Zap,
  Target,
  Smile,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface HabitIconProps extends LucideProps {
  name: string;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, size = 18, strokeWidth = 1.2, className, ...props }) => {
  switch (name.toLowerCase()) {
    case 'droplet':
    case 'water':
      return <Droplet size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'book':
    case 'reading':
      return <BookOpen size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'dumbbell':
    case 'exercise':
    case 'move':
      return <Dumbbell size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'flower':
    case 'meditation':
    case 'pause':
      return <Flower2 size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'sun':
    case 'rise':
      return <Sun size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'moon':
    case 'sleep':
      return <Moon size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'footprints':
    case 'walk':
      return <Footprints size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'leaf':
    case 'eat':
      return <Leaf size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'heart':
    case 'thanks':
    case 'gratitude':
      return <Heart size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'pencil':
    case 'write':
      return <Pencil size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'coffee':
      return <Coffee size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'music':
      return <Music size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'bike':
      return <Bike size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'flame':
      return <Flame size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'zap':
      return <Zap size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    case 'target':
      return <Target size={size} strokeWidth={strokeWidth} className={className} {...props} />;
    default:
      return <Smile size={size} strokeWidth={strokeWidth} className={className} {...props} />;
  }
};
