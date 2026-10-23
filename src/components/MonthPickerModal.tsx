import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { MONTH_NAMES } from '../constants';

interface MonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  onSelectMonthYear: (year: number, monthIndex: number) => void;
  onJumpToToday: () => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  onSelectMonthYear,
  onJumpToToday,
}) => {
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  if (!isOpen) return null;

  const currentMonthIdx = currentDate.getMonth();
  const currentActualYear = new Date().getFullYear();
  const currentActualMonth = new Date().getMonth();

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="month-picker-title"
        style={{ width: '380px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <h2 id="month-picker-title">Choose a month</h2>
            <p>Jump directly to any calendar month</p>
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

        {/* Year Navigator */}
        <div className="year-picker">
          <button
            type="button"
            className="icon-button"
            onClick={() => setSelectedYear((y) => y - 1)}
            aria-label="Previous year"
          >
            <ChevronLeft size={16} />
          </button>
          <strong>{selectedYear}</strong>
          <button
            type="button"
            className="icon-button"
            onClick={() => setSelectedYear((y) => y + 1)}
            aria-label="Next year"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Month grid */}
        <div className="month-options">
          {MONTH_NAMES.map((name, index) => {
            const isSelected =
              selectedYear === currentDate.getFullYear() &&
              index === currentMonthIdx;
            const isCurrentMonthNow =
              selectedYear === currentActualYear && index === currentActualMonth;

            return (
              <button
                key={name}
                type="button"
                className={isSelected ? 'selected' : ''}
                onClick={() => {
                  onSelectMonthYear(selectedYear, index);
                  onClose();
                }}
                style={{
                  position: 'relative',
                  fontWeight: isCurrentMonthNow ? 500 : 400,
                }}
              >
                {name.slice(0, 3)}
                {isCurrentMonthNow && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'currentColor',
                      opacity: 0.8,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className="button secondary"
            style={{ width: '100%' }}
            onClick={() => {
              onJumpToToday();
              onClose();
            }}
          >
            <Calendar size={13} style={{ marginRight: 6 }} />
            Back to today
          </button>
        </div>
      </div>
    </div>
  );
};
