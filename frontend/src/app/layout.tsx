import type { Metadata } from 'next';
import './globals.css';

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
      <body className="min-h-screen bg-[var(--background)] antialiased">
        {children}
      </body>
    </html>
  );
}
