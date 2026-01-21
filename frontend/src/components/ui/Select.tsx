'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={clsx('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={clsx(
          'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border',
          'bg-[var(--background)] text-left transition-colors',
          disabled
            ? 'opacity-50 cursor-not-allowed border-[var(--border)]'
            : 'border-[var(--border)] hover:border-[var(--primary)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20'
        )}
        disabled={disabled}
      >
        <span className="flex items-center gap-2">
          {selectedOption?.icon}
          <span className={selectedOption ? '' : 'text-[var(--muted-foreground)]'}>
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-[var(--muted-foreground)] transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute z-20 w-full mt-1 py-1 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-lg">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 text-left transition-colors',
                  option.value === value
                    ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                    : 'hover:bg-[var(--secondary)]'
                )}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
