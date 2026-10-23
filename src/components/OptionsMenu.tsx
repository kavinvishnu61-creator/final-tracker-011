import React, { useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Download,
  Upload,
  Database,
  Trash2,
  RefreshCw,
  Sun,
  Moon,
  Monitor,
  BarChart2,
} from 'lucide-react';
import type { AppearanceMode } from '../types';

interface OptionsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBackgroundPicker: () => void;
  onExportCSV: () => void;
  onBackupJSON: () => void;
  onRestoreJSON: (file: File) => void;
  onClearData: () => void;
  onResetSampleData: () => void;
  appearance: AppearanceMode;
  onSetAppearance: (mode: AppearanceMode) => void;
  showStats: boolean;
  onToggleStats: () => void;
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({
  isOpen,
  onClose,
  onOpenBackgroundPicker,
  onExportCSV,
  onBackupJSON,
  onRestoreJSON,
  onClearData,
  onResetSampleData,
  appearance,
  onSetAppearance,
  showStats,
  onToggleStats,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRestoreJSON(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onClose();
    }
  };

  return (
    <div ref={menuRef} className="options-menu" role="menu">
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onOpenBackgroundPicker();
          onClose();
        }}
      >
        <ImageIcon size={14} />
        <span>Change background</span>
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onToggleStats();
          onClose();
        }}
      >
        <BarChart2 size={14} />
        <span>{showStats ? 'Hide statistics' : 'Show statistics'}</span>
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onExportCSV();
          onClose();
        }}
      >
        <Download size={14} />
        <span>Export this month</span>
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onBackupJSON();
          onClose();
        }}
      >
        <Database size={14} />
        <span>Back up all records</span>
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        <Upload size={14} />
        <span>Restore backup</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <div style={{ height: '1px', background: 'var(--surface-line)', margin: '4px 0' }} />

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onClearData();
          onClose();
        }}
      >
        <Trash2 size={14} />
        <span>Clear sample data</span>
      </button>

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onResetSampleData();
          onClose();
        }}
      >
        <RefreshCw size={14} />
        <span>Reset sample data</span>
      </button>

      <div style={{ height: '1px', background: 'var(--surface-line)', margin: '4px 0' }} />

      <button
        type="button"
        role="menuitem"
        onClick={() => {
          const next =
            appearance === 'system'
              ? 'light'
              : appearance === 'light'
              ? 'dark'
              : 'system';
          onSetAppearance(next);
          onClose();
        }}
      >
        {appearance === 'system' ? (
          <Monitor size={14} />
        ) : appearance === 'light' ? (
          <Sun size={14} />
        ) : (
          <Moon size={14} />
        )}
        <span>
          {appearance === 'system'
            ? 'Theme: System (Auto)'
            : appearance === 'light'
            ? 'Theme: Light'
            : 'Theme: Dark'}
        </span>
      </button>
    </div>
  );
};
