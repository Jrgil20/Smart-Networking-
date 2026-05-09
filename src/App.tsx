import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { SlopeWalletAdapter } from '@solana/wallet-adapter-slope';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import EventDetail from '@/pages/EventDetail';
import Matches from '@/pages/Matches';
import Reviews from '@/pages/Reviews';
import Profile from '@/pages/Profile';
import CreateEvent from '@/pages/CreateEvent';
import ManageEvents from '@/pages/ManageEvents';
import BrowseEvents from '@/pages/BrowseEvents';
import NotFound from '@/pages/NotFound';

const App: React.FC = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new SlopeWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/browse-events" element={<BrowseEvents />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/manage-events" element={<ManageEvents />} />
            <Route path="/event/:eventId" element={<EventDetail />} />
            <Route path="/event/:eventId/matches" element={<Matches />} />
            <Route path="/event/:eventId/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
