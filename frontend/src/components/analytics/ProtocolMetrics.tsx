'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX } from '@/lib/utils';
import { PieChart, DollarSign, Percent, Users } from 'lucide-react';

interface ProtocolMetricsProps {
  totalDeposits: number;
  totalBorrows: number;
  vaultTVL: number;
  activeUsers: number;
  className?: string;
}

export default function ProtocolMetrics({
  totalDeposits,
  totalBorrows,
  vaultTVL,
  activeUsers,
  className,
}: ProtocolMetricsProps) {
  const totalTVL = totalDeposits + vaultTVL;
  const lendingShare = totalTVL > 0 ? (totalDeposits / totalTVL) * 100 : 50;
  const vaultShare = totalTVL > 0 ? (vaultTVL / totalTVL) * 100 : 50;

  const metrics = [
    {
      label: 'Total TVL',
      value: `${formatSTX(totalTVL)} STX`,
      icon: DollarSign,
      color: 'text-[var(--primary)]',
      bgColor: 'bg-[var(--primary)]/10',
    },
    {
      label: 'Borrow Rate',
      value: '5.00%',
      icon: Percent,
      color: 'text-[var(--warning)]',
      bgColor: 'bg-[var(--warning)]/10',
    },
    {
      label: 'Vault APY',
      value: '8.00%',
      icon: Percent,
      color: 'text-[var(--success)]',
      bgColor: 'bg-[var(--success)]/10',
    },
    {
      label: 'Active Users',
      value: activeUsers.toString(),
      icon: Users,
      color: 'text-[var(--foreground)]',
      bgColor: 'bg-[var(--secondary)]',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Protocol Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`w-4 h-4 ${metric.color}`} />
                  </div>
                </div>
                <p className="text-lg font-bold">{metric.value}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{metric.label}</p>
              </div>
            );
          })}
        </div>

        {/* TVL Distribution */}
        <div className="space-y-3">
          <p className="text-sm font-medium">TVL Distribution</p>
          <div className="h-4 rounded-full overflow-hidden bg-[var(--secondary)] flex">
            <div
              className="h-full bg-[var(--primary)] transition-all"
              style={{ width: `${lendingShare}%` }}
            />
            <div
              className="h-full bg-[var(--success)] transition-all"
              style={{ width: `${vaultShare}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
              <span>Lending Pool ({lendingShare.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
              <span>Vault ({vaultShare.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Borrowed vs Available */}
        <div className="space-y-3">
          <p className="text-sm font-medium">Pool Liquidity</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-[var(--success)]/10 rounded-lg border border-[var(--success)]/20">
              <p className="text-xs text-[var(--muted-foreground)]">Available</p>
              <p className="text-lg font-bold text-[var(--success)]">
                {formatSTX(totalDeposits - totalBorrows)} STX
              </p>
            </div>
            <div className="p-3 bg-[var(--warning)]/10 rounded-lg border border-[var(--warning)]/20">
              <p className="text-xs text-[var(--muted-foreground)]">Borrowed</p>
              <p className="text-lg font-bold text-[var(--warning)]">
                {formatSTX(totalBorrows)} STX
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
