import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Loader2, Send, MessageSquare } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import StarRating from '@/components/StarRating';
import { useReviews } from '@/hooks/useReviews';
import { getEventById, getReviewableForEvent, truncateWallet } from '@/lib/mockData';

const Reviews: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : undefined;
  const reviewableUsers = eventId ? getReviewableForEvent(eventId) : [];
  const { submitReview, submitting, isReviewed } = useReviews();

  return (
    <WalletGuard>
      <AppLayout
        backTo={eventId ? `/event/${eventId}` : '/dashboard'}
        backLabel={event?.name || 'Event'}
      >
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Post-Event Reviews
                </h1>
                {event && (
                  <p className="text-sm text-muted-foreground">{event.name}</p>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
              Rate your connections from this event. Reviews of 4+ stars boost their on-chain reputation score.
              Each review is recorded as an immutable on-chain record.
            </p>
          </motion.div>

          {/* Review Cards */}
          {reviewableUsers.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No Connections to Review
              </h3>
              <p className="text-sm text-muted-foreground">
                You need to connect with people at this event before leaving reviews.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviewableUsers.map((user, index) => (
                <motion.div
                  key={user.wallet}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
                >
                  <ReviewCard
                    wallet={user.wallet}
                    displayName={user.displayName}
                    interests={user.interests}
                    eventId={eventId || ''}
                    isReviewed={isReviewed(user.wallet)}
                    submitting={submitting}
                    onSubmit={submitReview}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </AppLayout>
    </WalletGuard>
  );
};

// -- ReviewCard --

interface ReviewCardProps {
  wallet: string;
  displayName: string;
  interests: string[];
  eventId: string;
  isReviewed: boolean;
  submitting: boolean;
  onSubmit: (review: { reviewedUser: string; eventId: string; rating: number; comment?: string }) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  wallet,
  displayName,
  interests,
  eventId,
  isReviewed,
  submitting,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const avatarHue = wallet.charCodeAt(0) * 7 + wallet.charCodeAt(1) * 13;

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({
      reviewedUser: wallet,
      eventId,
      rating,
      comment: comment.trim() || undefined,
    });
  };

  if (isReviewed) {
    return (
      <div className="rounded-xl bg-card border border-primary/20 p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <div className="font-display font-semibold text-sm text-foreground">
            {displayName}
          </div>
          <div className="text-xs text-primary">
            Review submitted on-chain
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
      {/* User info */}
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-foreground border-2 border-border"
          style={{
            background: `linear-gradient(135deg, hsl(${avatarHue % 360} 60% 40%), hsl(${(avatarHue + 60) % 360} 50% 50%))`,
          }}
        >
          {displayName.charAt(0)}
        </div>
        <div>
          <div className="font-display font-semibold text-foreground">{displayName}</div>
          <div className="text-xs text-muted-foreground font-mono">{truncateWallet(wallet, 6)}</div>
        </div>
      </div>

      {/* Interests */}
      <div className="flex flex-wrap gap-1.5">
        {interests.map((interest) => (
          <span
            key={interest}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
          >
            {interest}
          </span>
        ))}
      </div>

      {/* Star rating */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          Rating
        </label>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
          Comment (optional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was your connection?"
          rows={2}
          className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all resize-none"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg font-display font-semibold text-sm transition-all duration-300 ${
          rating === 0
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting on-chain...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Review ({rating}/5)
          </>
        )}
      </button>

      {rating >= 4 && (
        <p className="text-xs text-primary text-center">
          This rating will boost {displayName}'s reputation score by +2
        </p>
      )}
    </div>
  );
};

export default Reviews;