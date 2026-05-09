import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  getAttendancesForWallet,
  mockEvents,
  mockAttendances,
  type EventConfig,
  type Attendance,
} from '@/lib/mockData';

/**
 * Hook to fetch events and attendance state.
 * Returns mock data when disconnected, and wallet-specific attendance when connected.
 */
export function useEvents() {
  const { connected, publicKey } = useWallet();
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  useEffect(() => {
    setLoading(true);
    const wallet = publicKey?.toBase58();
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setAttendances(
        connected && wallet ? getAttendancesForWallet(wallet) : mockAttendances,
      );
      setIsDemoMode(!connected);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [connected, publicKey]);

  const liveEvents = events.filter((e) => e.status === 'live');
  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const pastEvents = events.filter((e) =>
    connected
      ? attendances.some((a) => a.eventId === e.eventId && a.checkedIn)
      : e.status === 'past',
  );

  function isCheckedIn(eventId: string): boolean {
    return attendances.some((a) => a.eventId === eventId && a.checkedIn);
  }

  return {
    events,
    liveEvents,
    upcomingEvents,
    pastEvents,
    attendances,
    isCheckedIn,
    isDemoMode,
    loading,
  };
}