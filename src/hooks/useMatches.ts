import { useState, useEffect } from 'react';
import { getMatchesForEvent, type MatchSuggestion } from '@/lib/mockData';

/**
 * Hook to fetch AI match suggestions for an event.
 * Currently returns mock data; will be replaced with backend API call.
 */
export function useMatches(eventId: string | undefined) {
  const [matches, setMatches] = useState<MatchSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setMatches([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      setMatches(getMatchesForEvent(eventId));
      setLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [eventId]);

  return { matches, loading };
}