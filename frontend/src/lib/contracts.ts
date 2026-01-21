// Contract configuration for STX DeFi Protocol
export const NETWORK = 'mainnet';

export const CONTRACTS = {
  CORE_POOL: {
    address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS',
    name: 'core-pool',
  },
  YIELD_VAULT: {
    address: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS',
    name: 'yield-vault',
  },
} as const;

// Export contract names for hooks
export const CORE_POOL_CONTRACT = CONTRACTS.CORE_POOL.name;
export const YIELD_VAULT_CONTRACT = CONTRACTS.YIELD_VAULT.name;

// Contract addresses by network
export const CONTRACT_ADDRESSES: Record<string, string> = {
  mainnet: 'SP2ZNGJ85ENDY6QRHQ5P2D4FXKGZWCKTB2T0Z55KS',
  testnet: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
};

// Protocol constants matching smart contracts
export const PROTOCOL_CONSTANTS = {
  COLLATERAL_RATIO: 150, // 150% collateralization required
  LIQUIDATION_THRESHOLD: 120, // 120% threshold for liquidation
  BORROW_INTEREST_RATE: 500, // 5% APY in basis points
  VAULT_YIELD_RATE: 800, // 8% APY in basis points
  BLOCKS_PER_YEAR: 52560,
  PROTOCOL_FEE: 50, // 0.5% fee
  PRECISION: 10000,
  MIN_DEPOSIT: 1000, // 0.001 STX minimum
} as const;

// Stacks API endpoints
export const API_ENDPOINTS = {
  mainnet: 'https://stacks-node-api.mainnet.stacks.co',
  testnet: 'https://stacks-node-api.testnet.stacks.co',
} as const;

export const getApiEndpoint = () => API_ENDPOINTS[NETWORK];
