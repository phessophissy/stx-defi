'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX } from '@/lib/utils';
import { Clock, ArrowUpRight, ArrowDownRight, Repeat, PiggyBank } from 'lucide-react';
import clsx from 'clsx';

type TransactionType = 'deposit' | 'withdraw' | 'borrow' | 'repay' | 'vault-deposit' | 'vault-withdraw' | 'liquidate';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
  txHash: string;
  status: 'success' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 1000000000,
    timestamp: new Date(Date.now() - 3600000),
    txHash: '0x1234567890abcdef',
    status: 'success',
  },
  {
    id: '2',
    type: 'borrow',
    amount: 500000000,
    timestamp: new Date(Date.now() - 7200000),
    txHash: '0xabcdef1234567890',
    status: 'success',
  },
  {
    id: '3',
    type: 'vault-deposit',
    amount: 2000000000,
    timestamp: new Date(Date.now() - 86400000),
    txHash: '0x0987654321fedcba',
    status: 'success',
  },
  {
    id: '4',
    type: 'repay',
    amount: 250000000,
    timestamp: new Date(Date.now() - 172800000),
    txHash: '0xfedcba0987654321',
    status: 'success',
  },
];

const typeConfig: Record<TransactionType, { icon: typeof ArrowUpRight; color: string; label: string }> = {
  deposit: { icon: ArrowUpRight, color: 'text-[var(--success)]', label: 'Deposit' },
  withdraw: { icon: ArrowDownRight, color: 'text-[var(--warning)]', label: 'Withdraw' },
  borrow: { icon: ArrowDownRight, color: 'text-[var(--warning)]', label: 'Borrow' },
  repay: { icon: Repeat, color: 'text-[var(--primary)]', label: 'Repay' },
  'vault-deposit': { icon: PiggyBank, color: 'text-[var(--success)]', label: 'Vault Deposit' },
  'vault-withdraw': { icon: PiggyBank, color: 'text-[var(--warning)]', label: 'Vault Withdraw' },
  liquidate: { icon: ArrowDownRight, color: 'text-[var(--destructive)]', label: 'Liquidation' },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface TransactionHistoryProps {
  limit?: number;
  className?: string;
}

export default function TransactionHistory({ limit = 10, className }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching transactions
    const fetchTransactions = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTransactions(mockTransactions.slice(0, limit));
      setIsLoading(false);
    };
    fetchTransactions();
  }, [limit]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3">
                <div className="w-10 h-10 bg-[var(--muted)] animate-pulse rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-[var(--muted)] animate-pulse rounded" />
                  <div className="w-16 h-3 bg-[var(--muted)] animate-pulse rounded" />
                </div>
                <div className="w-20 h-6 bg-[var(--muted)] animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 mx-auto text-[var(--muted-foreground)] mb-4" />
            <p className="text-[var(--muted-foreground)]">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const config = typeConfig[tx.type];
              const Icon = config.icon;
              return (
                <a
                  key={tx.id}
                  href={`https://explorer.stacks.co/txid/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-[var(--secondary)] transition-colors"
                >
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      config.color === 'text-[var(--success)]' && 'bg-[var(--success)]/10',
                      config.color === 'text-[var(--warning)]' && 'bg-[var(--warning)]/10',
                      config.color === 'text-[var(--primary)]' && 'bg-[var(--primary)]/10',
                      config.color === 'text-[var(--destructive)]' && 'bg-[var(--destructive)]/10'
                    )}
                  >
                    <Icon className={clsx('w-5 h-5', config.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{config.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formatTimeAgo(tx.timestamp)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={clsx(
                        'font-semibold',
                        tx.type.includes('deposit') || tx.type === 'repay'
                          ? 'text-[var(--success)]'
                          : 'text-[var(--foreground)]'
                      )}
                    >
                      {tx.type.includes('deposit') || tx.type === 'repay' ? '+' : '-'}
                      {formatSTX(tx.amount)} STX
                    </p>
                    <p
                      className={clsx(
                        'text-xs',
                        tx.status === 'success' && 'text-[var(--success)]',
                        tx.status === 'pending' && 'text-[var(--warning)]',
                        tx.status === 'failed' && 'text-[var(--destructive)]'
                      )}
                    >
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
