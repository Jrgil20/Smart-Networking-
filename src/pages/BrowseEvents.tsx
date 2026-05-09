import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Search, Loader2, QrCode } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useEvents } from '@/hooks/useEvents';
import { useUserProfile } from '@/hooks/useUserProfile';
import {
  filterEventsByStatus,
  searchUnifiedEvents,
  UnifiedEvent,
} from '@/lib/eventUnification';

const BrowseEvents: React.FC = () => {
  const { events, loading: blockchainLoading } = useEvents();
  const { profile } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'upcoming' | 'past'>('all');

  // Merge blockchain and Luma events
  const mergedEvents = useMemo(() => {
    // For now, only showing blockchain events
    // If you have Luma integration later, add: mergeEvents(events, lumaEvents, 'date')
    return events.map((e) => ({
      id: e.eventId,
      title: e.name,
      description: e.description,
      startDate: new Date(e.createdAt * 1000),
      endDate: new Date(e.createdAt * 1000 + 24 * 60 * 60 * 1000),
      location: e.location,
      city: 'Blockchain',
      capacity: e.maxAttendees,
      attendeeCount: e.attendeesCount,
      organizerName: e.organizerName || e.organizer.slice(0, 8),
      organizerId: e.organizer,
      category: 'web3',
      source: 'blockchain' as const,
      status: e.status as 'live' | 'upcoming' | 'past',
      blockchainData: e,
    } as UnifiedEvent));
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    let filtered = mergedEvents;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((e) => e.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = searchUnifiedEvents(filtered, searchQuery);
    }

    return filtered;
  }, [mergedEvents, filterStatus, searchQuery]);

  const loading = blockchainLoading;
  const liveEventsBadgeCount = mergedEvents.filter((e) => e.status === 'live').length;
  const upcomingEventsBadgeCount = mergedEvents.filter((e) => e.status === 'upcoming').length;

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">Discover Events</h1>
          <p className="text-muted-foreground">Find and explore networking events in your area</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 space-y-4"
        >
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {['all', 'live', 'upcoming', 'past'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as typeof filterStatus)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {status === 'all'
                  ? 'All'
                  : status === 'live'
                    ? `Live (${liveEventsBadgeCount})`
                    : status === 'upcoming'
                      ? `Upcoming (${upcomingEventsBadgeCount})`
                      : 'Past'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <span className="text-sm text-muted-foreground">Loading events...</span>
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl bg-card border border-border p-12 text-center space-y-4"
          >
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
            <h2 className="font-display text-lg font-semibold text-foreground">No events found</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try adjusting your search or filters to find more events.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: UnifiedEvent, index) => (
              <motion.div
                key={`${event.source}-${event.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all group h-full flex flex-col"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 border-b border-border">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-foreground text-sm line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                        event.status === 'live'
                          ? 'bg-primary/10 text-primary'
                          : event.status === 'upcoming'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {event.status === 'live' ? 'Live Now' : event.status === 'upcoming' ? 'Coming' : 'Ended'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.startDate.toLocaleDateString()} {event.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{event.location}</span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {event.attendeeCount} / {event.capacity}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-foreground">
                        {Math.round((event.attendeeCount / event.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{
                          width: `${Math.min((event.attendeeCount / event.capacity) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="border-t border-border p-4">
                  {event.status === 'live' ? (
                    <Link
                      to={`/event/${event.id}`}
                      className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <QrCode className="w-3 h-3" />
                      Check In Now
                    </Link>
                  ) : (
                    <Link
                      to={`/event/${event.id}`}
                      className="w-full py-2 px-3 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-all"
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default BrowseEvents;
