# STX DeFi Protocol Frontend

A modern, responsive frontend for the STX DeFi Protocol built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🏦 **Lending Pool** - Deposit STX as collateral and borrow against it
- 💰 **Yield Vault** - Earn 8% APY on your STX deposits
- ⚡ **Liquidations** - View and execute liquidations for undercollateralized positions
- 📊 **Analytics** - Track protocol metrics and TVL
- 🔐 **Wallet Integration** - Connect with Hiro Wallet via @stacks/connect

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Stacks via @stacks/connect & @stacks/transactions
- **Icons**: Lucide React
- **State Management**: React Context + Hooks

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Hiro Wallet browser extension

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── lend/              # Lending page
│   │   ├── vault/             # Yield vault page
│   │   ├── liquidate/         # Liquidations page
│   │   ├── positions/         # User positions
│   │   ├── analytics/         # Protocol analytics
│   │   └── faq/               # FAQ page
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Header, Footer
│   │   ├── dashboard/         # Dashboard components
│   │   ├── lending/           # Lending form components
│   │   ├── vault/             # Vault components
│   │   ├── liquidation/       # Liquidation components
│   │   ├── positions/         # Position components
│   │   └── analytics/         # Analytics charts
│   ├── context/               # React Context providers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utilities and config
│   └── types/                 # TypeScript definitions
├── public/                    # Static assets
└── package.json
```

## Smart Contract Integration

The frontend interacts with two Clarity smart contracts:

### Core Pool (`core-pool.clar`)
- `deposit(amount)` - Deposit STX as collateral
- `withdraw(amount)` - Withdraw deposited STX
- `borrow(amount)` - Borrow STX against collateral
- `repay(amount)` - Repay borrowed STX
- `liquidate(borrower)` - Liquidate undercollateralized positions

### Yield Vault (`yield-vault.clar`)
- `vault-deposit(amount)` - Deposit STX to earn yield
- `vault-withdraw(shares)` - Withdraw by share amount
- `vault-withdraw-all()` - Withdraw entire balance

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
