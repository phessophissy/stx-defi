'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, parseSTX, formatHealthFactor, getHealthStatus, calculateHealthFactor } from '@/lib/utils';
import { PROTOCOL_CONSTANTS } from '@/lib/contracts';
import { Coins, AlertTriangle, Loader2 } from 'lucide-react';

interface BorrowFormProps {
  currentDeposit: number;
  currentBorrow: number;
  maxBorrow: number;
  healthFactor: number;
  availableLiquidity: number;
  onBorrow: (amount: number) => Promise<void>;
}

export function BorrowForm({
  currentDeposit,
  currentBorrow,
  maxBorrow,
  healthFactor,
  availableLiquidity,
  onBorrow,
}: BorrowFormProps) {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const borrowAmount = parseSTX(amount || '0');
  const newBorrow = currentBorrow + borrowAmount;
  const newHealthFactor = calculateHealthFactor(currentDeposit, newBorrow);
  const newHealthStatus = getHealthStatus(newHealthFactor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid borrow amount.');
      return;
    }

    if (borrowAmount > maxBorrow) {
      showToast('error', 'Exceeds Limit', 'Amount exceeds your maximum borrowable limit.');
      return;
    }

    if (borrowAmount > availableLiquidity) {
      showToast('error', 'Insufficient Liquidity', 'Not enough liquidity in the pool.');
      return;
    }

    setIsLoading(true);
    try {
      await onBorrow(borrowAmount);
      showToast('success', 'Borrow Successful', `Successfully borrowed ${amount} STX.`);
      setAmount('');
    } catch (error) {
      showToast('error', 'Borrow Failed', 'Transaction was rejected or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    const max = Math.min(maxBorrow, availableLiquidity);
    setAmount((max / 1_000_000).toString());
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            Borrow STX
          </CardTitle>
          <CardDescription>
            Borrow STX against your deposited collateral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Connect your wallet to borrow STX
            </p>
            <Button onClick={connect}>Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          Borrow STX
        </CardTitle>
        <CardDescription>
          Borrow up to {PROTOCOL_CONSTANTS.COLLATERAL_RATIO}% of your collateral value.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Amount to Borrow</label>
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
              <span className="text-[var(--muted-foreground)]">Current Borrow:</span>
              <span>{formatSTX(currentBorrow)} STX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Max Borrowable:</span>
              <span className="text-[var(--primary)]">{formatSTX(maxBorrow)} STX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Available Liquidity:</span>
              <span>{formatSTX(availableLiquidity)} STX</span>
            </div>
          </div>

          {/* Health Factor Preview */}
          {amount && parseFloat(amount) > 0 && (
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
            disabled={!amount || parseFloat(amount) <= 0 || borrowAmount > maxBorrow}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Borrowing...
              </>
            ) : (
              'Borrow STX'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
