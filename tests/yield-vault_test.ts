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
