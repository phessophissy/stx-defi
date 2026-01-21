'use client';

import { TVLChart, UtilizationGauge, ProtocolMetrics } from '@/components/analytics';
import { useCorePool, useYieldVault } from '@/hooks';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const { poolStats } = useCorePool();
  const { vaultStats } = useYieldVault();

  const totalDeposits = poolStats?.totalDeposits || 0;
  const totalBorrows = poolStats?.totalBorrows || 0;
  const totalStaked = vaultStats?.totalStaked || 0;

  const utilization = totalDeposits > 0 ? (totalBorrows / totalDeposits) * 100 : 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-[var(--primary)]" />
          Analytics
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Protocol statistics and performance metrics
        </p>
      </div>

      {/* TVL Chart - Full Width */}
      <TVLChart />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UtilizationGauge utilization={utilization} />
        <ProtocolMetrics
          totalDeposits={totalDeposits}
          totalBorrows={totalBorrows}
          vaultTVL={totalStaked}
          activeUsers={42}
        />
      </div>
    </div>
  );
}
