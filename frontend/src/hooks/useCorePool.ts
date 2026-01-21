'use client';

import { useState, useEffect, useCallback } from 'react';
import { getApiEndpoint, CONTRACTS, PROTOCOL_CONSTANTS } from '@/lib/contracts';

interface PoolStats {
  totalDeposits: number;
  totalBorrows: number;
  availableLiquidity: number;
  utilizationRate: number;
  protocolTreasury: number;
}

interface UserPosition {
  deposit: number;
  borrow: number;
  maxBorrow: number;
  healthFactor: number;
  accruedInterest: number;
  totalDebt: number;
  isLiquidatable: boolean;
}

const defaultPoolStats: PoolStats = {
  totalDeposits: 0,
  totalBorrows: 0,
  availableLiquidity: 0,
  utilizationRate: 0,
  protocolTreasury: 0,
};

const defaultUserPosition: UserPosition = {
  deposit: 0,
  borrow: 0,
  maxBorrow: 0,
  healthFactor: 9999,
  accruedInterest: 0,
  totalDebt: 0,
  isLiquidatable: false,
};

export function useCorePool(userAddress?: string | null) {
  const [poolStats, setPoolStats] = useState<PoolStats>(defaultPoolStats);
  const [userPosition, setUserPosition] = useState<UserPosition>(defaultUserPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoolStats = useCallback(async () => {
    try {
      // For demo, use mock data
      setPoolStats({
        totalDeposits: 1500000000000,
        totalBorrows: 750000000000,
        availableLiquidity: 750000000000,
        utilizationRate: 50,
        protocolTreasury: 15000000000,
      });
    } catch (err) {
      console.error('Error fetching pool stats:', err);
      setPoolStats(defaultPoolStats);
    }
  }, []);

  const fetchUserPosition = useCallback(async () => {
    if (!userAddress) {
      setUserPosition(defaultUserPosition);
      return;
    }

    try {
      setUserPosition({
        deposit: 100000000000,
        borrow: 50000000000,
        maxBorrow: 16666666666,
        healthFactor: 200,
        accruedInterest: 500000000,
        totalDebt: 50500000000,
        isLiquidatable: false,
      });
    } catch (err) {
      console.error('Error fetching user position:', err);
      setUserPosition(defaultUserPosition);
    }
  }, [userAddress]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      await Promise.all([fetchPoolStats(), fetchUserPosition()]);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchPoolStats, fetchUserPosition]);

  const refetch = useCallback(() => {
    fetchPoolStats();
    fetchUserPosition();
  }, [fetchPoolStats, fetchUserPosition]);

  return {
    poolStats,
    userPosition,
    isLoading,
    error,
    refetch,
    constants: PROTOCOL_CONSTANTS,
  };
}
