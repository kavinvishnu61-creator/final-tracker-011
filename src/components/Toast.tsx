import React, { useEffect } from 'react';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const renderIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={14} style={{ color: '#22c55e' }} />;
      case 'warning':
        return <AlertTriangle size={14} style={{ color: '#f59e0b' }} />;
      case 'error':
        return <AlertCircle size={14} style={{ color: '#ef4444' }} />;
      default:
        return <Info size={14} style={{ color: '#3b82f6' }} />;
    }
  };

  return (
    <div className="toast" role="status" aria-live="polite">
      {renderIcon()}
      <span>{toast.text}</span>
      <button
        type="button"
        className="icon-button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        <X size={13} />
      </button>
    </div>
  );
};
