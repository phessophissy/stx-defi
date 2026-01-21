'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX, formatPercentage } from '@/lib/utils';
import { Vault, Coins, TrendingUp, Wallet } from 'lucide-react';

interface VaultPositionCardProps {
  shares: number;
  value: number;
  sharePrice: number;
  apy: number;
  isConnected: boolean;
}

export function VaultPositionCard({
  shares,
  value,
  sharePrice,
  apy,
  isConnected,
}: VaultPositionCardProps) {
  const earnedYield = value - shares; // Simplified: difference between value and initial shares
  
  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-[var(--card)] to-[var(--secondary)]">
        <div className="text-center py-8">
          <Vault className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h3 className="text-lg font-medium mb-2">Yield Vault</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Connect wallet to view your vault position and earned yield.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vault className="w-5 h-5" />
          Vault Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Your Shares */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Your Shares</p>
            <p className="text-xl font-bold">
              {formatSTX(shares)}
            </p>
          </div>

          {/* Current Value */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Current Value</p>
            <p className="text-xl font-bold text-[var(--success)]">
              {formatSTX(value)} STX
            </p>
          </div>

          {/* Share Price */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Share Price</p>
            <p className="text-xl font-bold">
              {(sharePrice / 10000).toFixed(4)}
            </p>
          </div>

          {/* Vault APY */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Vault APY</p>
            <p className="text-xl font-bold text-[var(--success)]">
              {formatPercentage(apy)}
            </p>
          </div>

          {/* Earned Yield */}
          <div className="col-span-2 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Earned Yield
                </span>
              </div>
              <p className="font-bold text-[var(--success)]">
                +{formatSTX(Math.max(0, earnedYield))} STX
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
