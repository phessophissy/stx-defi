'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, parseSTX } from '@/lib/utils';
import { ArrowUpFromLine, Loader2 } from 'lucide-react';

interface RepayFormProps {
  currentBorrow: number;
  accruedInterest: number;
  totalDebt: number;
  onRepay: (amount: number) => Promise<void>;
}

export function RepayForm({
  currentBorrow,
  accruedInterest,
  totalDebt,
  onRepay,
}: RepayFormProps) {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid repay amount.');
      return;
    }

    setIsLoading(true);
    try {
      await onRepay(parseSTX(amount));
      showToast('success', 'Repayment Successful', `Successfully repaid ${amount} STX.`);
      setAmount('');
    } catch (error) {
      showToast('error', 'Repayment Failed', 'Transaction was rejected or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount((totalDebt / 1_000_000).toString());
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            Repay Loan
          </CardTitle>
          <CardDescription>
            Repay your borrowed STX to reduce your debt and interest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Connect your wallet to repay
            </p>
            <Button onClick={connect}>Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentBorrow === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            Repay Loan
          </CardTitle>
          <CardDescription>
            Repay your borrowed STX to reduce your debt and interest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">
              You have no outstanding loans to repay.
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
          Repay Loan
        </CardTitle>
        <CardDescription>
          Repay your borrowed STX to reduce your debt and interest.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Amount to Repay</label>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                Repay All
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

          {/* Debt Breakdown */}
          <div className="space-y-2 py-4 border-y border-[var(--border)]">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Principal:</span>
              <span>{formatSTX(currentBorrow)} STX</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Accrued Interest:</span>
              <span className="text-[var(--destructive)]">+{formatSTX(accruedInterest)} STX</span>
            </div>
            <div className="flex justify-between text-sm font-medium pt-2 border-t border-[var(--border)]">
              <span>Total Debt:</span>
              <span className="text-[var(--warning)]">{formatSTX(totalDebt)} STX</span>
            </div>
          </div>

          {/* Remaining After Repay */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-lg bg-[var(--secondary)]">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--muted-foreground)]">Remaining after repay:</span>
                <span className="font-medium">
                  {formatSTX(Math.max(0, totalDebt - parseSTX(amount)))} STX
                </span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Repaying...
              </>
            ) : (
              'Repay Loan'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
