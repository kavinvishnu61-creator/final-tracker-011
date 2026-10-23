/**
 * Adaptive Contrast Analyzer
 * Samples the underlying background image pixels behind text and icons
 * to dynamically flip ink color to #fff over dark regions (e.g. pine tree, mountain rocks)
 * and #000 over light regions (e.g. snow, bright sky).
 */

export function runAdaptiveContrast(
  imageSrc: string,
  imagePosition: string,
  resolvedTheme: 'light' | 'dark',
  container: HTMLElement | null
) {
  if (!container || typeof window === 'undefined') return () => {};

  let isCancelled = false;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageSrc;

  img.onload = () => {
    if (isCancelled) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      canvas.width = vw;
      canvas.height = vh;

      // Calculate object-fit: cover and position
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const screenRatio = vw / vh;
      let drawW = vw;
      let drawH = vh;
      let offsetX = 0;
      let offsetY = 0;

      if (screenRatio > imgRatio) {
        drawW = vw;
        drawH = vw / imgRatio;
      } else {
        drawH = vh;
        drawW = vh * imgRatio;
      }

      // Parse position (e.g. "6% 50%" or "50% 50%")
      const posParts = imagePosition.split(' ');
      const posXPercent = parseFloat(posParts[0]) || 50;
      const posYPercent = parseFloat(posParts[1]) || 50;

      offsetX = (vw - drawW) * (posXPercent / 100);
      offsetY = (vh - drawH) * (posYPercent / 100);

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      // Now sample all elements that need high contrast
      const targets = container.querySelectorAll<HTMLElement>(
        '.habit-name, .check-cell, .habit-heading, .weekday, .date-number, .add-habit, .space-hint'
      );

      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Sample center point and 4 quadrant points
        const cx = Math.max(0, Math.min(vw - 1, Math.floor(rect.left + rect.width / 2)));
        const cy = Math.max(0, Math.min(vh - 1, Math.floor(rect.top + rect.height / 2)));

        try {
          const pixel = ctx.getImageData(cx, cy, 1, 1).data;
          // Luminance formula
          const lum = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];

          if (lum < 115) {
            // Dark background under element -> white text/icon
            el.dataset.adaptiveTone = 'white';
            el.style.setProperty('--adaptive-ink', '#ffffff');
            el.style.color = '#ffffff';
          } else {
            // Light background under element -> scene ink
            el.dataset.adaptiveTone = 'black';
            el.style.setProperty(
              '--adaptive-ink',
              resolvedTheme === 'dark' ? '#ffffff' : '#111111'
            );
            el.style.color = resolvedTheme === 'dark' ? '#ffffff' : '#111111';
          }
        } catch {
          // If getImageData fails due to cross-origin or canvas restrictions, fallback gracefully
        }
      });
    } catch (e) {
      console.warn('Adaptive contrast pass error', e);
    }
  };

  return () => {
    isCancelled = true;
  };
}
