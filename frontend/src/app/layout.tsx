import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Header, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: 'STX DeFi Protocol',
  description: 'Decentralized lending, borrowing, and yield generation on Stacks',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--background)] antialiased flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
