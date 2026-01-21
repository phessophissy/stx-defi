import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'orange' | 'green' | 'red' | 'none';
}

export function Card({ children, className, hover = false, glow = 'none' }: CardProps) {
  const glowClasses = {
    orange: 'glow-orange',
    green: 'glow-green',
    red: 'glow-red',
    none: '',
  };

  return (
    <div
      className={clsx(
        'bg-[var(--card)] border border-[var(--border)] rounded-xl p-6',
        hover && 'stat-card cursor-pointer',
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={clsx('text-lg font-semibold', className)}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={clsx('text-sm text-[var(--muted-foreground)]', className)}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={clsx(className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-[var(--border)]', className)}>
      {children}
    </div>
  );
}
