'use client';

import clsx from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className,
  variant = 'text',
  width,
  height,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        'animate-pulse bg-[var(--muted)]',
        variant === 'text' && 'rounded h-4',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded-lg',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

// Preset skeleton components
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        'p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]',
        className
      )}
    >
      <Skeleton variant="text" width="40%" className="mb-4" />
      <Skeleton variant="text" width="100%" className="mb-2" />
      <Skeleton variant="text" width="80%" className="mb-2" />
      <Skeleton variant="text" width="60%" />
    </div>
  );
}

export function SkeletonStats({ className }: { className?: string }) {
  return (
    <div className={clsx('grid grid-cols-2 md:grid-cols-4 gap-4', className)}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-[var(--border)] bg-[var(--card)]"
        >
          <Skeleton variant="text" width="60%" height={12} className="mb-3" />
          <Skeleton variant="text" width="80%" height={28} className="mb-2" />
          <Skeleton variant="text" width="40%" height={10} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={clsx('space-y-3', className)}>
      {/* Header */}
      <div className="flex gap-4 pb-2 border-b border-[var(--border)]">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} variant="text" className="flex-1" height={14} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2">
          {[1, 2, 3, 4].map((j) => (
            <Skeleton key={j} variant="text" className="flex-1" height={16} />
          ))}
        </div>
      ))}
    </div>
  );
}
