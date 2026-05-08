import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Users,
  Star,
  Award,
  Calendar,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import ReputationBadge from '@/components/ReputationBadge';
import NFTBadgeCard from '@/components/NFTBadgeCard';
import StarRating from '@/components/StarRating';
import { useUserProfile } from '@/hooks/useUserProfile';
import { mockBadges, mockReviewsReceived, truncateWallet } from '@/lib/mockData';

const Profile: React.FC = () => {
  const { profile, loading } = useUserProfile();

  const avgRating =
    mockReviewsReceived.length > 0
      ? mockReviewsReceived.reduce((sum, r) => sum + r.rating, 0) / mockReviewsReceived.length
      : 0;

  return (
    <WalletGuard>
      <AppLayout title="Your Profile">
        <div className="max-w-4xl mx-auto space-y-8">
          {loading || !profile ? (
            <div className="flex items-center justify-center py-20 gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <span className="text-sm text-muted-foreground">Loading profile...</span>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col sm:flex-row items-center gap-8 p-6 sm:p-8 rounded-xl bg-card border border-border"
              >
                {/* Reputation */}
                <ReputationBadge score={profile.reputationScore} size="lg" />

                {/* Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                    Your On-chain Profile
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono mb-4">
                    {truncateWallet(profile.wallet, 8)}
                  </p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <StatCard icon={CheckCircle2} value={profile.totalCheckIns} label="Check-ins" color="primary" />
                    <StatCard icon={Users} value={profile.totalMatches} label="Matches" color="primary" />
                    <StatCard icon={Star} value={profile.totalReviewsReceived} label="Reviews Received" color="accent" />
                    <StatCard icon={Award} value={profile.badgesCount} label="NFT Badges" color="accent" />
                  </div>
                </div>
              </motion.div>

              {/* Interests */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <h3 className="font-display text-lg font-bold text-foreground mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* NFT Badges Collection */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-lg font-bold text-foreground">
                    NFT Badge Collection
                  </h3>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({mockBadges.length} badges)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mockBadges.map((badge) => (
                    <NFTBadgeCard key={badge.eventId} badge={badge} />
                  ))}
                </div>
              </motion.div>

              {/* Reviews Received */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Reviews Received
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={Math.round(avgRating)} readonly size="sm" />
                    <span className="text-sm font-semibold text-foreground">
                      {avgRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({mockReviewsReceived.length} reviews)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {mockReviewsReceived.map((review, index) => {
                    const avatarHue = review.reviewer.charCodeAt(0) * 7 + review.reviewer.charCodeAt(1) * 13;
                    return (
                      <div
                        key={`${review.reviewer}-${review.eventId}`}
                        className="rounded-xl bg-card border border-border p-4 flex items-start gap-4"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm text-foreground border border-border flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, hsl(${avatarHue % 360} 60% 40%), hsl(${(avatarHue + 60) % 360} 50% 50%))`,
                          }}
                        >
                          {review.reviewedDisplayName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-display font-semibold text-sm text-foreground">
                              {review.reviewedDisplayName}
                            </span>
                            <StarRating value={review.rating} readonly size="sm" />
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              "{review.comment}"
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {new Date(review.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </AppLayout>
    </WalletGuard>
  );
};

// -- Sub-components --

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  color: 'primary' | 'accent';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, color }) => (
  <div className="p-3 rounded-lg bg-secondary/50 border border-border text-center">
    <Icon className={`w-4 h-4 mx-auto mb-1.5 ${color === 'primary' ? 'text-primary' : 'text-accent'}`} />
    <div className="font-display text-lg font-bold text-foreground">{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

export default Profile;