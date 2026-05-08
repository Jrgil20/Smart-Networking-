import { useState, useEffect } from 'react';
import { mockEvents, mockAttendances, type EventConfig, type Attendance } from '@/lib/mockData';

/**
 * Hook to fetch events and attendance state.
 * Currently returns mock data; will be replaced with on-chain fetch.
 */
export function useEvents() {
  const [events, setEvents] = useState<EventConfig[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setAttendances(mockAttendances);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const liveEvents = events.filter((e) => e.status === 'live');
  const upcomingEvents = events.filter((e) => e.status === 'upcoming');
  const pastEvents = events.filter((e) => e.status === 'past');

  function isCheckedIn(eventId: string): boolean {
    return attendances.some((a) => a.eventId === eventId && a.checkedIn);
  }

  return { events, liveEvents, upcomingEvents, pastEvents, attendances, isCheckedIn, loading };
}