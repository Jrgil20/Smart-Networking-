import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { createProfileForWallet, mockUserProfile, type UserProfile } from '@/lib/mockData';

/**
 * Hook to fetch user profile data.
 * Returns mock data when disconnected, and wallet-specific data when connected.
 */
export function useUserProfile() {
  const { publicKey, connected } = useWallet();
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !publicKey) {
      setProfile(mockUserProfile);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setProfile(createProfileForWallet(publicKey.toBase58()));
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [connected, publicKey]);

  return { profile, loading, connected, isDemoMode: !connected };
}