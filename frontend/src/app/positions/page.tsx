'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';
import { useWallet } from '@/context/WalletContext';
import { useCorePool, useYieldVault } from '@/hooks';
import { formatSTX, formatHealthFactor, getHealthStatus } from '@/lib/utils';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

export default function PositionsPage() {
  const { isConnected, address, connect } = useWallet();
  const { userDeposit, userBorrow, healthFactor, isLoading: isPoolLoading, refetch: refetchPool } = useCorePool();
  const { userShares, sharePrice, isLoading: isVaultLoading, refetch: refetchVault } = useYieldVault();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const healthStatus = getHealthStatus(healthFactor);
  const vaultValue = Math.floor((userShares * sharePrice) / 100);
  const netPosition = userDeposit - userBorrow + vaultValue;
  const hasLendingPosition = userDeposit > 0 || userBorrow > 0;
  const hasVaultPosition = userShares > 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchPool?.(), refetchVault?.()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-8 pb-8 text-center">
            <Wallet className="w-16 h-16 mx-auto text-[var(--muted-foreground)] mb-4" />
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-[var(--muted-foreground)] mb-6">
              Connect your wallet to view your positions across the protocol.
            </p>
            <Button onClick={connect} size="lg">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wallet className="w-8 h-8 text-[var(--primary)]" />
            My Positions
          </h1>
          <p className="text-[var(--muted-foreground)]">
            View and manage all your protocol positions
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing || isPoolLoading || isVaultLoading}
        >
          <RefreshCw className={clsx('w-4 h-4 mr-2', isRefreshing && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Net Position Overview */}
      <Card className="bg-gradient-to-br from-[var(--primary)]/10 to-[var(--secondary)]">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Net Position</p>
              <p className="text-3xl font-bold">{formatSTX(netPosition)} STX</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Total value across all positions
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Total Supplied</p>
              <p className="text-xl font-semibold text-[var(--success)]">
                {formatSTX(userDeposit + vaultValue)} STX
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Total Borrowed</p>
              <p className="text-xl font-semibold text-[var(--warning)]">
                {formatSTX(userBorrow)} STX
              </p>
            </div>
            <div>
              <p className="text-sm text-[var(--muted-foreground)] mb-1">Health Factor</p>
              <p className="text-xl font-semibold" style={{ color: healthStatus.color }}>
                {userBorrow > 0 ? formatHealthFactor(healthFactor) : '∞'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lending Position */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Lending Position
              </CardTitle>
              <CardDescription>Your deposits and borrows in the Core Pool</CardDescription>
            </div>
            <Link href="/lend">
              <Button variant="outline" size="sm">
                Manage <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!hasLendingPosition ? (
            <div className="text-center py-8">
              <PiggyBank className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
              <h3 className="font-medium mb-2">No Lending Position</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Start earning interest by depositing STX to the Core Pool.
              </p>
              <Link href="/lend">
                <Button>Start Lending</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Deposit Card */}
                <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-[var(--success)]/10 rounded-lg">
                      <ArrowUpRight className="w-4 h-4 text-[var(--success)]" />
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">Deposited</span>
                  </div>
                  <p className="text-2xl font-bold">{formatSTX(userDeposit)} STX</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Earning 5% APY
                  </p>
                </div>

                {/* Borrow Card */}
                <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-[var(--warning)]/10 rounded-lg">
                      <ArrowDownRight className="w-4 h-4 text-[var(--warning)]" />
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">Borrowed</span>
                  </div>
                  <p className="text-2xl font-bold">{formatSTX(userBorrow)} STX</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    5% APY interest
                  </p>
                </div>

                {/* Health Factor Card */}
                <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${healthStatus.color}20` }}
                    >
                      {healthFactor < 120 ? (
                        <AlertTriangle className="w-4 h-4" style={{ color: healthStatus.color }} />
                      ) : (
                        <TrendingUp className="w-4 h-4" style={{ color: healthStatus.color }} />
                      )}
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)]">Health Factor</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: healthStatus.color }}>
                    {userBorrow > 0 ? formatHealthFactor(healthFactor) : '∞'}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    {healthStatus.label}
                  </p>
                </div>
              </div>

              {/* Health Warning */}
              {userBorrow > 0 && healthFactor < 150 && (
                <div
                  className="p-4 rounded-lg border flex items-start gap-3"
                  style={{
                    backgroundColor: `${healthStatus.color}10`,
                    borderColor: healthStatus.color,
                  }}
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: healthStatus.color }} />
                  <div>
                    <p className="font-medium" style={{ color: healthStatus.color }}>
                      {healthFactor < 120 ? 'Liquidation Risk!' : 'Low Health Factor'}
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {healthFactor < 120
                        ? 'Your position can be liquidated. Repay debt or add collateral immediately.'
                        : 'Consider repaying some debt or adding more collateral to improve your health factor.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vault Position */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5" />
                Vault Position
              </CardTitle>
              <CardDescription>Your shares in the Yield Vault</CardDescription>
            </div>
            <Link href="/vault">
              <Button variant="outline" size="sm">
                Manage <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!hasVaultPosition ? (
            <div className="text-center py-8">
              <TrendingDown className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
              <h3 className="font-medium mb-2">No Vault Position</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">
                Deposit STX to the Yield Vault to earn 8% APY.
              </p>
              <Link href="/vault">
                <Button>Open Vault Position</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
                    <PiggyBank className="w-4 h-4 text-[var(--primary)]" />
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">Vault Shares</span>
                </div>
                <p className="text-2xl font-bold">{(userShares / 1e6).toFixed(4)}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Your ownership stake
                </p>
              </div>

              <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-[var(--success)]/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[var(--success)]" />
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">Current Value</span>
                </div>
                <p className="text-2xl font-bold text-[var(--success)]">{formatSTX(vaultValue)} STX</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  @ {(sharePrice / 100).toFixed(4)} STX/share
                </p>
              </div>

              <div className="p-4 bg-[var(--secondary)] rounded-lg border border-[var(--border)]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-[var(--warning)]/10 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-[var(--warning)]" />
                  </div>
                  <span className="text-sm text-[var(--muted-foreground)]">APY</span>
                </div>
                <p className="text-2xl font-bold">8.00%</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  Annual yield rate
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
