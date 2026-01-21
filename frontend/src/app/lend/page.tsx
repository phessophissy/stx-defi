'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui';
import { DepositForm, BorrowForm, RepayForm, WithdrawForm } from '@/components/lending';
import { UserPositionCard } from '@/components/dashboard';
import { useWallet } from '@/context/WalletContext';
import { useCorePool } from '@/hooks';
import { useToast } from '@/components/ui/Toast';
import { formatSTX, formatPercentage } from '@/lib/utils';
import { Coins, ArrowDownToLine, ArrowUpFromLine, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'deposit' | 'borrow' | 'repay' | 'withdraw';

export default function LendPage() {
  const { isConnected, address } = useWallet();
  const { poolStats, userPosition, refetch, constants, isLoading } = useCorePool(address);
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('deposit');

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'deposit', label: 'Deposit', icon: <ArrowDownToLine className="w-4 h-4" /> },
    { id: 'borrow', label: 'Borrow', icon: <Coins className="w-4 h-4" /> },
    { id: 'repay', label: 'Repay', icon: <ArrowUpFromLine className="w-4 h-4" /> },
    { id: 'withdraw', label: 'Withdraw', icon: <ArrowUpFromLine className="w-4 h-4" /> },
  ];

  // Mock transaction handlers (in production, these would use @stacks/transactions)
  const handleDeposit = async (amount: number) => {
    // Simulate transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refetch();
  };

  const handleBorrow = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refetch();
  };

  const handleRepay = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refetch();
  };

  const handleWithdraw = async (amount: number) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lend & Borrow</h1>
          <p className="text-[var(--muted-foreground)]">
            Deposit STX to earn interest or borrow against your collateral
          </p>
        </div>
        <Button variant="outline" onClick={refetch} disabled={isLoading}>
          <RefreshCw className={clsx('w-4 h-4 mr-2', isLoading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Pool Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Total Deposits</p>
              <p className="text-xl font-bold text-[var(--success)]">
                {formatSTX(poolStats.totalDeposits)} STX
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Total Borrows</p>
              <p className="text-xl font-bold text-[var(--warning)]">
                {formatSTX(poolStats.totalBorrows)} STX
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Available Liquidity</p>
              <p className="text-xl font-bold">
                {formatSTX(poolStats.availableLiquidity)} STX
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-[var(--muted-foreground)]">Borrow APY</p>
              <p className="text-xl font-bold text-[var(--primary)]">
                {formatPercentage(constants.BORROW_INTEREST_RATE)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Position */}
        <div className="lg:col-span-1">
          <UserPositionCard
            deposit={userPosition.deposit}
            borrow={userPosition.borrow}
            healthFactor={userPosition.healthFactor}
            accruedInterest={userPosition.accruedInterest}
            maxBorrow={userPosition.maxBorrow}
            isConnected={isConnected}
          />
        </div>

        {/* Action Forms */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 p-1 bg-[var(--secondary)] rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center',
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === 'deposit' && (
              <DepositForm
                currentDeposit={userPosition.deposit}
                onDeposit={handleDeposit}
              />
            )}
            {activeTab === 'borrow' && (
              <BorrowForm
                currentDeposit={userPosition.deposit}
                currentBorrow={userPosition.borrow}
                maxBorrow={userPosition.maxBorrow}
                healthFactor={userPosition.healthFactor}
                availableLiquidity={poolStats.availableLiquidity}
                onBorrow={handleBorrow}
              />
            )}
            {activeTab === 'repay' && (
              <RepayForm
                currentBorrow={userPosition.borrow}
                accruedInterest={userPosition.accruedInterest}
                totalDebt={userPosition.totalDebt}
                onRepay={handleRepay}
              />
            )}
            {activeTab === 'withdraw' && (
              <WithdrawForm
                currentDeposit={userPosition.deposit}
                currentBorrow={userPosition.borrow}
                healthFactor={userPosition.healthFactor}
                availableLiquidity={poolStats.availableLiquidity}
                onWithdraw={handleWithdraw}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
