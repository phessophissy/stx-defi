import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, suffix, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-[var(--foreground)]">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            className={clsx(
              'w-full px-4 py-3 bg-[var(--input)] border rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all',
              error ? 'border-[var(--destructive)]' : 'border-[var(--border)]',
              suffix && 'pr-16',
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">
              {suffix}
            </span>
          )}
        </div>
        {helperText && !error && (
          <p className="text-sm text-[var(--muted-foreground)]">{helperText}</p>
        )}
        {error && (
          <p className="text-sm text-[var(--destructive)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
