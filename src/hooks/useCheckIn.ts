import { useState, useCallback } from 'react';

export type CheckInStatus = 'idle' | 'scanning' | 'confirming' | 'success' | 'error';

/**
 * Hook to simulate the check-in flow.
 * Will be replaced with real Anchor instruction call.
 */
export function useCheckIn() {
  const [status, setStatus] = useState<CheckInStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkIn = useCallback(async (_eventId: string) => {
    setError(null);
    setTxHash(null);

    try {
      // Step 1: Scanning QR
      setStatus('scanning');
      await new Promise((r) => setTimeout(r, 800));

      // Step 2: Confirming transaction
      setStatus('confirming');
      await new Promise((r) => setTimeout(r, 1500));

      // Step 3: Success - generate mock tx hash
      const mockTx = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      setTxHash(mockTx);
      setStatus('success');
    } catch {
      setError('Transaction failed. Please try again.');
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
  }, []);

  return { status, txHash, error, checkIn, reset };
}