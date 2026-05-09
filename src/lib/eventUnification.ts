/**
 * Unified event types that support both blockchain and Luma events
 */

import { EventConfig } from '@/hooks/useEvents';
import { LumaEvent } from '@/lib/lumaApi';

export type UnifiedEvent = {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  city: string;
  imageUrl?: string;
  capacity: number;
  attendeeCount: number;
  organizerName: string;
  organizerId: string;
  category: string;
  source: 'blockchain' | 'luma'; // Track the source
  status: 'live' | 'upcoming' | 'past';
  sourceUrl?: string; // Link to Luma or blockchain explorer
  ticketPrice?: number;
  lumaData?: LumaEvent; // Raw Luma data if source is 'luma'
  blockchainData?: EventConfig; // Raw blockchain data if source is 'blockchain'
};

/**
 * Convert a Luma event to unified format
 */
export function convertLumaToUnified(lumaEvent: LumaEvent): UnifiedEvent {
  const now = new Date();
  const startDate = new Date(lumaEvent.start_at);
  const endDate = new Date(lumaEvent.end_at);

  let status: 'live' | 'upcoming' | 'past' = 'upcoming';
  if (now > endDate) {
    status = 'past';
  } else if (now > startDate && now < endDate) {
    status = 'live';
  }

  return {
    id: lumaEvent.id,
    title: lumaEvent.title,
    description: lumaEvent.description,
    startDate,
    endDate,
    location: lumaEvent.location.address,
    city: lumaEvent.location.city,
    imageUrl: lumaEvent.image_url,
    capacity: lumaEvent.capacity || 100,
    attendeeCount: lumaEvent.attendee_count,
    organizerName: lumaEvent.organizer.name,
    organizerId: lumaEvent.organizer.id,
    category: lumaEvent.category || 'networking',
    source: 'luma',
    status,
    sourceUrl: lumaEvent.url,
    ticketPrice: lumaEvent.ticket_price,
    lumaData: lumaEvent,
  };
}

/**
 * Convert a blockchain event config to unified format
 */
export function convertBlockchainToUnified(blockchainEvent: EventConfig): UnifiedEvent {
  const now = new Date();
  const startDate = new Date(blockchainEvent.createdAt);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Assume 24 hours

  let status: 'live' | 'upcoming' | 'past' = 'upcoming';
  if (blockchainEvent.status === 'past') {
    status = 'past';
  } else if (blockchainEvent.status === 'live') {
    status = 'live';
  }

  return {
    id: blockchainEvent.eventId,
    title: blockchainEvent.name,
    description: blockchainEvent.description || '',
    startDate,
    endDate,
    location: blockchainEvent.location || 'On-chain',
    city: 'Blockchain',
    capacity: blockchainEvent.maxAttendees,
    attendeeCount: blockchainEvent.attendeesCount,
    organizerName: blockchainEvent.organizer.slice(0, 8) + '...',
    organizerId: blockchainEvent.organizer,
    category: 'web3',
    source: 'blockchain',
    status,
    sourceUrl: `https://solscan.io/tx/${blockchainEvent.eventId}`,
    blockchainData: blockchainEvent,
  };
}

/**
 * Merge and sort blockchain and Luma events
 */
export function mergeEvents(
  blockchainEvents: EventConfig[],
  lumaEvents: LumaEvent[],
  sortBy: 'date' | 'attendees' = 'date'
): UnifiedEvent[] {
  const unifiedBlockchain = blockchainEvents.map(convertBlockchainToUnified);
  const unifiedLuma = lumaEvents.map(convertLumaToUnified);
  const merged = [...unifiedBlockchain, ...unifiedLuma];

  if (sortBy === 'date') {
    return merged.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  } else {
    return merged.sort((a, b) => b.attendeeCount - a.attendeeCount);
  }
}

/**
 * Filter unified events by status
 */
export function filterEventsByStatus(
  events: UnifiedEvent[],
  status: 'live' | 'upcoming' | 'past'
): UnifiedEvent[] {
  return events.filter((e) => e.status === status);
}

/**
 * Search unified events by title or description
 */
export function searchUnifiedEvents(
  events: UnifiedEvent[],
  query: string
): UnifiedEvent[] {
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (e) =>
      e.title.toLowerCase().includes(lowerQuery) ||
      e.description.toLowerCase().includes(lowerQuery) ||
      e.location.toLowerCase().includes(lowerQuery)
  );
}
