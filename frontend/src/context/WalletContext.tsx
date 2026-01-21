'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect, disconnect } from '@stacks/connect';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnectWallet: () => void;
  userSession: UserSession | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(['store_write', 'publish_data']);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userSession] = useState(() => new UserSession({ appConfig }));
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Check for existing session on mount
  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.mainnet);
      setIsConnected(true);
    }
  }, [userSession]);

  const connect = useCallback(() => {
    showConnect({
      appDetails: {
        name: 'STX DeFi Protocol',
        icon: window.location.origin + '/logo.png',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.mainnet);
        setIsConnected(true);
      },
      userSession,
    });
  }, [userSession]);

  const disconnectWallet = useCallback(() => {
    disconnect();
    userSession.signUserOut();
    setAddress(null);
    setIsConnected(false);
  }, [userSession]);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        connect,
        disconnectWallet,
        userSession,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
