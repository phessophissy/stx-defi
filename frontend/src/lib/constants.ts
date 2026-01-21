// Protocol Constants
export const PROTOCOL_NAME = 'STX DeFi Protocol';
export const PROTOCOL_DESCRIPTION = 'Decentralized Lending & Yield Generation on Stacks';

// Contract Constants (matching smart contracts)
export const COLLATERAL_RATIO = 150; // 150%
export const LIQUIDATION_THRESHOLD = 120; // 120%
export const BORROW_INTEREST_RATE = 500; // 5.00% (basis points)
export const VAULT_YIELD_RATE = 800; // 8.00% (basis points)
export const LIQUIDATION_BONUS = 50; // 0.50% (basis points)
export const MIN_DEPOSIT = 1000; // 0.001 STX in micro-STX

// Display Formatting
export const STX_DECIMALS = 6;
export const DISPLAY_DECIMALS = 2;

// Health Factor Thresholds
export const HEALTH_FACTOR_SAFE = 200; // 2.00
export const HEALTH_FACTOR_WARNING = 150; // 1.50
export const HEALTH_FACTOR_DANGER = 130; // 1.30
export const HEALTH_FACTOR_LIQUIDATABLE = 120; // 1.20

// UI Constants
export const REFRESH_INTERVAL = 30000; // 30 seconds
export const TOAST_DURATION = 5000; // 5 seconds
export const ANIMATION_DURATION = 300; // 300ms

// External Links
export const EXPLORER_URL = 'https://explorer.stacks.co';
export const DOCS_URL = 'https://docs.stxdefi.io';
export const DISCORD_URL = 'https://discord.gg/stacks';
export const TWITTER_URL = 'https://twitter.com/stxdefi';
export const GITHUB_URL = 'https://github.com/phessophissy/stx-defi';

// Network Configuration
export const SUPPORTED_NETWORKS = ['mainnet', 'testnet'] as const;
export const DEFAULT_NETWORK = 'testnet';

// Transaction Configuration
export const MAX_GAS_LIMIT = 1000000;
export const DEFAULT_POST_CONDITION_MODE = 'allow' as const;
