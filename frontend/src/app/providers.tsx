'use client';

import { ReactNode } from 'react';
import { WalletProvider } from '@/context/WalletContext';
import { ToastProvider } from '@/components/ui';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletProvider>
      <ToastProvider>{children}</ToastProvider>
    </WalletProvider>
  );
}
