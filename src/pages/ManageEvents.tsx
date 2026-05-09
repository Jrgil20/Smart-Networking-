import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Calendar, MapPin, Users, Settings, Loader2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import { useEvents } from '@/hooks/useEvents';
import { useUserProfile } from '@/hooks/useUserProfile';
import { truncateWallet } from '@/lib/mockData';

const ManageEvents: React.FC = () => {
  const { profile } = useUserProfile();
  const { events, loading } = useEvents();

  // Filter events created by current user (organizer)
  const myEvents = profile ? events.filter((e) => e.organizer === profile.wallet) : [];

  return (
    <WalletGuard>
      <AppLayout>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">Manage Events</h1>
              <p className="text-muted-foreground">Create and manage your networking events</p>
            </div>
            <Link
              to="/create-event"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all duration-300 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Create Event
            </Link>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Loading your events...</span>
            </div>
          ) : myEvents.length === 0 ? (
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
              <h2 className="font-display text-lg font-semibold text-foreground">No events yet</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                You haven't created any events yet. Start by creating your first networking event.
              </p>
              <Link
                to="/create-event"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/10 text-primary border border-primary/20 font-display font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
                Create First Event
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myEvents.map((event, index) => (
                <motion.div
                  key={event.eventId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-xl bg-card border border-border overflow-hidden hover:border-primary/40 transition-all group"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-bold text-foreground mb-1">{event.name}</h3>
                        <p className="text-xs text-muted-foreground font-mono">{event.eventId}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          event.status === 'live'
                            ? 'bg-primary/10 text-primary'
                            : event.status === 'upcoming'
                              ? 'bg-accent/10 text-accent'
                              : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {event.status === 'live' ? 'Live' : event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="text-xs text-muted-foreground">Date</span>
                          <p className="font-semibold text-foreground">{event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="text-xs text-muted-foreground">Location</span>
                          <p className="font-semibold text-foreground">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <span className="text-xs text-muted-foreground">Attendees</span>
                          <p className="font-semibold text-foreground">
                            {event.attendeesCount} / {event.maxAttendees}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Organizer</span>
                        <p className="font-semibold text-foreground font-mono text-[12px]">
                          {truncateWallet(event.organizer, 4)}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Capacity</span>
                        <span className="text-foreground font-semibold">
                          {Math.round((event.attendeesCount / event.maxAttendees) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                          style={{ width: `${Math.min((event.attendeesCount / event.maxAttendees) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t border-border p-4 flex gap-2">
                    <button className="flex-1 py-2 px-3 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2">
                      <Settings className="w-3 h-3" />
                      Edit
                    </button>
                    <button className="flex-1 py-2 px-3 rounded-lg bg-secondary text-foreground text-xs font-semibold hover:bg-secondary/80 transition-all">
                      View Attendees
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </WalletGuard>
  );
};

export default ManageEvents;
