// Type definitions for STX DeFi Protocol

// Core Pool Types
export interface PoolStats {
  totalDeposits: number;
  totalBorrows: number;
  availableLiquidity: number;
  utilizationRate: number;
}

export interface UserPoolPosition {
  deposit: number;
  borrow: number;
  healthFactor: number;
  isLiquidatable: boolean;
}

// Yield Vault Types
export interface VaultStats {
  totalStaked: number;
  totalShares: number;
  sharePrice: number;
  apy: number;
}

export interface UserVaultPosition {
  shares: number;
  value: number;
  pendingYield: number;
}

// Transaction Types
export type TransactionType =
  | 'deposit'
  | 'withdraw'
  | 'borrow'
  | 'repay'
  | 'vault-deposit'
  | 'vault-withdraw'
  | 'liquidate';

export type TransactionStatus = 'pending' | 'success' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: Date;
  txHash: string;
  status: TransactionStatus;
}

// Liquidation Types
export interface LiquidatablePosition {
  address: string;
  deposit: number;
  debt: number;
  healthFactor: number;
  potentialProfit: number;
}

// Network Types
export type NetworkType = 'mainnet' | 'testnet';

// Wallet Types
export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: number;
  network: NetworkType;
}

// Component Props Types
export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Form Types
export interface DepositFormData {
  amount: string;
}

export interface BorrowFormData {
  amount: string;
}

export interface RepayFormData {
  amount: string;
  repayAll: boolean;
}

export interface WithdrawFormData {
  amount: string;
  withdrawAll: boolean;
}

// API Response Types
export interface ContractCallResponse {
  txId: string;
  success: boolean;
}

export interface ContractReadResponse<T> {
  value: T;
  success: boolean;
}
