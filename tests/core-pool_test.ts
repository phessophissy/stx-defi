import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.7.0/index.ts';
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

// Core Pool Tests

Clarinet.test({
  name: "core-pool: can initialize the protocol",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
  },
});

Clarinet.test({
  name: "core-pool: user can deposit STX",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
      Tx.contractCall('core-pool', 'deposit', [types.uint(100000000)], wallet1.address), // 100 STX
    ]);
    
    assertEquals(block.receipts.length, 2);
    block.receipts[1].result.expectOk();
    
    // Check deposit
    let depositCall = chain.callReadOnlyFn(
      'core-pool',
      'get-user-deposit',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    assertEquals(depositCall.result, types.uint(100000000));
  },
});

Clarinet.test({
  name: "core-pool: user can borrow against collateral",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
      Tx.contractCall('core-pool', 'deposit', [types.uint(100000000)], wallet1.address), // 100 STX
      Tx.contractCall('core-pool', 'borrow', [types.uint(50000000)], wallet1.address),  // 50 STX (50% of collateral)
    ]);
    
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectOk();
    
    // Check borrow
    let borrowCall = chain.callReadOnlyFn(
      'core-pool',
      'get-user-borrow',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    assertEquals(borrowCall.result, types.uint(50000000));
  },
});

Clarinet.test({
  name: "core-pool: cannot borrow more than max allowed",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
      Tx.contractCall('core-pool', 'deposit', [types.uint(100000000)], wallet1.address), // 100 STX
      Tx.contractCall('core-pool', 'borrow', [types.uint(70000000)], wallet1.address),  // 70 STX (70% > 66.67%)
    ]);
    
    assertEquals(block.receipts.length, 3);
    block.receipts[2].result.expectErr().expectUint(1002); // ERR_INSUFFICIENT_COLLATERAL
  },
});

Clarinet.test({
  name: "core-pool: user can repay loan",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
      Tx.contractCall('core-pool', 'deposit', [types.uint(100000000)], wallet1.address),
      Tx.contractCall('core-pool', 'borrow', [types.uint(50000000)], wallet1.address),
    ]);
    
    // Repay
    let repayBlock = chain.mineBlock([
      Tx.contractCall('core-pool', 'repay', [types.uint(50000000)], wallet1.address),
    ]);
    
    repayBlock.receipts[0].result.expectOk();
    
    // Check borrow is 0
    let borrowCall = chain.callReadOnlyFn(
      'core-pool',
      'get-user-borrow',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    assertEquals(borrowCall.result, types.uint(0));
  },
});

Clarinet.test({
  name: "core-pool: user can withdraw after repaying",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    let block = chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
      Tx.contractCall('core-pool', 'deposit', [types.uint(100000000)], wallet1.address),
      Tx.contractCall('core-pool', 'borrow', [types.uint(50000000)], wallet1.address),
      Tx.contractCall('core-pool', 'repay', [types.uint(50000000)], wallet1.address),
      Tx.contractCall('core-pool', 'withdraw', [types.uint(100000000)], wallet1.address),
    ]);
    
    assertEquals(block.receipts.length, 5);
    block.receipts[4].result.expectOk();
    
    // Check deposit is 0
    let depositCall = chain.callReadOnlyFn(
      'core-pool',
      'get-user-deposit',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    assertEquals(depositCall.result, types.uint(0));
  },
});

Clarinet.test({
  name: "core-pool: health factor calculation works",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    chain.mineBlock([
      Tx.contractCall('core-pool', 'initialize', [], deployer.address),
      Tx.contractCall('core-pool', 'deposit', [types.uint(100000000)], wallet1.address),
      Tx.contractCall('core-pool', 'borrow', [types.uint(50000000)], wallet1.address),
    ]);
    
    let healthCall = chain.callReadOnlyFn(
      'core-pool',
      'get-health-factor',
      [types.principal(wallet1.address)],
      wallet1.address
    );
    
    // 100 STX deposit, 50 STX borrow = 200 health factor
    assertEquals(healthCall.result, types.uint(200));
  },
});
