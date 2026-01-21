export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold gradient-text">
            STX DeFi Protocol
          </h1>
          <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Decentralized lending, borrowing, and yield generation built on Stacks
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <a
              href="/lend"
              className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Start Lending
            </a>
            <a
              href="/vault"
              className="px-6 py-3 bg-[var(--secondary)] text-white rounded-lg font-medium border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
            >
              Explore Vault
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
