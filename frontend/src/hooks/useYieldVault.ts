'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiEndpoint, CONTRACTS, PROTOCOL_CONSTANTS } from '@/lib/contracts';

interface VaultStats {
  totalDeposits: number;
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
  totalDeposits: 0,
  totalShares: 0,
  totalAssets: 0,
  sharePrice: 10000, // 1.0 in PRECISION
  pendingYield: 0,
  apy: PROTOCOL_CONSTANTS.VAULT_YIELD_RATE,
};

const defaultUserVaultPosition: UserVaultPosition = {
  shares: 0,
  value: 0,
  depositBlock: 0,
};

export function useYieldVault(userAddress: string | null) {
  const [vaultStats, setVaultStats] = useState<VaultStats>(defaultVaultStats);
  const [userPosition, setUserPosition] = useState<UserVaultPosition>(defaultUserVaultPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVaultStats = useCallback(async () => {
    try {
      const endpoint = getApiEndpoint();
      
      // For demo, use mock data
      setVaultStats({
        totalDeposits: 500000000000, // 500K STX
        totalShares: 480000000000,   // Slightly less shares due to yield
        totalAssets: 520000000000,   // Including accrued yield
        sharePrice: 10833,           // 1.0833 (8.33% yield)
        pendingYield: 20000000000,   // 20K STX yield
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
      // Mock data for demo
      setUserPosition({
        shares: 50000000000,  // 50K shares
        value: 54165000000,   // ~54.16K STX value
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
