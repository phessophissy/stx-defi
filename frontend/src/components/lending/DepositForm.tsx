'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { useWallet } from '@/context/WalletContext';
import { formatSTX, parseSTX } from '@/lib/utils';
import { ArrowDownToLine, Loader2 } from 'lucide-react';

interface DepositFormProps {
  currentDeposit: number;
  onDeposit: (amount: number) => Promise<void>;
}

export function DepositForm({ currentDeposit, onDeposit }: DepositFormProps) {
  const { isConnected, connect } = useWallet();
  const { showToast } = useToast();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      showToast('error', 'Invalid Amount', 'Please enter a valid deposit amount.');
      return;
    }

    setIsLoading(true);
    try {
      await onDeposit(parseSTX(amount));
      showToast('success', 'Deposit Successful', `Successfully deposited ${amount} STX.`);
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
            <ArrowDownToLine className="w-5 h-5" />
            Deposit STX
          </CardTitle>
          <CardDescription>
            Deposit STX to earn interest and use as collateral for borrowing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-[var(--muted-foreground)] mb-4">
              Connect your wallet to deposit STX
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
          <ArrowDownToLine className="w-5 h-5" />
          Deposit STX
        </CardTitle>
        <CardDescription>
          Deposit STX to earn interest and use as collateral for borrowing.
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
          />
          <div className="flex justify-between text-sm text-[var(--muted-foreground)]">
            <span>Current Deposit:</span>
            <span className="font-medium text-[var(--foreground)]">
              {formatSTX(currentDeposit)} STX
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Depositing...
              </>
            ) : (
              'Deposit STX'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
