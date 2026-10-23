import React, { useState } from 'react';
import { X, Check, Link as LinkIcon } from 'lucide-react';
import { LIGHT_BACKGROUNDS, DARK_BACKGROUNDS } from '../constants';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  resolvedTheme: 'light' | 'dark';
  lightIndex: number;
  darkIndex: number;
  onSelectBackground: (mode: 'light' | 'dark', index: number) => void;
  customUrl?: string;
  onSetCustomUrl: (url: string | undefined) => void;
}

export const BackgroundPickerModal: React.FC<BackgroundPickerModalProps> = ({
  isOpen,
  onClose,
  resolvedTheme,
  lightIndex,
  darkIndex,
  onSelectBackground,
  customUrl,
  onSetCustomUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'light' | 'dark'>(resolvedTheme);
  const [customInput, setCustomInput] = useState(customUrl || '');

  if (!isOpen) return null;

  const currentPresets = activeTab === 'light' ? LIGHT_BACKGROUNDS : DARK_BACKGROUNDS;
  const selectedIdx = activeTab === 'light' ? lightIndex : darkIndex;

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSetCustomUrl(customInput.trim());
    } else {
      onSetCustomUrl(undefined);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bg-picker-title"
        style={{ width: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2 id="bg-picker-title">Change background</h2>
            <p>Select calm nature photography or provide a custom image</p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '18px',
            borderBottom: '1px solid var(--surface-line)',
            paddingBottom: '8px',
          }}
        >
          <button
            type="button"
            className={`text-button ${activeTab === 'light' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('light')}
            style={{
              padding: '6px 12px',
              borderBottom: activeTab === 'light' ? '2px solid var(--surface-text)' : '2px solid transparent',
              fontWeight: activeTab === 'light' ? 500 : 400,
            }}
          >
            Light collection ({LIGHT_BACKGROUNDS.length})
          </button>
          <button
            type="button"
            className={`text-button ${activeTab === 'dark' ? 'active-tab' : ''}`}
            onClick={() => setActiveTab('dark')}
            style={{
              padding: '6px 12px',
              borderBottom: activeTab === 'dark' ? '2px solid var(--surface-text)' : '2px solid transparent',
              fontWeight: activeTab === 'dark' ? 500 : 400,
            }}
          >
            Dark collection ({DARK_BACKGROUNDS.length})
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {currentPresets.map((preset, idx) => {
            const isSelected = !customUrl && selectedIdx === idx && activeTab === resolvedTheme;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSetCustomUrl(undefined);
                  onSelectBackground(activeTab, idx);
                  onClose();
                }}
                style={{
                  position: 'relative',
                  aspectRatio: '16/10',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--surface-text)' : '1px solid var(--surface-line)',
                  padding: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <img
                  src={preset.src}
                  alt={preset.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: preset.position,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '6px 8px',
                    color: '#fff',
                  }}
                >
                  <span style={{ fontSize: '10px', fontWeight: 500 }}>{preset.name}</span>
                </div>
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      borderRadius: '50%',
                      padding: '2px',
                      display: 'flex',
                    }}
                  >
                    <Check size={12} color="#fff" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleApplyCustom}>
          <label className="form-field" style={{ marginTop: '10px' }}>
            Custom wallpaper URL
            <span>Direct image link</span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <input
                type="url"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                style={{ flex: 1 }}
              />
              <button type="submit" className="button secondary">
                <LinkIcon size={12} style={{ marginRight: 4 }} />
                Apply
              </button>
            </div>
          </label>
        </form>

        <div className="modal-actions" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="button secondary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
