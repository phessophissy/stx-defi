'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX, formatHealthFactor, getHealthStatus } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import clsx from 'clsx';

interface PositionSummaryCardProps {
  deposit: number;
  borrow: number;
  healthFactor: number;
  vaultValue: number;
  className?: string;
}

export default function PositionSummaryCard({
  deposit,
  borrow,
  healthFactor,
  vaultValue,
  className,
}: PositionSummaryCardProps) {
  const healthStatus = getHealthStatus(healthFactor);
  const netPosition = deposit - borrow + vaultValue;
  const utilizationRate = deposit > 0 ? (borrow / deposit) * 100 : 0;

  const stats = [
    {
      label: 'Net Position',
      value: `${formatSTX(netPosition)} STX`,
      change: netPosition >= 0 ? '+' : '',
      icon: Activity,
      color: netPosition >= 0 ? 'text-[var(--success)]' : 'text-[var(--destructive)]',
    },
    {
      label: 'Total Supplied',
      value: `${formatSTX(deposit + vaultValue)} STX`,
      sublabel: 'Lending + Vault',
      icon: TrendingUp,
      color: 'text-[var(--success)]',
    },
    {
      label: 'Total Borrowed',
      value: `${formatSTX(borrow)} STX`,
      sublabel: `${utilizationRate.toFixed(1)}% utilized`,
      icon: TrendingDown,
      color: 'text-[var(--warning)]',
    },
    {
      label: 'Health Factor',
      value: borrow > 0 ? formatHealthFactor(healthFactor) : '∞',
      sublabel: healthStatus.label,
      icon: Shield,
      color: borrow > 0 ? '' : 'text-[var(--success)]',
      dynamicColor: borrow > 0 ? healthStatus.color : undefined,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Position Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon
                    className={clsx('w-4 h-4', stat.color)}
                    style={stat.dynamicColor ? { color: stat.dynamicColor } : undefined}
                  />
                  <span className="text-xs text-[var(--muted-foreground)]">{stat.label}</span>
                </div>
                <p
                  className={clsx('text-xl font-bold', stat.color)}
                  style={stat.dynamicColor ? { color: stat.dynamicColor } : undefined}
                >
                  {stat.change}{stat.value}
                </p>
                {stat.sublabel && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">{stat.sublabel}</p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
