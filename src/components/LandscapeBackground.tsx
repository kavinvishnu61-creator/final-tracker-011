import React, { useEffect } from 'react';
import { LIGHT_BACKGROUNDS, DARK_BACKGROUNDS } from '../constants';
import type { AppearanceMode } from '../types';

interface LandscapeBackgroundProps {
  appearance: AppearanceMode;
  resolvedTheme: 'light' | 'dark';
  lightIndex: number;
  darkIndex: number;
  customUrl?: string;
}

export const LandscapeBackground: React.FC<LandscapeBackgroundProps> = ({
  resolvedTheme,
  lightIndex,
  darkIndex,
  customUrl,
}) => {
  const currentList = resolvedTheme === 'dark' ? DARK_BACKGROUNDS : LIGHT_BACKGROUNDS;
  const currentIndex = resolvedTheme === 'dark' ? darkIndex : lightIndex;
  const safeIndex = Math.max(0, Math.min(currentIndex, currentList.length - 1));
  const activePreset = currentList[safeIndex];

  const activeSrc = customUrl || activePreset.src;
  const activePosition = customUrl ? 'center center' : activePreset.position;

  useEffect(() => {
    const img = new Image();
    img.src = activeSrc;
  }, [activeSrc]);

  return (
    <div className="landscape" aria-hidden="true">
      <div
        className="landscape-layer"
        style={{
          backgroundImage: `url(${activeSrc})`,
          backgroundPosition: activePosition,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          position: 'absolute',
          inset: 0,
          transition: 'background-image 0.5s ease-in-out, opacity 0.5s ease-in-out',
        }}
      />
      <div
        className="landscape-overlay"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor:
            resolvedTheme === 'dark'
              ? 'rgba(7, 20, 36, 0.25)'
              : 'rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
