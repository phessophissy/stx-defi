'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, parseSTX } from '@/lib/utils';
import { PROTOCOL_CONSTANTS } from '@/lib/contracts';
import { Vault, Loader2, Info } from 'lucide-react';

interface VaultDepositFormProps {
  sharePrice: number;
  calculateSharesForDeposit: (amount: number) => number;
  onDeposit: (amount: number) => Promise<void>;
}

export function VaultDepositForm({
  sharePrice,
  calculateSharesForDeposit,
  onDeposit,
}: VaultDepositFormProps) {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const depositAmount = parseSTX(amount || '0');
  const sharesToReceive = calculateSharesForDeposit(depositAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }

    const minDeposit = PROTOCOL_CONSTANTS.MIN_DEPOSIT / 1_000_000;
    if (parseFloat(amount) < minDeposit) {
      showToast('error', 'Below Minimum', `Minimum deposit is ${minDeposit} STX.`);
      return;
    }

    setIsLoading(true);
    try {
      await onDeposit(depositAmount);
      showToast('success', 'Deposit Successful', `Deposited ${amount} STX into the vault.`);
      setAmount('');
    } catch (error) {
      showToast('error', 'Deposit Failed', 'Transaction was rejected or failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vault className="w-5 h-5" />
            Deposit to Vault
          </CardTitle>
          <CardDescription>
            Deposit STX to earn yield. Your deposit will be represented as vault shares.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Connect your wallet to deposit into the vault
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
          <Vault className="w-5 h-5" />
          Deposit to Vault
        </CardTitle>
        <CardDescription>
          Deposit STX to earn yield. Your deposit will be represented as vault shares.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            type="number"
            label="Amount to Deposit"
            placeholder="0.00"
            suffix="STX"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.000001"
            helperText={`Minimum deposit: ${PROTOCOL_CONSTANTS.MIN_DEPOSIT / 1_000_000} STX`}
          />

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-lg bg-[var(--secondary)] space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Info className="w-4 h-4 text-[var(--primary)]" />
                Deposit Preview
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Share Price:</span>
                  <span>{(sharePrice / 10000).toFixed(4)} STX</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Shares to Receive:</span>
                  <span className="text-[var(--success)] font-medium">
                    {formatSTX(sharesToReceive)} shares
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Depositing...
              </>
            ) : (
              'Deposit to Vault'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
