import React, { useEffect, useRef } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import type { Habit } from '../types';

interface DeleteConfirmModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (habitId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  habit,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !habit) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        ref={modalRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2 id="delete-dialog-title">Delete this habit?</h2>
            <p>
              “{habit.name}” and all its recorded check-ins will be permanently removed.
            </p>
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

        <div className="modal-actions" style={{ justifyContent: 'flex-end', gap: '10px' }}>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="button danger-btn"
            onClick={() => onConfirm(habit.id)}
          >
            <AlertTriangle size={13} style={{ marginRight: 4 }} />
            Delete habit
          </button>
        </div>
      </div>
    </div>
  );
};
