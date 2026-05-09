import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export type CreateEventStatus = 'idle' | 'creating' | 'confirming' | 'success' | 'error';

interface CreateEventParams {
  eventId: string;
  name: string;
  maxAttendees: number;
  lumaUrl?: string; // Optional: Link to Luma event
}

/**
 * Hook to create events on Solana blockchain.
 * Will call anchor program's create_event instruction.
 */
export function useCreateEvent() {
  const { connected } = useWallet();
  const [status, setStatus] = useState<CreateEventStatus>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createEvent = useCallback(async (params: CreateEventParams) => {
    if (!connected) {
      setError('Wallet not connected');
      setStatus('error');
      return;
    }

    setError(null);
    setTxHash(null);
    setStatus('creating');

    try {
      // Step 1: Validating
      await new Promise((r) => setTimeout(r, 600));

      if (params.eventId.length > 64) {
        throw new Error('Event ID must be ≤ 64 characters');
      }
      if (params.name.length > 128) {
        throw new Error('Event name must be ≤ 128 characters');
      }
      if (params.maxAttendees <= 0) {
        throw new Error('Max attendees must be > 0');
      }

      // Step 2: Confirming transaction
      setStatus('confirming');
      await new Promise((r) => setTimeout(r, 1500));

      // TODO: Replace with actual Anchor program call
      // const program = new Program(IDL, programId, provider);
      // const tx = await program.methods
      //   .createEvent(params.eventId, params.name, params.maxAttendees)
      //   .accounts({ ... })
      //   .rpc();

      // Step 3: Success - generate mock tx hash
      const mockTx = Array.from({ length: 64 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      setTxHash(mockTx);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setStatus('error');
    }
  }, [connected]);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
  }, []);

  return { status, txHash, error, createEvent, reset };
}
