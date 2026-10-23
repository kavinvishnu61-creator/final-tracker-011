import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import type { Habit, HabitCategory, HabitFrequency } from '../types';
import { CATEGORIES, FREQUENCIES, AVAILABLE_ICONS } from '../constants';
import { HabitIcon } from './HabitIcon';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitToEdit?: Habit | null;
  onSave: (habitData: Partial<Habit>) => void;
  onRequestDelete?: (habit: Habit) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  habitToEdit,
  onSave,
  onRequestDelete,
}) => {
  const isEditing = Boolean(habitToEdit);

  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState<HabitCategory>('wellbeing');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [icon, setIcon] = useState('leaf');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (habitToEdit) {
        setName(habitToEdit.name);
        setTarget(habitToEdit.target || '');
        setCategory(habitToEdit.category);
        setFrequency(habitToEdit.frequency);
        setIcon(habitToEdit.icon);
      } else {
        setName('');
        setTarget('');
        setCategory('wellbeing');
        setFrequency('daily');
        setIcon('leaf');
      }
      setError(null);
    }
  }, [isOpen, habitToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Habit names must contain 1–24 characters.');
      return;
    }
    if (trimmed.length > 24) {
      setError('Habit names must contain 1–24 characters.');
      return;
    }
    if (target && target.length > 40) {
      setError('Goals must be 40 characters or fewer.');
      return;
    }

    onSave({
      name: trimmed,
      target: target.trim() || undefined,
      category,
      frequency,
      icon,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2 id="habit-modal-title">{isEditing ? 'Edit habit' : 'Add habit'}</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live habit preview matching reference */}
        <div className="editor-preview">
          <div className="habit-icon">
            <HabitIcon name={icon} size={22} />
          </div>
          <div>
            <strong>{name.trim() || 'Your new habit'}</strong>
            <span>{target.trim() || 'Set a small, specific goal'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <label className="form-field">
            Habit name
            <span>Required</span>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="For example, read before bed"
              maxLength={24}
              autoFocus
              required
            />
          </label>

          {/* Small Goal Field */}
          <label className="form-field">
            Set a small goal
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="For example, read for 20 minutes"
              maxLength={40}
            />
          </label>

          {/* Two Columns: Category & Repeat */}
          <div className="form-columns">
            <label className="form-field">
              Category
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as HabitCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-field">
              Repeat
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Icon Picker (12 reference icons, no colors) */}
          <fieldset className="icon-picker">
            <legend>Choose an icon</legend>
            {AVAILABLE_ICONS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={icon === item.id ? 'selected' : ''}
                onClick={() => setIcon(item.id)}
                title={item.label}
                aria-label={item.label}
              >
                <HabitIcon name={item.id} size={18} />
              </button>
            ))}
          </fieldset>

          {isEditing && (
            <p className="form-hint" style={{ marginTop: '16px' }}>
              Changing the schedule keeps your existing check-ins.
            </p>
          )}

          {error && <div className="form-error">{error}</div>}

          {/* Actions */}
          <div className="modal-actions">
            {isEditing && habitToEdit && onRequestDelete ? (
              <button
                type="button"
                className="text-button danger"
                onClick={() => onRequestDelete(habitToEdit)}
              >
                Delete habit
              </button>
            ) : (
              <span className="form-hint" />
            )}

            <button
              type="submit"
              className="button primary"
              disabled={!name.trim()}
            >
              {!isEditing && <Plus size={14} style={{ marginRight: 2 }} />}
              <span>{isEditing ? 'Save changes' : 'Add habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
