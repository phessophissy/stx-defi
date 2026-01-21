import Link from 'next/link';
import { Github, Twitter, FileText } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg gradient-text">STX DeFi Protocol</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Decentralized lending, borrowing, and yield generation built on Stacks.
            </p>
          </div>

          {/* Protocol */}
          <div className="space-y-4">
            <h4 className="font-semibold">Protocol</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <Link href="/lend" className="hover:text-[var(--foreground)] transition-colors">
                  Lend & Borrow
                </Link>
              </li>
              <li>
                <Link href="/vault" className="hover:text-[var(--foreground)] transition-colors">
                  Yield Vault
                </Link>
              </li>
              <li>
                <Link href="/liquidate" className="hover:text-[var(--foreground)] transition-colors">
                  Liquidations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>
                <a
                  href="https://docs.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://explorer.stacks.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  Block Explorer
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-[var(--foreground)] transition-colors"
                >
                  Audit Report
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="font-semibold">Community</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com/phessophissy/stx-defi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                <FileText className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
          <p>© 2024 STX DeFi Protocol. Built on Stacks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
