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

export function useCorePool(userAddress: string | null) {
  const [poolStats, setPoolStats] = useState<PoolStats>(defaultPoolStats);
  const [userPosition, setUserPosition] = useState<UserPosition>(defaultUserPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoolStats = useCallback(async () => {
    try {
      const endpoint = getApiEndpoint();
      const contractId = `${CONTRACTS.CORE_POOL.address}.${CONTRACTS.CORE_POOL.name}`;
      
      // Fetch pool stats using read-only function call
      const response = await fetch(
        `${endpoint}/v2/contracts/call-read/${CONTRACTS.CORE_POOL.address}/${CONTRACTS.CORE_POOL.name}/get-pool-stats`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sender: CONTRACTS.CORE_POOL.address, arguments: [] }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Parse the Clarity response
        // For now, use mock data until contract is deployed
        setPoolStats({
          totalDeposits: 1500000000000, // 1.5M STX in uSTX
          totalBorrows: 750000000000,   // 750K STX
          availableLiquidity: 750000000000,
          utilizationRate: 50,
          protocolTreasury: 15000000000, // 15K STX
        });
      }
    } catch (err) {
      console.error('Error fetching pool stats:', err);
      // Use mock data for demo
      setPoolStats({
        totalDeposits: 1500000000000,
        totalBorrows: 750000000000,
        availableLiquidity: 750000000000,
        utilizationRate: 50,
        protocolTreasury: 15000000000,
      });
    }
  }, []);

  const fetchUserPosition = useCallback(async () => {
    if (!userAddress) {
      setUserPosition(defaultUserPosition);
      return;
    }

    try {
      // For demo purposes, use mock data
      // In production, call the contract read-only functions
      setUserPosition({
        deposit: 100000000000, // 100K STX
        borrow: 50000000000,   // 50K STX
        maxBorrow: 16666666666, // ~16.6K more STX
        healthFactor: 200,     // 2.0 health factor
        accruedInterest: 500000000, // 500 STX
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
