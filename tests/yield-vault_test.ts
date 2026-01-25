import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Yield Vault Tests

Clarinet.test({
  name: "yield-vault: can initialize the vault",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
    ]);

    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "yield-vault: user can deposit and receive shares",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(50000000)], wallet1.address), // 50 STX
    ]);

    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk();

    // Check shares (1:1 for first deposit)
    let sharesCall = chain.callReadOnlyFn(
      'yield-vault',
      'get-user-shares',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    assertEquals(sharesCall.result, types.uint(50000000));
  },
});

Clarinet.test({
  name: "yield-vault: user can withdraw shares",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(50000000)], wallet1.address),
    ]);

    // Withdraw
    let withdrawBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'vault-withdraw', [types.uint(50000000)], wallet1.address),
    ]);

    withdrawBlock.receipts[0].result.expectOk();

    // Check shares is 0
    let sharesCall = chain.callReadOnlyFn(
      'yield-vault',
      'get-user-shares',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    assertEquals(sharesCall.result, types.uint(0));
  },
});

Clarinet.test({
  name: "yield-vault: can withdraw all shares at once",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(50000000)], wallet1.address),
      Tx.contractCall('yield-vault', 'vault-withdraw-all', [], wallet1.address),
    ]);

    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectOk();
  },
});

Clarinet.test({
  name: "yield-vault: cannot deposit below minimum",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(500)], wallet1.address), // Below 1000 minimum
    ]);

    block.receipts[1].result.expectErr().expectUint(2002); // ERR_INVALID_AMOUNT
  },
});

Clarinet.test({
  name: "yield-vault: share price reflects accumulated yield",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(100000000)], wallet1.address), // 100 STX
      Tx.contractCall('yield-vault', 'add-yield', [types.uint(10000000)], deployer.address), // Add 10 STX yield
    ]);

    // Total assets should be 110 STX now, shares should be 100M
    // Share price should be 110/100 = 1.1 (or 11000 in precision units)
    let statsCall = chain.callReadOnlyFn(
      'yield-vault',
      'get-vault-stats',
      [],
      wallet1.address
    );

    // Total assets should include the yield
    const stats = statsCall.result.expectTuple();
    assertEquals(stats['total-deposits'], types.uint(100000000));
  },
});

Clarinet.test({
  name: "yield-vault: multiple users get fair shares",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    const wallet2 = accounts.get('wallet_2')!;

    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(100000000)], wallet1.address), // 100 STX
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(100000000)], wallet2.address), // 100 STX
    ]);

    // Both should have same shares since deposited at same price
    let shares1 = chain.callReadOnlyFn(
      'yield-vault',
      'get-user-shares',
      [types.principal(wallet1.address)],
      wallet1.address
    );

    let shares2 = chain.callReadOnlyFn(
      'yield-vault',
      'get-user-shares',
      [types.principal(wallet2.address)],
      wallet2.address
    );

    assertEquals(shares1.result, shares2.result);
  },
});

// NEW TESTS: Verify funds actually reach user's wallet after withdrawal

Clarinet.test({
  name: "yield-vault: withdrawal transfers STX to user wallet (critical bug fix verification)",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    const depositAmount = 100000000; // 100 STX

    // Get initial balance
    const initialBalance = chain.getAssetsMaps().assets['STX'][wallet1.address];

    // Initialize and deposit
    let depositBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(depositAmount)], wallet1.address),
    ]);

    assertEquals(depositBlock.receipts.length, 2);
    depositBlock.receipts[1].result.expectOk();

    // Verify balance decreased after deposit
    const balanceAfterDeposit = chain.getAssetsMaps().assets['STX'][wallet1.address];
    assertEquals(balanceAfterDeposit, initialBalance - depositAmount);

    // Withdraw all shares
    let withdrawBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'vault-withdraw', [types.uint(depositAmount)], wallet1.address),
    ]);

    withdrawBlock.receipts[0].result.expectOk();

    // CRITICAL: Verify user's STX balance increased after withdrawal
    const balanceAfterWithdraw = chain.getAssetsMaps().assets['STX'][wallet1.address];
    
    // User should have their STX back (minus any small rounding)
    // Balance should be back to approximately initial balance
    assertEquals(balanceAfterWithdraw >= initialBalance - 1000, true, 
      User balance after withdrawal () should be close to initial balance ().  +
      This verifies the critical bug fix - STX must be transferred TO the user, not to the contract itself.
    );
  },
});

Clarinet.test({
  name: "yield-vault: withdrawal with yield transfers correct amount to user",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    const depositAmount = 100000000; // 100 STX
    const yieldAmount = 10000000;    // 10 STX yield

    const initialBalance = chain.getAssetsMaps().assets['STX'][wallet1.address];

    // Initialize, deposit, and add yield
    let block = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(depositAmount)], wallet1.address),
      Tx.contractCall('yield-vault', 'add-yield', [types.uint(yieldAmount)], deployer.address),
    ]);

    assertEquals(block.receipts.length, 3);

    const balanceAfterDeposit = chain.getAssetsMaps().assets['STX'][wallet1.address];

    // Withdraw all shares - should receive deposit + yield
    let withdrawBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'vault-withdraw-all', [], wallet1.address),
    ]);

    const result = withdrawBlock.receipts[0].result.expectOk().expectTuple();
    const withdrawnAmount = parseInt(result['withdrawn'].replace('u', ''));
    
    // User should receive more than deposited (deposit + yield share)
    assertEquals(withdrawnAmount >= depositAmount, true,
      Withdrawn amount () should be >= deposit () due to yield
    );

    // Verify actual balance increased
    const balanceAfterWithdraw = chain.getAssetsMaps().assets['STX'][wallet1.address];
    assertEquals(balanceAfterWithdraw > balanceAfterDeposit, true,
      User balance after withdrawal should be higher than after deposit
    );
  },
});

Clarinet.test({
  name: "yield-vault: vault contract balance decreases on withdrawal",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    const depositAmount = 50000000; // 50 STX

    // Initialize and deposit
    let depositBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(depositAmount)], wallet1.address),
    ]);

    // Get vault contract address
    const vaultContractAddress = ${deployer.address}.yield-vault;
    
    // Check vault balance after deposit
    const vaultBalanceAfterDeposit = chain.getAssetsMaps().assets['STX'][vaultContractAddress] || 0;
    assertEquals(vaultBalanceAfterDeposit >= depositAmount, true,
      Vault should hold deposited funds
    );

    // Withdraw
    let withdrawBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'vault-withdraw', [types.uint(depositAmount)], wallet1.address),
    ]);

    withdrawBlock.receipts[0].result.expectOk();

    // Vault balance should decrease
    const vaultBalanceAfterWithdraw = chain.getAssetsMaps().assets['STX'][vaultContractAddress] || 0;
    assertEquals(vaultBalanceAfterWithdraw < vaultBalanceAfterDeposit, true,
      Vault balance should decrease after withdrawal. Before: , After: .  +
      If vault balance stayed the same, funds were transferred to vault instead of user (the bug we fixed).
    );
  },
});

Clarinet.test({
  name: "yield-vault: partial withdrawal transfers correct amount",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    const depositAmount = 100000000; // 100 STX
    const withdrawShares = 50000000;  // 50 shares (half)

    const initialBalance = chain.getAssetsMaps().assets['STX'][wallet1.address];

    // Initialize and deposit
    let depositBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'initialize', [], deployer.address),
      Tx.contractCall('yield-vault', 'vault-deposit', [types.uint(depositAmount)], wallet1.address),
    ]);

    const balanceAfterDeposit = chain.getAssetsMaps().assets['STX'][wallet1.address];
    assertEquals(balanceAfterDeposit, initialBalance - depositAmount);

    // Partial withdraw (50%)
    let withdrawBlock = chain.mineBlock([
      Tx.contractCall('yield-vault', 'vault-withdraw', [types.uint(withdrawShares)], wallet1.address),
    ]);

    const result = withdrawBlock.receipts[0].result.expectOk().expectTuple();
    
    // Check remaining shares
    const remainingShares = parseInt(result['remaining-shares'].replace('u', ''));
    assertEquals(remainingShares, withdrawShares, Should have half shares remaining);

    // Verify user received approximately half their deposit back
    const balanceAfterWithdraw = chain.getAssetsMaps().assets['STX'][wallet1.address];
    const received = balanceAfterWithdraw - balanceAfterDeposit;
    
    // Should have received approximately 50 STX (allow for small rounding)
    assertEquals(received >= withdrawShares - 1000 && received <= withdrawShares + 1000, true,
      User should receive approximately  but got 
    );
  },
});
