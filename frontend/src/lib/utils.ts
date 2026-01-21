// Utility functions for formatting and calculations

/**
 * Format STX amount from micro-STX (uSTX) to STX
 */
export function formatSTX(microSTX: number | string): string {
  const amount = Number(microSTX) / 1_000_000;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount);
}

/**
 * Parse STX amount to micro-STX
 */
export function parseSTX(stx: string | number): number {
  return Math.floor(Number(stx) * 1_000_000);
}

/**
 * Format percentage from basis points
 */
export function formatPercentage(basisPoints: number): string {
  return `${(basisPoints / 100).toFixed(2)}%`;
}

/**
 * Format health factor
 */
export function formatHealthFactor(healthFactor: number): string {
  if (healthFactor >= 9999) return '∞';
  return (healthFactor / 100).toFixed(2);
}

/**
 * Get health factor status and color
 */
export function getHealthStatus(healthFactor: number): {
  status: 'healthy' | 'warning' | 'danger';
  color: string;
  label: string;
} {
  if (healthFactor >= 200) {
    return { status: 'healthy', color: 'var(--success)', label: 'Healthy' };
  } else if (healthFactor >= 120) {
    return { status: 'warning', color: 'var(--warning)', label: 'Warning' };
  } else {
    return { status: 'danger', color: 'var(--destructive)', label: 'At Risk' };
  }
}

/**
 * Truncate wallet address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format large numbers with abbreviations
 */
export function formatCompact(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Calculate max borrowable amount
 */
export function calculateMaxBorrow(
  depositAmount: number,
  currentBorrow: number,
  collateralRatio: number
): number {
  if (depositAmount === 0) return 0;
  return Math.floor((depositAmount * 100) / collateralRatio) - currentBorrow;
}

/**
 * Calculate health factor
 */
export function calculateHealthFactor(
  depositAmount: number,
  totalDebt: number
): number {
  if (totalDebt === 0) return 9999;
  return Math.floor((depositAmount * 100) / totalDebt);
}

/**
 * Check if position is liquidatable
 */
export function isLiquidatable(
  depositAmount: number,
  totalDebt: number,
  liquidationThreshold: number
): boolean {
  if (totalDebt === 0) return false;
  return depositAmount * 100 < totalDebt * liquidationThreshold;
}

/**
 * Calculate utilization rate
 */
export function calculateUtilization(
  totalBorrows: number,
  totalDeposits: number
): number {
  if (totalDeposits === 0) return 0;
  return Math.floor((totalBorrows * 100) / totalDeposits);
}
