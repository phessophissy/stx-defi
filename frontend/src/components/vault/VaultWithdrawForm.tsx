'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, parseSTX } from '@/lib/utils';
import { ArrowUpFromLine, Loader2, Info } from 'lucide-react';

interface VaultWithdrawFormProps {
  userShares: number;
  sharePrice: number;
  calculateSTXForShares: (shares: number) => number;
  onWithdraw: (shares: number) => Promise<void>;
}

export function VaultWithdrawForm({
  userShares,
  sharePrice,
  calculateSTXForShares,
  onWithdraw,
}: VaultWithdrawFormProps) {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [shares, setShares] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const shareAmount = parseSTX(shares || '0');
  const stxToReceive = calculateSTXForShares(shareAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!shares || parseFloat(shares) <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid share amount.');
      return;
    }

    if (shareAmount > userShares) {
      showToast('error', 'Insufficient Shares', 'You do not have enough shares.');
      return;
    }

    setIsLoading(true);
    try {
      await onWithdraw(shareAmount);
      showToast('success', 'Withdrawal Successful', `Withdrew ${formatSTX(stxToReceive)} STX.`);
      setShares('');
    } catch (error) {
      showToast('error', 'Withdrawal Failed', 'Transaction was rejected or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setShares((userShares / 1_000_000).toString());
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            Withdraw from Vault
          </CardTitle>
          <CardDescription>
            Redeem your vault shares for STX plus earned yield.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Connect your wallet to withdraw from the vault
            </p>
            <Button onClick={connect}>Connect Wallet</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userShares === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpFromLine className="w-5 h-5" />
            Withdraw from Vault
          </CardTitle>
          <CardDescription>
            Redeem your vault shares for STX plus earned yield.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)]">
              You have no vault shares to withdraw.
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
          Withdraw from Vault
        </CardTitle>
        <CardDescription>
          Redeem your vault shares for STX plus earned yield.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Shares to Redeem</label>
              <button
                type="button"
                onClick={handleMaxClick}
                className="text-xs text-[var(--primary)] hover:underline"
              >
                Withdraw All
              </button>
            </div>
            <Input
              type="number"
              placeholder="0.00"
              suffix="shares"
              value={shares}
              onChange={(e) => setShares(e.target.value)}
              min="0"
              step="0.000001"
            />
          </div>

          <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
            <span>Your Shares:</span>
            <span className="font-medium text-[var(--foreground)]">
              {formatSTX(userShares)} shares
            </span>
          </div>

          {/* Preview */}
          {shares && parseFloat(shares) > 0 && (
            <div className="p-4 rounded-lg bg-[var(--secondary)] space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4 text-[var(--primary)]" />
                Withdrawal Preview
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Share Price:</span>
                  <span>{(sharePrice / 10000).toFixed(4)} STX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">STX to Receive:</span>
                  <span className="text-[var(--success)] font-medium">
                    {formatSTX(stxToReceive)} STX
                  </span>
                </div>
                {stxToReceive > shareAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--muted-foreground)]">Earned Yield:</span>
                    <span className="text-[var(--success)]">
                      +{formatSTX(stxToReceive - shareAmount)} STX
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!shares || parseFloat(shares) <= 0 || shareAmount > userShares}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Withdrawing...
              </>
            ) : (
              'Withdraw from Vault'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
