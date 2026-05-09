/**
 * Luma API client for fetching events and attendee data
 */

const LUMA_API_URL = import.meta.env.VITE_LUMA_API_URL || 'https://api.lu.ma/v1';
const LUMA_API_KEY = import.meta.env.VITE_LUMA_API_KEY;

interface LumaEvent {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  location: {
    city: string;
    state?: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  organizer: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  event_type?: string;
  category?: string;
  capacity?: number;
  attendee_count: number;
  rsvp_count: number;
  image_url?: string;
  ticket_price?: number;
  status: string;
  url: string;
}

interface LumaAttendee {
  id: string;
  event_id: string;
  user_id: string;
  user: {
    id: string;
    name: string;
    email?: string;
    avatar_url?: string;
  };
  status: 'going' | 'maybe' | 'not_going';
  rsvp_date: string;
  checked_in: boolean;
  checked_in_at?: string;
}

const headers = {
  'Authorization': `Bearer ${LUMA_API_KEY}`,
  'Content-Type': 'application/json',
};

/**
 * Fetch events by city and optional filters
 */
export async function fetchLumaEventsByCity(
  city: string,
  options?: {
    category?: string;
    limit?: number;
    offset?: number;
  }
): Promise<LumaEvent[]> {
  try {
    const params = new URLSearchParams({
      city,
      limit: String(options?.limit || 50),
      offset: String(options?.offset || 0),
    });

    if (options?.category) {
      params.append('category', options.category);
    }

    const response = await fetch(`${LUMA_API_URL}/events?${params}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching Luma events:', error);
    return [];
  }
}

/**
 * Fetch events for a specific user
 */
export async function fetchLumaUserEvents(userId: string): Promise<LumaEvent[]> {
  try {
    const response = await fetch(`${LUMA_API_URL}/users/${userId}/events`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error fetching user Luma events:', error);
    return [];
  }
}

/**
 * Get event details with full information
 */
export async function fetchLumaEventDetails(eventId: string): Promise<LumaEvent | null> {
  try {
    const response = await fetch(`${LUMA_API_URL}/events/${eventId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.event || null;
  } catch (error) {
    console.error('Error fetching Luma event details:', error);
    return null;
  }
}

/**
 * Get attendees for an event
 */
export async function fetchLumaEventAttendees(
  eventId: string,
  status?: 'going' | 'maybe' | 'not_going'
): Promise<LumaAttendee[]> {
  try {
    const params = new URLSearchParams();
    if (status) {
      params.append('status', status);
    }

    const response = await fetch(
      `${LUMA_API_URL}/events/${eventId}/attendees?${params}`,
      {
        method: 'GET',
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.attendees || [];
  } catch (error) {
    console.error('Error fetching Luma event attendees:', error);
    return [];
  }
}

/**
 * RSVP to a Luma event
 */
export async function rsvpToLumaEvent(
  eventId: string,
  status: 'going' | 'maybe' | 'not_going',
  ticketQuantity?: number
): Promise<boolean> {
  try {
    const response = await fetch(`${LUMA_API_URL}/events/${eventId}/rsvp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        status,
        ticket_quantity: ticketQuantity || 1,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error RSVPing to Luma event:', error);
    return false;
  }
}

/**
 * Search events by keyword
 */
export async function searchLumaEvents(
  query: string,
  options?: {
    city?: string;
    limit?: number;
  }
): Promise<LumaEvent[]> {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: String(options?.limit || 50),
    });

    if (options?.city) {
      params.append('city', options.city);
    }

    const response = await fetch(`${LUMA_API_URL}/search/events?${params}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Luma API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error('Error searching Luma events:', error);
    return [];
  }
}

export type { LumaEvent, LumaAttendee };
