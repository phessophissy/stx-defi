import { useCallback } from 'react';
import { openContractCall } from '@stacks/connect';
import { uintCV, PostConditionMode } from '@stacks/transactions';
import { CONTRACT_ADDRESSES, CORE_POOL_CONTRACT, YIELD_VAULT_CONTRACT } from '@/lib/contracts';
import { parseSTX } from '@/lib/utils';
import { useWallet } from '@/context/WalletContext';

interface TransactionOptions {
  onFinish?: (txId: string) => void;
  onCancel?: () => void;
}

export function useContractTransactions() {
  const { isConnected } = useWallet();

  const contractAddress = CONTRACT_ADDRESSES.testnet;

  const deposit = useCallback(
    async (amount: string, options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      const amountMicroSTX = parseSTX(amount);

      await openContractCall({
        contractAddress,
        contractName: CORE_POOL_CONTRACT,
        functionName: 'deposit',
        functionArgs: [uintCV(amountMicroSTX)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  const withdraw = useCallback(
    async (amount: string, options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      const amountMicroSTX = parseSTX(amount);

      await openContractCall({
        contractAddress,
        contractName: CORE_POOL_CONTRACT,
        functionName: 'withdraw',
        functionArgs: [uintCV(amountMicroSTX)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  const borrow = useCallback(
    async (amount: string, options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      const amountMicroSTX = parseSTX(amount);

      await openContractCall({
        contractAddress,
        contractName: CORE_POOL_CONTRACT,
        functionName: 'borrow',
        functionArgs: [uintCV(amountMicroSTX)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  const repay = useCallback(
    async (amount: string, options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      const amountMicroSTX = parseSTX(amount);

      await openContractCall({
        contractAddress,
        contractName: CORE_POOL_CONTRACT,
        functionName: 'repay',
        functionArgs: [uintCV(amountMicroSTX)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  const vaultDeposit = useCallback(
    async (amount: string, options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      const amountMicroSTX = parseSTX(amount);

      await openContractCall({
        contractAddress,
        contractName: YIELD_VAULT_CONTRACT,
        functionName: 'vault-deposit',
        functionArgs: [uintCV(amountMicroSTX)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  const vaultWithdraw = useCallback(
    async (shares: number, options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      await openContractCall({
        contractAddress,
        contractName: YIELD_VAULT_CONTRACT,
        functionName: 'vault-withdraw',
        functionArgs: [uintCV(shares)],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  const vaultWithdrawAll = useCallback(
    async (options?: TransactionOptions) => {
      if (!isConnected) throw new Error('Wallet not connected');

      await openContractCall({
        contractAddress,
        contractName: YIELD_VAULT_CONTRACT,
        functionName: 'vault-withdraw-all',
        functionArgs: [],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data) => {
          options?.onFinish?.(data.txId);
        },
        onCancel: options?.onCancel,
      });
    },
    [isConnected, contractAddress]
  );

  return {
    deposit,
    withdraw,
    borrow,
    repay,
    vaultDeposit,
    vaultWithdraw,
    vaultWithdrawAll,
  };
}
