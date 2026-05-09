import { useState } from 'react';
import { LumaEvent } from '@/lib/lumaApi';

interface UseLumaEventsOptions {
  city?: string;
  userId?: string;
  category?: string;
}

interface UseLumaEventsResult {
  lumaEvents: LumaEvent[];
  lumaLoading: boolean;
  lumaError: string | null;
  refetchLumaEvents: () => Promise<void>;
}

/**
 * Hook to fetch Luma events
 * Currently returns empty array as Luma has no public API.
 * For now, SmartNet events are created directly on blockchain.
 * Future: Can integrate with Luma via OAuth if they expose API.
 */
export const useLumaEvents = (options?: UseLumaEventsOptions): UseLumaEventsResult => {
  const [lumaEvents, setLumaEvents] = useState<LumaEvent[]>([]);
  const [lumaLoading, setLumaLoading] = useState(false);
  const [lumaError, setLumaError] = useState<string | null>(null);

  // In  production with Luma API, uncomment the real fetching logic
  // For now, we only support linking to Luma events via URL
  
  return {
    lumaEvents: [],
    lumaLoading: false,
    lumaError: null,
    refetchLumaEvents: async () => {},
  };
};

/**
 * Mock Luma events for development
 */
function getMockLumaEvents(): LumaEvent[] {
  return [
    {
      id: 'luma_123',
      title: 'Solana Dev Networking',
      description: 'Connect with other Solana developers, share projects and discuss web3 innovations.',
      start_at: '2026-05-15T19:00:00Z',
      end_at: '2026-05-15T21:30:00Z',
      location: {
        city: 'San Francisco',
        state: 'CA',
        address: '123 Market St, SF',
        latitude: 37.7749,
        longitude: -122.4194,
      },
      organizer: {
        id: 'org_001',
        name: 'Solana SF Community',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=org001',
      },
      event_type: 'networking',
      category: 'web3',
      capacity: 150,
      attendee_count: 87,
      rsvp_count: 95,
      image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      ticket_price: 0,
      status: 'published',
      url: 'https://lu.ma/event-123',
    },
    {
      id: 'luma_124',
      title: 'Startup Founders Happy Hour',
      description: 'Casual drinks and networking for startup founders and early-stage entrepreneurs.',
      start_at: '2026-05-16T18:00:00Z',
      end_at: '2026-05-16T20:00:00Z',
      location: {
        city: 'San Francisco',
        state: 'CA',
        address: '456 Valencia St, SF',
        latitude: 37.7599,
        longitude: -122.4148,
      },
      organizer: {
        id: 'org_002',
        name: 'SF Startup Network',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=org002',
      },
      event_type: 'social',
      category: 'startups',
      capacity: 100,
      attendee_count: 52,
      rsvp_count: 68,
      image_url: 'https://images.unsplash.com/photo-1519671482677-504be0271101?w=500&h=300&fit=crop',
      ticket_price: 5,
      status: 'published',
      url: 'https://lu.ma/event-124',
    },
    {
      id: 'luma_125',
      title: 'Web3 Security Workshop',
      description: 'Learn best practices in blockchain security, smart contract auditing, and wallet protection.',
      start_at: '2026-05-17T14:00:00Z',
      end_at: '2026-05-17T17:00:00Z',
      location: {
        city: 'San Francisco',
        state: 'CA',
        address: '789 Mission St, SF',
        latitude: 37.7845,
        longitude: -122.4094,
      },
      organizer: {
        id: 'org_003',
        name: 'BlockSec Academy',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=org003',
      },
      event_type: 'workshop',
      category: 'education',
      capacity: 60,
      attendee_count: 41,
      rsvp_count: 48,
      image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
      ticket_price: 15,
      status: 'published',
      url: 'https://lu.ma/event-125',
    },
    {
      id: 'luma_126',
      title: 'AI & Crypto Innovations Panel',
      description: 'Industry leaders discuss the intersection of AI and cryptocurrency technologies.',
      start_at: '2026-05-20T19:00:00Z',
      end_at: '2026-05-20T20:30:00Z',
      location: {
        city: 'San Francisco',
        state: 'CA',
        address: '321 Spear St, SF',
        latitude: 37.7923,
        longitude: -122.3944,
      },
      organizer: {
        id: 'org_004',
        name: 'Tech Speaker Series',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=org004',
      },
      event_type: 'panel',
      category: 'web3',
      capacity: 200,
      attendee_count: 156,
      rsvp_count: 189,
      image_url: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=500&h=300&fit=crop',
      ticket_price: 0,
      status: 'published',
      url: 'https://lu.ma/event-126',
    },
  ];
}
