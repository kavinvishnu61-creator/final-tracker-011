import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Habit, HabitCategory, HabitFrequency, HabitColor } from '../types';
import { CATEGORIES, FREQUENCIES, AVAILABLE_ICONS, AVAILABLE_COLORS } from '../constants';
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
  const [icon, setIcon] = useState('droplet');
  const [color, setColor] = useState<HabitColor>('blue');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (habitToEdit) {
        setName(habitToEdit.name);
        setTarget(habitToEdit.target || '');
        setCategory(habitToEdit.category);
        setFrequency(habitToEdit.frequency);
        setIcon(habitToEdit.icon);
        setColor(habitToEdit.color);
      } else {
        setName('');
        setTarget('');
        setCategory('wellbeing');
        setFrequency('daily');
        setIcon('target');
        setColor('blue');
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
      color,
    });
    onClose();
  };

  const selectedColorMeta = AVAILABLE_COLORS.find((c) => c.id === color) || AVAILABLE_COLORS[0];

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
            <h2 id="habit-modal-title">{isEditing ? 'Edit habit' : 'Your new habit'}</h2>
            <p>Set a small, specific daily goal to build lasting habits.</p>
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

        <div className="editor-preview">
          <div
            className="habit-icon"
            style={{
              color: selectedColorMeta.hex,
              borderColor: selectedColorMeta.hex,
            }}
          >
            <HabitIcon name={icon} size={20} />
          </div>
          <div>
            <strong>{name || 'New habit'}</strong>
            <span>{target || 'Set a small goal'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="form-field">
            Habit name
            <span>Required ({name.length}/24)</span>
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

          <label className="form-field">
            Set a small goal
            <span>Optional ({target.length}/40)</span>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="For example, read for 20 minutes"
              maxLength={40}
            />
          </label>

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
                <HabitIcon name={item.id} size={16} />
              </button>
            ))}
          </fieldset>

          <div style={{ marginTop: '18px' }}>
            <span style={{ fontSize: '11px', color: 'var(--surface-muted)', display: 'block', marginBottom: '8px' }}>
              Accent color
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {AVAILABLE_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: c.hex,
                    border: color === c.id ? '2px solid var(--surface-text)' : '2px solid transparent',
                    outlineOffset: '2px',
                    transition: 'transform 0.15s ease',
                    transform: color === c.id ? 'scale(1.15)' : 'scale(1)',
                  }}
                  title={c.label}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div className="modal-actions">
            <div>
              {isEditing && habitToEdit && onRequestDelete && (
                <button
                  type="button"
                  className="danger"
                  onClick={() => onRequestDelete(habitToEdit)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  <Trash2 size={13} />
                  <span>Delete habit</span>
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="button" className="button secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="button primary">
                {isEditing ? 'Save changes' : 'Create habit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
