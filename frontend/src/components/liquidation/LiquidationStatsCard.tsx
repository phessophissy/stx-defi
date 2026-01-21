'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX } from '@/lib/utils';
import { Scale, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface LiquidationStats {
  totalLiquidatable: number;
  totalAtRisk: number;
  averageHealthFactor: number;
  estimatedProfitPool: number;
}

interface LiquidationStatsCardProps {
  className?: string;
}

export default function LiquidationStatsCard({ className }: LiquidationStatsCardProps) {
  const [stats, setStats] = useState<LiquidationStats>({
    totalLiquidatable: 0,
    totalAtRisk: 0,
    averageHealthFactor: 0,
    estimatedProfitPool: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching stats
    const fetchStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStats({
        totalLiquidatable: 2,
        totalAtRisk: 5,
        averageHealthFactor: 108,
        estimatedProfitPool: 75000000, // 0.75 STX in micro-STX
      });
      setIsLoading(false);
    };
    fetchStats();
  }, []);

  const statItems = [
    {
      label: 'Liquidatable Positions',
      value: stats.totalLiquidatable.toString(),
      icon: Scale,
      color: 'text-[var(--destructive)]',
      bgColor: 'bg-[var(--destructive)]/10',
    },
    {
      label: 'At-Risk Positions',
      value: stats.totalAtRisk.toString(),
      icon: TrendingDown,
      color: 'text-[var(--warning)]',
      bgColor: 'bg-[var(--warning)]/10',
    },
    {
      label: 'Avg Health Factor',
      value: `${(stats.averageHealthFactor / 100).toFixed(2)}`,
      icon: Activity,
      color: 'text-[var(--primary)]',
      bgColor: 'bg-[var(--primary)]/10',
    },
    {
      label: 'Total Profit Pool',
      value: `${formatSTX(stats.estimatedProfitPool)} STX`,
      icon: DollarSign,
      color: 'text-[var(--success)]',
      bgColor: 'bg-[var(--success)]/10',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          Liquidation Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-2 rounded-lg ${item.bgColor}`}>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold mb-1">
                  {isLoading ? (
                    <span className="inline-block w-16 h-8 bg-[var(--muted)] animate-pulse rounded" />
                  ) : (
                    item.value
                  )}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">{item.label}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
