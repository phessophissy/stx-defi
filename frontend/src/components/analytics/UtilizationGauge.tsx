'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Activity } from 'lucide-react';
import clsx from 'clsx';

interface UtilizationGaugeProps {
  utilization: number; // 0-100
  label?: string;
  className?: string;
}

export default function UtilizationGauge({
  utilization,
  label = 'Pool Utilization',
  className,
}: UtilizationGaugeProps) {
  // Determine status based on utilization
  const getStatus = (util: number) => {
    if (util < 50) return { label: 'Low', color: 'var(--success)' };
    if (util < 75) return { label: 'Moderate', color: 'var(--warning)' };
    if (util < 90) return { label: 'High', color: 'var(--warning)' };
    return { label: 'Critical', color: 'var(--destructive)' };
  };

  const status = getStatus(utilization);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (utilization / 100) * circumference * 0.75; // 75% of circle

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Gauge SVG */}
          <div className="relative w-48 h-32">
            <svg
              className="transform -rotate-90"
              viewBox="0 0 100 100"
              style={{ width: '100%', height: '100%' }}
            >
              {/* Background arc */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="8"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeLinecap="round"
                transform="rotate(-135 50 50)"
              />
              {/* Foreground arc */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={status.color}
                strokeWidth="8"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-135 50 50)"
                className="transition-all duration-500"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
              <span className="text-3xl font-bold" style={{ color: status.color }}>
                {utilization.toFixed(1)}%
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">{status.label}</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-4">
            {[
              { label: 'Available', color: 'var(--muted)' },
              { label: 'Utilized', color: status.color },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-[var(--muted-foreground)]">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[var(--border)]">
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)]">Available</p>
              <p className="font-semibold text-[var(--success)]">
                {(100 - utilization).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-[var(--muted-foreground)]">Borrowed</p>
              <p className="font-semibold" style={{ color: status.color }}>
                {utilization.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
