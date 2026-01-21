'use client';

import Link from 'next/link';
import { ArrowRight, Coins, Vault, Shield, Zap } from 'lucide-react';
import { Button, Card, CardContent } from '@/components/ui';
import { ProtocolStats, UserPositionCard, VaultPositionCard } from '@/components/dashboard';
import { useWallet } from '@/context/WalletContext';
import { useCorePool, useYieldVault } from '@/hooks';

export default function Home() {
  const { isConnected, address } = useWallet();
  const { poolStats, userPosition } = useCorePool(address);
  const { vaultStats, userPosition: vaultUserPosition } = useYieldVault(address);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          <span className="gradient-text">STX DeFi Protocol</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Decentralized lending, borrowing, and yield generation built on Stacks. 
          Earn yield on your STX or access liquidity without selling.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/lend">
            <Button size="lg" className="animate-pulse-glow">
              <Coins className="w-5 h-5 mr-2" />
              Start Lending
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/vault">
            <Button size="lg" variant="secondary">
              <Vault className="w-5 h-5 mr-2" />
              Explore Vault
            </Button>
          </Link>
        </div>
      </section>

      {/* Protocol Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Protocol Overview</h2>
        <ProtocolStats
          totalDeposits={poolStats.totalDeposits}
          totalBorrows={poolStats.totalBorrows}
          availableLiquidity={poolStats.availableLiquidity}
          utilizationRate={poolStats.utilizationRate}
          vaultTVL={vaultStats.totalAssets}
          vaultAPY={vaultStats.apy}
        />
      </section>

      {/* User Positions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Positions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserPositionCard
            deposit={userPosition.deposit}
            borrow={userPosition.borrow}
            healthFactor={userPosition.healthFactor}
            accruedInterest={userPosition.accruedInterest}
            maxBorrow={userPosition.maxBorrow}
            isConnected={isConnected}
          />
          <VaultPositionCard
            shares={vaultUserPosition.shares}
            value={vaultUserPosition.value}
            sharePrice={vaultStats.sharePrice}
            apy={vaultStats.apy}
            isConnected={isConnected}
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-8">
        <h2 className="text-xl font-semibold mb-6">Why STX DeFi?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardContent className="text-center py-6">
              <Shield className="w-12 h-12 mx-auto text-[var(--primary)] mb-4" />
              <h3 className="font-semibold mb-2">Secure & Audited</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Smart contracts built with Clarity for maximum security and predictability.
              </p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="text-center py-6">
              <Coins className="w-12 h-12 mx-auto text-[var(--success)] mb-4" />
              <h3 className="font-semibold mb-2">Competitive Rates</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                5% borrow APY and 8% vault yield - transparent and fair rates.
              </p>
            </CardContent>
          </Card>
          <Card hover>
            <CardContent className="text-center py-6">
              <Zap className="w-12 h-12 mx-auto text-[var(--warning)] mb-4" />
              <h3 className="font-semibold mb-2">Bitcoin Secured</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Built on Stacks, leveraging Bitcoin's security for your DeFi activities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
