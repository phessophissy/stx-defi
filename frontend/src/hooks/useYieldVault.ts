'use client';

import { useState, useEffect, useCallback } from 'react';
import { PROTOCOL_CONSTANTS } from '@/lib/contracts';

interface VaultStats {
  totalStaked: number;
  totalShares: number;
  totalAssets: number;
  sharePrice: number;
  pendingYield: number;
  apy: number;
}

interface UserVaultPosition {
  shares: number;
  value: number;
  depositBlock: number;
}

const defaultVaultStats: VaultStats = {
  totalStaked: 0,
  totalShares: 0,
  totalAssets: 0,
  sharePrice: 10000,
  pendingYield: 0,
  apy: PROTOCOL_CONSTANTS.VAULT_YIELD_RATE,
};

const defaultUserVaultPosition: UserVaultPosition = {
  shares: 0,
  value: 0,
  depositBlock: 0,
};

export function useYieldVault(userAddress?: string | null) {
  const [vaultStats, setVaultStats] = useState<VaultStats>(defaultVaultStats);
  const [userPosition, setUserPosition] = useState<UserVaultPosition>(defaultUserVaultPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaultStats = useCallback(async () => {
    try {
      setVaultStats({
        totalStaked: 500000000000,
        totalShares: 480000000000,
        totalAssets: 520000000000,
        sharePrice: 10833,
        pendingYield: 20000000000,
        apy: PROTOCOL_CONSTANTS.VAULT_YIELD_RATE,
      });
    } catch (err) {
      console.error('Error fetching vault stats:', err);
      setVaultStats(defaultVaultStats);
    }
  }, []);

  const fetchUserPosition = useCallback(async () => {
    if (!userAddress) {
      setUserPosition(defaultUserVaultPosition);
      return;
    }

    try {
      setUserPosition({
        shares: 50000000000,
        value: 54165000000,
        depositBlock: 150000,
      });
    } catch (err) {
      console.error('Error fetching user vault position:', err);
      setUserPosition(defaultUserVaultPosition);
    }
  }, [userAddress]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([fetchVaultStats(), fetchUserPosition()]);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchVaultStats, fetchUserPosition]);

  const calculateSharesForDeposit = useCallback((amount: number): number => {
    if (vaultStats.totalShares === 0) return amount;
    return Math.floor((amount * vaultStats.totalShares) / vaultStats.totalAssets);
  }, [vaultStats]);

  const calculateSTXForShares = useCallback((shares: number): number => {
    if (vaultStats.totalShares === 0) return 0;
    return Math.floor((shares * vaultStats.totalAssets) / vaultStats.totalShares);
  }, [vaultStats]);

  const refetch = useCallback(() => {
    fetchVaultStats();
    fetchUserPosition();
  }, [fetchVaultStats, fetchUserPosition]);

  return {
    vaultStats,
    userPosition,
    isLoading,
    error,
    refetch,
    calculateSharesForDeposit,
    calculateSTXForShares,
    constants: PROTOCOL_CONSTANTS,
  };
}
