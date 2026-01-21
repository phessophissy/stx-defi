'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { VaultDepositForm, VaultWithdrawForm } from '@/components/vault';
import { VaultPositionCard } from '@/components/dashboard';
import { useWallet } from '@/context/WalletContext';
import { useYieldVault } from '@/hooks';
import { useToast } from '@/components/ui/Toast';
import { formatSTX, formatPercentage } from '@/lib/utils';
import { Vault, ArrowDownToLine, ArrowUpFromLine, RefreshCw, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'deposit' | 'withdraw';

export default function VaultPage() {
  const { isConnected, address } = useWallet();
  const { vaultStats, userPosition, refetch, calculateSharesForDeposit, calculateSTXForShares, isLoading } = useYieldVault(address);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'deposit', label: 'Deposit', icon: <ArrowDownToLine className="w-4 h-4" /> },
    { id: 'withdraw', label: 'Withdraw', icon: <ArrowUpFromLine className="w-4 h-4" /> },
  ];

  // Mock transaction handlers
  const handleDeposit = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refetch();
  };

  const handleWithdraw = async (shares: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Vault className="w-8 h-8 text-[var(--primary)]" />
            Yield Vault
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Deposit STX to earn {formatPercentage(vaultStats.apy)} APY
          </p>
        </div>
        <Button variant="outline" onClick={refetch} disabled={isLoading}>
          <RefreshCw className={clsx('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Vault Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover glow="green">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--muted-foreground)]">Vault APY</p>
                <p className="text-2xl font-bold text-[var(--success)]">
                  {formatPercentage(vaultStats.apy)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-[var(--success)]" />
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Total Value Locked</p>
              <p className="text-2xl font-bold">{formatSTX(vaultStats.totalAssets)} STX</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Share Price</p>
              <p className="text-2xl font-bold">{(vaultStats.sharePrice / 10000).toFixed(4)}</p>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Pending Yield</p>
              <p className="text-2xl font-bold text-[var(--success)]">
                +{formatSTX(vaultStats.pendingYield)} STX
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Position */}
        <div className="lg:col-span-1">
          <VaultPositionCard
            shares={userPosition.shares}
            value={userPosition.value}
            sharePrice={vaultStats.sharePrice}
            apy={vaultStats.apy}
            isConnected={isConnected}
          />
        </div>

        {/* Action Forms */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Navigation */}
          <div className="flex gap-2 p-1 bg-[var(--secondary)] rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all flex-1 justify-center',
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'deposit' && (
              <VaultDepositForm
                sharePrice={vaultStats.sharePrice}
                calculateSharesForDeposit={calculateSharesForDeposit}
                onDeposit={handleDeposit}
              />
            )}
            {activeTab === 'withdraw' && (
              <VaultWithdrawForm
                userShares={userPosition.shares}
                sharePrice={vaultStats.sharePrice}
                calculateSTXForShares={calculateSTXForShares}
                onWithdraw={handleWithdraw}
              />
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How the Yield Vault Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="font-semibold">Deposit STX</h4>
              <p className="text-sm text-[var(--muted-foreground)]">
                Deposit your STX into the vault and receive vault shares representing your ownership.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="font-semibold">Earn Yield</h4>
              <p className="text-sm text-[var(--muted-foreground)]">
                Your deposits earn {formatPercentage(vaultStats.apy)} APY. Yield accrues automatically.
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="font-semibold">Withdraw Anytime</h4>
              <p className="text-sm text-[var(--muted-foreground)]">
                Redeem your shares for STX plus earned yield whenever you want. No lock-up period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
