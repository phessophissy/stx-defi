'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, parseSTX, formatHealthFactor, getHealthStatus, calculateHealthFactor } from '@/lib/utils';
import { PROTOCOL_CONSTANTS } from '@/lib/contracts';
import { ArrowUpFromLine, AlertTriangle, Loader2 } from 'lucide-react';

interface WithdrawFormProps {
  currentDeposit: number;
  currentBorrow: number;
  healthFactor: number;
  availableLiquidity: number;
  onWithdraw: (amount: number) => Promise<void>;
}

export function WithdrawForm({
  currentDeposit,
  currentBorrow,
  healthFactor,
  availableLiquidity,
  onWithdraw,
}: WithdrawFormProps) {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Calculate max withdrawable (must maintain collateral ratio)
  const requiredCollateral = (currentBorrow * PROTOCOL_CONSTANTS.COLLATERAL_RATIO) / 100;
  const maxWithdrawable = Math.max(0, currentDeposit - requiredCollateral);
  const effectiveMax = Math.min(maxWithdrawable, availableLiquidity);

  const withdrawAmount = parseSTX(amount || '0');
  const newDeposit = currentDeposit - withdrawAmount;
  const newHealthFactor = calculateHealthFactor(newDeposit, currentBorrow);
  const newHealthStatus = getHealthStatus(newHealthFactor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid withdrawal amount.');
      return;
    }

    if (withdrawAmount > effectiveMax) {
      showToast('error', 'Exceeds Limit', 'Amount exceeds your available withdrawal limit.');
      return;
    }

    setIsLoading(true);
    try {
      await onWithdraw(withdrawAmount);
      showToast('success', 'Withdrawal Successful', `Successfully withdrew ${amount} STX.`);
      setAmount('');
    } catch (error) {
      showToast('error', 'Withdrawal Failed', 'Transaction was rejected or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount((effectiveMax / 1_000_000).toString());
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            Withdraw STX
          </CardTitle>
          <CardDescription>
            Withdraw your deposited STX from the lending pool.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Connect your wallet to withdraw
            </p>
            <Button onClick={connect}>Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentDeposit === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            Withdraw STX
          </CardTitle>
          <CardDescription>
            Withdraw your deposited STX from the lending pool.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">
              You have no deposits to withdraw.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpFromLine className="w-5 h-5" />
          Withdraw STX
        </CardTitle>
        <CardDescription>
          Withdraw your deposited STX. Must maintain {PROTOCOL_CONSTANTS.COLLATERAL_RATIO}% collateral ratio.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Amount to Withdraw</label>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                Max
              </button>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              suffix="STX"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.000001"
            />
          </div>

          {/* Stats */}
          <div className="space-y-2 py-4 border-y border-[var(--border)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Current Deposit:</span>
              <span>{formatSTX(currentDeposit)} STX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Required Collateral:</span>
              <span>{formatSTX(requiredCollateral)} STX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Max Withdrawable:</span>
              <span className="text-[var(--primary)]">{formatSTX(effectiveMax)} STX</span>
            </div>
          </div>

          {/* Health Factor Warning */}
          {amount && parseFloat(amount) > 0 && currentBorrow > 0 && (
            <div className="p-4 rounded-lg bg-[var(--secondary)] space-y-2">
              <p className="text-sm font-medium">Health Factor Preview</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted-foreground)]">Current:</span>
                  <span className="font-medium">{formatHealthFactor(healthFactor)}</span>
                </div>
                <span className="text-[var(--muted-foreground)]">→</span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted-foreground)]">After:</span>
                  <span
                    className="font-medium"
                    style={{ color: newHealthStatus.color }}
                  >
                    {formatHealthFactor(newHealthFactor)}
                  </span>
                  {newHealthStatus.status !== 'healthy' && (
                    <AlertTriangle className="w-4 h-4" style={{ color: newHealthStatus.color }} />
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0 || withdrawAmount > effectiveMax}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Withdrawing...
              </>
            ) : (
              'Withdraw STX'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
