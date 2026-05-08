import React from 'react';
import { MessageSquare, Star, Award, Sparkles } from 'lucide-react';
import ReputationBadge from './ReputationBadge';
import { truncateWallet, type MatchSuggestion } from '@/lib/mockData';

interface MatchCardProps {
  match: MatchSuggestion;
  index: number;
  onConnect?: (wallet: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, index, onConnect }) => {
  // Generate a deterministic avatar color from wallet
  const avatarHue = match.matchWallet.charCodeAt(0) * 7 + match.matchWallet.charCodeAt(1) * 13;

  return (
    <div className="group rounded-xl bg-card border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_0_30px_hsl(187_90%_52%/0.08)]">
      {/* Rank badge */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg text-foreground border-2 border-border"
            style={{
              background: `linear-gradient(135deg, hsl(${avatarHue % 360} 60% 40%), hsl(${(avatarHue + 60) % 360} 50% 50%))`,
            }}
          >
            {match.displayName.charAt(0)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">
              {match.displayName}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              {truncateWallet(match.matchWallet, 6)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {match.isVIP && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
              <Award className="w-3 h-3" />
              VIP
            </span>
          )}
          {match.isNewcomer && (
            <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              New
            </span>
          )}
        </div>
      </div>

      {/* Compatibility Score */}
      <div className="flex items-center gap-4 mb-5">
        <ReputationBadge score={match.compatibilityScore} size="sm" showLabel={false} />
        <div>
          <div className="text-sm font-semibold text-foreground">
            {match.compatibilityScore}% Compatible
          </div>
          <div className="text-xs text-muted-foreground">
            Match #{index + 1} &middot; Rep: {match.reputationScore}/100
          </div>
        </div>
      </div>

      {/* Shared Interests */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {match.sharedInterests.map((interest) => (
          <span
            key={interest}
            className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
              interest === match.primaryInterestMatch
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-secondary text-secondary-foreground border-border'
            }`}
          >
            {interest}
            {interest === match.primaryInterestMatch && (
              <Star className="w-2.5 h-2.5 inline ml-1" />
            )}
          </span>
        ))}
      </div>

      {/* Suggested Topic */}
      <div className="bg-secondary/50 rounded-lg p-3.5 mb-4 border border-border">
        <div className="flex items-center gap-1.5 mb-1.5">
          <MessageSquare className="w-3 h-3 text-primary" />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
            Conversation Starter
          </span>
        </div>
        <p className="text-sm text-foreground leading-relaxed italic">
          "{match.suggestedTopic}"
        </p>
      </div>

      {/* Reasoning */}
      <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
        {match.reasoning}
      </p>

      {/* Action */}
      <button
        onClick={() => onConnect?.(match.matchWallet)}
        className="w-full py-2.5 rounded-lg bg-primary/10 text-primary font-display font-semibold text-sm border border-primary/20 transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_hsl(187_90%_52%/0.2)]"
      >
        Connect
      </button>
    </div>
  );
};

export default MatchCard;