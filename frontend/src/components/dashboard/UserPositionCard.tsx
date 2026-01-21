'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX, formatHealthFactor, getHealthStatus } from '@/lib/utils';
import { Wallet, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface UserPositionCardProps {
  deposit: number;
  borrow: number;
  healthFactor: number;
  accruedInterest: number;
  maxBorrow: number;
  isConnected: boolean;
}

export function UserPositionCard({
  deposit,
  borrow,
  healthFactor,
  accruedInterest,
  maxBorrow,
  isConnected,
}: UserPositionCardProps) {
  const healthStatus = getHealthStatus(healthFactor);
  
  if (!isConnected) {
    return (
      <Card className="bg-gradient-to-br from-[var(--card)] to-[var(--secondary)]">
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
          <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Connect your Stacks wallet to view your positions and interact with the protocol.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Your Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Deposited */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Deposited</p>
            <p className="text-xl font-bold text-[var(--success)]">
              {formatSTX(deposit)} STX
            </p>
          </div>

          {/* Borrowed */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Borrowed</p>
            <p className="text-xl font-bold text-[var(--warning)]">
              {formatSTX(borrow)} STX
            </p>
          </div>

          {/* Health Factor */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Health Factor</p>
            <div className="flex items-center gap-2">
              <p
                className="text-xl font-bold"
                style={{ color: healthStatus.color }}
              >
                {formatHealthFactor(healthFactor)}
              </p>
              {healthStatus.status === 'healthy' ? (
                <CheckCircle className="w-5 h-5" style={{ color: healthStatus.color }} />
              ) : (
                <AlertTriangle className="w-5 h-5" style={{ color: healthStatus.color }} />
              )}
            </div>
            <p className="text-xs" style={{ color: healthStatus.color }}>
              {healthStatus.label}
            </p>
          </div>

          {/* Accrued Interest */}
          <div className="space-y-1">
            <p className="text-sm text-[var(--muted-foreground)]">Accrued Interest</p>
            <p className="text-xl font-bold text-[var(--destructive)]">
              {formatSTX(accruedInterest)} STX
            </p>
          </div>

          {/* Available to Borrow */}
          <div className="col-span-2 pt-4 border-t border-[var(--border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm text-[var(--muted-foreground)]">
                  Available to Borrow
                </span>
              </div>
              <p className="font-bold text-[var(--primary)]">
                {formatSTX(maxBorrow)} STX
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
