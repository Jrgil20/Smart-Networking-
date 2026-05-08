import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { mockUserProfile, type UserProfile } from '@/lib/mockData';

/**
 * Hook to fetch user profile data.
 * Currently returns mock data; will be replaced with on-chain PDA fetch.
 */
export function useUserProfile() {
  const { publicKey, connected } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !publicKey) {
      setProfile(null);
      setLoading(false);
      return;
    }

    // Simulate async PDA fetch
    setLoading(true);
    const timer = setTimeout(() => {
      setProfile({
        ...mockUserProfile,
        wallet: publicKey.toBase58(),
      });
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [connected, publicKey]);

  return { profile, loading, connected };
}