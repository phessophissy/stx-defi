'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, formatHealthFactor, getHealthStatus, truncateAddress } from '@/lib/utils';
import { Users, AlertTriangle, RefreshCw, Loader2, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

interface LiquidatablePosition {
  address: string;
  deposit: number;
  debt: number;
  healthFactor: number;
  potentialProfit: number;
}

// Mock data for liquidatable positions
const mockLiquidatablePositions: LiquidatablePosition[] = [
  {
    address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS',
    deposit: 10000000000,
    debt: 9000000000,
    healthFactor: 111,
    potentialProfit: 50000000,
  },
  {
    address: 'SP3FGQ8Z7JY9BWYZ5WM53E0M9NK7WHJF0691NZ159',
    deposit: 5000000000,
    debt: 4800000000,
    healthFactor: 104,
    potentialProfit: 25000000,
  },
];

export default function LiquidatePage() {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [positions, setPositions] = useState<LiquidatablePosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [liquidatingAddress, setLiquidatingAddress] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching liquidatable positions
    const fetchPositions = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPositions(mockLiquidatablePositions);
      setIsLoading(false);
    };
    fetchPositions();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPositions(mockLiquidatablePositions);
    setIsLoading(false);
  };

  const handleLiquidate = async (address: string) => {
    if (!isConnected) {
      showToast('error', 'Wallet Required', 'Please connect your wallet to liquidate.');
      return;
    }

    setLiquidatingAddress(address);
    try {
      // Simulate liquidation transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast('success', 'Liquidation Successful', 'Position has been liquidated successfully.');
      setPositions((prev) => prev.filter((p) => p.address !== address));
    } catch (error) {
      showToast('error', 'Liquidation Failed', 'Transaction was rejected or failed.');
    } finally {
      setLiquidatingAddress(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-[var(--destructive)]" />
            Liquidations
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Liquidate undercollateralized positions and earn a bonus
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={clsx('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-[var(--warning)] bg-[var(--warning)]/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-[var(--warning)] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold">How Liquidation Works</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                When a borrower's health factor falls below 1.2 (120%), their position becomes liquidatable.
                As a liquidator, you pay off the borrower's debt and receive their collateral plus a 0.5% bonus.
                The protocol ensures healthy collateralization by incentivizing liquidators.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liquidatable Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidatable Positions</CardTitle>
          <CardDescription>
            Positions with health factor below 1.2 can be liquidated
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--muted-foreground)]" />
            </div>
          ) : positions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
              <h3 className="font-medium mb-2">No Liquidatable Positions</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                All positions are currently healthy. Check back later.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => {
                const healthStatus = getHealthStatus(position.healthFactor);
                const isLiquidating = liquidatingAddress === position.address;

                return (
                  <div
                    key={position.address}
                    className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)] hover:border-[var(--destructive)] transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Address</p>
                          <a
                            href={`https://explorer.stacks.co/address/${position.address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm font-medium hover:text-[var(--primary)]"
                          >
                            {truncateAddress(position.address)}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Collateral</p>
                          <p className="text-sm font-medium">{formatSTX(position.deposit)} STX</p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Debt</p>
                          <p className="text-sm font-medium text-[var(--warning)]">
                            {formatSTX(position.debt)} STX
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[var(--muted-foreground)]">Health Factor</p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: healthStatus.color }}
                          >
                            {formatHealthFactor(position.healthFactor)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-[var(--muted-foreground)]">Potential Profit</p>
                          <p className="text-sm font-bold text-[var(--success)]">
                            +{formatSTX(position.potentialProfit)} STX
                          </p>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleLiquidate(position.address)}
                          disabled={isLiquidating || !isConnected}
                        >
                          {isLiquidating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            'Liquidate'
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connect Wallet Prompt */}
      {!isConnected && (
        <Card className="border-[var(--primary)]">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Connect Wallet to Liquidate</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                You need to connect your wallet to perform liquidations.
              </p>
              <Button onClick={connect}>Connect Wallet</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
