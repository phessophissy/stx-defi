'use client';

import clsx from 'clsx';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: typeof Info }> = {
  info: {
    bg: 'bg-[var(--primary)]/10',
    border: 'border-[var(--primary)]/30',
    icon: Info,
  },
  success: {
    bg: 'bg-[var(--success)]/10',
    border: 'border-[var(--success)]/30',
    icon: CheckCircle,
  },
  warning: {
    bg: 'bg-[var(--warning)]/10',
    border: 'border-[var(--warning)]/30',
    icon: AlertTriangle,
  },
  error: {
    bg: 'bg-[var(--destructive)]/10',
    border: 'border-[var(--destructive)]/30',
    icon: AlertCircle,
  },
};

const iconColors: Record<AlertVariant, string> = {
  info: 'text-[var(--primary)]',
  success: 'text-[var(--success)]',
  warning: 'text-[var(--warning)]',
  error: 'text-[var(--destructive)]',
};

export default function Alert({
  variant = 'info',
  title,
  children,
  onClose,
  className,
}: AlertProps) {
  const styles = variantStyles[variant];
  const Icon = styles.icon;

  return (
    <div
      className={clsx(
        'rounded-lg border p-4',
        styles.bg,
        styles.border,
        className
      )}
      role="alert"
    >
      <div className="flex gap-3">
        <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', iconColors[variant])} />
        <div className="flex-1">
          {title && (
            <h4 className={clsx('font-semibold mb-1', iconColors[variant])}>{title}</h4>
          )}
          <div className="text-sm text-[var(--foreground)]">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--secondary)] rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
