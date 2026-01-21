'use client';

import { TrendingUp, TrendingDown, DollarSign, Percent, Shield, Coins } from 'lucide-react';
import { Card } from '@/components/ui';
import { formatSTX, formatPercentage, formatCompact } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({ title, value, subtitle, icon, trend, variant = 'default' }: StatCardProps) {
  const variantColors = {
    default: 'text-[var(--primary)]',
    success: 'text-[var(--success)]',
    warning: 'text-[var(--warning)]',
    danger: 'text-[var(--destructive)]',
  };

  return (
    <Card hover className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-[var(--muted-foreground)]">{title}</p>
          <p className={`text-2xl font-bold ${variantColors[variant]}`}>{value}</p>
          {subtitle && (
            <p className="text-sm text-[var(--muted-foreground)]">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? 'text-[var(--success)]' : 'text-[var(--destructive)]'}`}>
              {trend.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-[var(--secondary)] ${variantColors[variant]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

interface ProtocolStatsProps {
  totalDeposits: number;
  totalBorrows: number;
  availableLiquidity: number;
  utilizationRate: number;
  vaultTVL: number;
  vaultAPY: number;
}

export function ProtocolStats({
  totalDeposits,
  totalBorrows,
  availableLiquidity,
  utilizationRate,
  vaultTVL,
  vaultAPY,
}: ProtocolStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        title="Total Deposits"
        value={`${formatCompact(totalDeposits / 1_000_000)} STX`}
        icon={<DollarSign className="w-5 h-5" />}
        variant="success"
      />
      <StatCard
        title="Total Borrows"
        value={`${formatCompact(totalBorrows / 1_000_000)} STX`}
        icon={<Coins className="w-5 h-5" />}
        variant="warning"
      />
      <StatCard
        title="Available Liquidity"
        value={`${formatCompact(availableLiquidity / 1_000_000)} STX`}
        icon={<Shield className="w-5 h-5" />}
      />
      <StatCard
        title="Utilization Rate"
        value={`${utilizationRate}%`}
        subtitle="Pool utilization"
        icon={<Percent className="w-5 h-5" />}
      />
      <StatCard
        title="Vault TVL"
        value={`${formatCompact(vaultTVL / 1_000_000)} STX`}
        icon={<DollarSign className="w-5 h-5" />}
        variant="success"
      />
      <StatCard
        title="Vault APY"
        value={formatPercentage(vaultAPY)}
        subtitle="Annual yield"
        icon={<TrendingUp className="w-5 h-5" />}
        variant="success"
      />
    </div>
  );
}
