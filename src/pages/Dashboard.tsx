import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2, Users, Star, Award, TrendingUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import ReputationBadge from '@/components/ReputationBadge';
import EventCard from '@/components/EventCard';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useEvents } from '@/hooks/useEvents';
import { truncateWallet, mockUserProfile, mockEvents, mockAttendances } from '@/lib/mockData';

const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'demo' | 'real'>('real');
  const { profile: realProfile, loading: profileLoading, connected } = useUserProfile();
  const { liveEvents: realLiveEvents, upcomingEvents: realUpcomingEvents, pastEvents: realPastEvents, isCheckedIn: realIsCheckedIn, loading: eventsLoading } = useEvents();

  // Use demo data or real data based on viewMode
  const isViewingDemo = viewMode === 'demo';
  const profile = isViewingDemo ? mockUserProfile : realProfile;
  
  const liveEvents = isViewingDemo 
    ? mockEvents.filter((e) => e.status === 'live') 
    : realLiveEvents;
    
  const upcomingEvents = isViewingDemo 
    ? mockEvents.filter((e) => e.status === 'upcoming') 
    : realUpcomingEvents;
    
  const pastEvents = isViewingDemo 
    ? mockEvents.filter((e) => e.status === 'past') 
    : realPastEvents;
    
  const isCheckedIn = isViewingDemo 
    ? ((id: string) => mockAttendances.some((a) => a.eventId === id && a.checkedIn)) 
    : realIsCheckedIn;

  const loading = profileLoading || eventsLoading;
  const isDemoMode = isViewingDemo;

  return (
      <AppLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* Welcome + Profile Summary */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col md:flex-row md:items-center gap-6"
              >
                <div className="flex items-center gap-2 mb-3 md:mb-0">
                  {connected && (
                    <button
                      onClick={() => setViewMode(viewMode === 'demo' ? 'real' : 'demo')}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all cursor-pointer hover:scale-105 ${
                        isDemoMode
                          ? 'bg-secondary/15 text-secondary hover:bg-secondary/25'
                          : 'bg-primary/10 text-primary hover:bg-primary/20'
                      }`}
                      title={`Switch to ${isDemoMode ? 'real' : 'demo'} mode`}
                    >
                      {isDemoMode ? (
                        <>
                          <Eye className="w-3 h-3" />
                          Demo mode: sample data
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          Live mode: connected wallet
                        </>
                      )}
                    </button>
                  )}
                  {!connected && (
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        isDemoMode
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      Demo mode: sample data
                    </span>
                  )}
                </div>
                {/* Greeting */}
                <div className="flex-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1">
                    Welcome back
                  </h1>
                  {profile && (
                    <p className="text-sm text-muted-foreground font-mono">
                      {truncateWallet(profile.wallet, 8)}
                    </p>
                  )}
                </div>

                {/* Reputation Card */}
                {profile && (
                  <div className="flex items-center gap-6 p-5 rounded-xl bg-card border border-border">
                    <ReputationBadge score={profile.reputationScore} size="md" />
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                      <StatMini icon={CheckCircle2} value={profile.totalCheckIns} label="Check-ins" />
                      <StatMini icon={Users} value={profile.totalMatches} label="Matches" />
                      <StatMini icon={Star} value={profile.totalReviewsReceived} label="Reviews" />
                      <StatMini icon={Award} value={profile.badgesCount} label="Badges" />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Interests */}
              {profile && profile.interests.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Your Interests</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Live Events */}
              {liveEvents.length > 0 && (
                <EventSection
                  title="Live Now"
                  subtitle="Events happening right now"
                  events={liveEvents}
                  isCheckedIn={isCheckedIn}
                  delay={0.1}
                />
              )}

              {/* Upcoming Events */}
              {upcomingEvents.length > 0 && (
                <EventSection
                  title="Upcoming Events"
                  subtitle="Register and prepare your networking"
                  events={upcomingEvents}
                  isCheckedIn={isCheckedIn}
                  delay={0.15}
                />
              )}

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <EventSection
                  title="Past Events"
                  subtitle="Events you have attended"
                  events={pastEvents}
                  isCheckedIn={isCheckedIn}
                  delay={0.2}
                />
              )}

              {/* Empty state when connected but no events */}
              {!isDemoMode && liveEvents.length === 0 && upcomingEvents.length === 0 && pastEvents.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="rounded-xl bg-card border border-border p-12 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Award className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">No events yet</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                    You haven't attended any events yet. Check back soon for upcoming events in your area.
                  </p>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 font-display font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  >
                    Explore Events
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </AppLayout>
  );
};

// -- Sub-components --

interface StatMiniProps {
  icon: React.ElementType;
  value: number;
  label: string;
}

const StatMini: React.FC<StatMiniProps> = ({ icon: Icon, value, label }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
    <span className="text-sm font-semibold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

interface EventSectionProps {
  title: string;
  subtitle: string;
  events: import('@/lib/mockData').EventConfig[];
  isCheckedIn: (id: string) => boolean;
  delay: number;
}

const EventSection: React.FC<EventSectionProps> = ({
  title,
  subtitle,
  events,
  isCheckedIn,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <div className="mb-4">
      <h2 className="font-display text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {events.map((event) => (
        <EventCard
          key={event.eventId}
          event={event}
          isCheckedIn={isCheckedIn(event.eventId)}
        />
      ))}
    </div>
  </motion.div>
);

const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="h-8 w-48 bg-secondary rounded-lg mb-2" />
        <div className="h-4 w-32 bg-secondary rounded-lg" />
      </div>
      <div className="h-28 w-80 bg-secondary rounded-xl" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-52 bg-secondary rounded-xl" />
      ))}
    </div>
  </div>
);

export default Dashboard;