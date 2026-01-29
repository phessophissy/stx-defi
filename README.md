# STX DeFi Protocol

A decentralized lending, borrowing, and yield vault protocol built on Stacks (Bitcoin L2).

## Overview

STX DeFi Protocol enables users to:
- **Lend STX** - Deposit STX to earn interest from borrowers
- **Borrow STX** - Borrow against deposited collateral
- **Earn Yield** - Deposit into the yield vault for additional returns

## Architecture

The protocol consists of two main smart contracts:

### Core Pool (`core-pool.clar`)
Manages the lending and borrowing functionality with shared liquidity.

**Features:**
- Deposit STX as collateral
- Borrow up to 66.67% of collateral value (150% collateralization ratio)
- Repay loans with interest (5% APY)
- Withdraw deposits (if no outstanding loans or sufficient collateral remains)
- Liquidation mechanism for unhealthy positions (< 120% collateral ratio)

### Yield Vault (`yield-vault.clar`)
A separate vault for users seeking yield on their STX holdings.

**Features:**
- Deposit STX to receive vault shares
- Earn 8% APY on deposits
- Withdraw anytime by burning shares
- Share price appreciates as yield accumulates

## Key Parameters

| Parameter | Value |
|-----------|-------|
| Collateralization Ratio | 150% |
| Liquidation Threshold | 120% |
| Borrow Interest Rate | 5% APY |
| Vault Yield Rate | 8% APY |
| Protocol Fee | 0.5% |

## Getting Started



### Local Development


```bash
clarinet deployments generate --mainnet
clarinet deployments apply --mainnet
```

## Contract Interactions
deploy

### Core Pool

```clarity
;; Deposit STX
(contract-call? .core-pool deposit u100000000)  ;; 100 STX

;; Borrow STX (max 66.67% of deposit)
(contract-call? .core-pool borrow u50000000)  ;; 50 STX

;; Repay loan
(contract-call? .core-pool repay u50000000)

;; Withdraw deposit
(contract-call? .core-pool withdraw u100000000)

;; Check position
(contract-call? .core-pool get-user-deposit tx-sender)
(contract-call? .core-pool get-user-borrow tx-sender)
(contract-call? .core-pool get-health-factor tx-sender)
```

### Yield Vault

```clarity
;; Deposit to vault
(contract-call? .yield-vault vault-deposit u50000000)  ;; 50 STX

;; Check shares and value
(contract-call? .yield-vault get-user-shares tx-sender)
(contract-call? .yield-vault get-user-value tx-sender)

;; Withdraw (specify shares to burn)
(contract-call? .yield-vault vault-withdraw u50000000)

;; Withdraw all
(contract-call? .yield-vault vault-withdraw-all)
```

## Security Considerations

- Contracts undergo thorough testing before mainnet deployment
- Liquidation mechanism protects lenders from bad debt
- Protocol fees ensure sustainability
- Emergency functions available for contract owner

### Clarity Smart Contract Security Best Practices

When working with Clarity smart contracts, be aware of these critical patterns:

1. **as-contract Context Switching**: When using `(as-contract ...)`, the `tx-sender` changes to the contract principal. Always capture the user's principal before entering the as-contract context:

```clarity
;; CORRECT: Capture user before as-contract
(define-public (withdraw (amount uint))
  (let (
    (user tx-sender)  ;; Capture user first!
  )
    ;; ... validation logic ...
    (try! (as-contract (stx-transfer? amount tx-sender user)))  ;; user is the recipient
    (ok amount)
  )
)

;; WRONG: Using tx-sender inside as-contract transfers to contract itself
(try! (as-contract (stx-transfer? amount tx-sender tx-sender)))  ;; BUG: sends to self!
```

2. **Balance Verification Tests**: Always include tests that verify:
   - User balances decrease after deposits
   - User balances increase after withdrawals
   - Contract balances change appropriately

3. **Post-Conditions**: Use appropriate post-conditions in frontend to protect users from unexpected transfers.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## Risk Factors

1. **Smart Contract Risk** - Bugs in contract code could lead to loss of funds
2. **Liquidation Risk** - Borrowers may be liquidated if collateral value drops
3. **Interest Rate Risk** - Fixed rates may not reflect market conditions
4. **Liquidity Risk** - High utilization may prevent withdrawals


This protocol is provided as-is. Users should understand the risks involved in DeFi protocols before participating. Always do your own research (DYOR) and never invest more than you can afford to lose.
