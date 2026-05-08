import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Loader2, ArrowRight, Star } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import MatchCard from '@/components/MatchCard';
import { useMatches } from '@/hooks/useMatches';
import { getEventById } from '@/lib/mockData';

const Matches: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : undefined;
  const { matches, loading } = useMatches(eventId);

  const handleConnect = (wallet: string) => {
    // Future: open chat/contact modal
    console.log('Connecting with:', wallet);
  };

  return (
    <WalletGuard>
      <AppLayout
        backTo={eventId ? `/event/${eventId}` : '/dashboard'}
        backLabel={event?.name || 'Event'}
      >
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Your Matches
                </h1>
                {event && (
                  <p className="text-sm text-muted-foreground">{event.name}</p>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              Our AI engine analyzed interests, reputation scores, and diversity factors to suggest your top connections.
              Each match includes a conversation starter to break the ice.
            </p>
          </motion.div>

          {/* Scoring explanation */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-lg bg-secondary/50 border border-border p-4"
          >
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
              How Scoring Works
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-primary">Interests</span> -- Shared topics weighted by Jaccard similarity
              </div>
              <div>
                <span className="font-semibold text-accent">Reputation</span> -- Similar scores indicate compatible experience
              </div>
              <div>
                <span className="font-semibold text-foreground">Diversity</span> -- Bonus for new connections and cross-domain matches
              </div>
              <div>
                <span className="font-semibold text-foreground">Serendipity</span> -- Random factor for fresh perspectives
              </div>
            </div>
          </motion.div>

          {/* Match Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Finding your best matches...</span>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-20">
              <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No Matches Yet
              </h3>
              <p className="text-sm text-muted-foreground">
                Matches will appear once more attendees check in to this event.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {matches.map((match, index) => (
                <motion.div
                  key={match.matchWallet}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 + index * 0.1 }}
                >
                  <MatchCard match={match} index={index} onConnect={handleConnect} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Post-event actions */}
          {matches.length > 0 && eventId && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex items-center justify-center"
            >
              <Link
                to={`/event/${eventId}/reviews`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent/10 text-accent border border-accent/20 font-display font-semibold text-sm hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                <Star className="w-4 h-4" />
                Leave Reviews After Connecting
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </AppLayout>
    </WalletGuard>
  );
};

export default Matches;