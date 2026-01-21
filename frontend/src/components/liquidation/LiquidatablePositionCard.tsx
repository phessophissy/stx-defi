'use client';

import { useState } from 'react';
import { Card, CardContent, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, formatHealthFactor, getHealthStatus, truncateAddress } from '@/lib/utils';
import { ExternalLink, Loader2, AlertOctagon, TrendingDown } from 'lucide-react';
import clsx from 'clsx';

interface LiquidatablePositionCardProps {
  address: string;
  deposit: number;
  debt: number;
  healthFactor: number;
  potentialProfit: number;
  onLiquidate?: (address: string) => Promise<void>;
}

export default function LiquidatablePositionCard({
  address,
  deposit,
  debt,
  healthFactor,
  potentialProfit,
  onLiquidate,
}: LiquidatablePositionCardProps) {
  const { isConnected } = useWallet();
  const { showToast } = useToast();
  const [isLiquidating, setIsLiquidating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const healthStatus = getHealthStatus(healthFactor);
  const collateralizationRatio = debt > 0 ? (deposit / debt) * 100 : 0;
  const shortfall = debt * 1.2 - deposit; // Amount needed to reach 120% health

  const handleLiquidate = async () => {
    if (!isConnected) {
      showToast('error', 'Wallet Required', 'Please connect your wallet to liquidate.');
      return;
    }

    setIsLiquidating(true);
    try {
      if (onLiquidate) {
        await onLiquidate(address);
      } else {
        // Simulate liquidation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        showToast('success', 'Liquidation Submitted', 'Transaction has been submitted.');
      }
    } catch (error) {
      showToast('error', 'Liquidation Failed', 'Transaction was rejected or failed.');
    } finally {
      setIsLiquidating(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:border-[var(--destructive)]/50 transition-colors">
      <CardContent className="p-0">
        {/* Main Row */}
        <div
          className={clsx(
            'p-4 cursor-pointer transition-colors',
            showDetails && 'bg-[var(--secondary)]'
          )}
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Position Info */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Address</p>
                <a
                  href={`https://explorer.stacks.co/address/${address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-mono hover:text-[var(--primary)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {truncateAddress(address)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Collateral</p>
                <p className="text-sm font-semibold">{formatSTX(deposit)} STX</p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Debt</p>
                <p className="text-sm font-semibold text-[var(--warning)]">
                  {formatSTX(debt)} STX
                </p>
              </div>
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-1">Health Factor</p>
                <div className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4" style={{ color: healthStatus.color }} />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: healthStatus.color }}
                  >
                    {formatHealthFactor(healthFactor)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Section */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-[var(--muted-foreground)]">Profit</p>
                <p className="text-sm font-bold text-[var(--success)]">
                  +{formatSTX(potentialProfit)} STX
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLiquidate();
                }}
                disabled={isLiquidating || !isConnected}
                className="min-w-[100px]"
              >
                {isLiquidating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  'Liquidate'
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <div className="px-4 pb-4 border-t border-[var(--border)] bg-[var(--secondary)]/50">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-[var(--background)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Collateralization Ratio
                  </span>
                </div>
                <p className="text-lg font-semibold" style={{ color: healthStatus.color }}>
                  {collateralizationRatio.toFixed(1)}%
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Required: 120% minimum
                </p>
              </div>
              <div className="p-3 bg-[var(--background)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertOctagon className="w-4 h-4 text-[var(--destructive)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">Shortfall</span>
                </div>
                <p className="text-lg font-semibold text-[var(--destructive)]">
                  {formatSTX(Math.max(0, shortfall))} STX
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Amount below threshold
                </p>
              </div>
              <div className="p-3 bg-[var(--background)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Liquidation Bonus
                  </span>
                </div>
                <p className="text-lg font-semibold text-[var(--success)]">0.5%</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Bonus on debt repaid
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
