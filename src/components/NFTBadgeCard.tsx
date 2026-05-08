import React from 'react';
import { Award, Calendar } from 'lucide-react';
import type { NFTBadge } from '@/lib/mockData';

interface NFTBadgeCardProps {
  badge: NFTBadge;
}

const NFTBadgeCard: React.FC<NFTBadgeCardProps> = ({ badge }) => {
  return (
    <div className="group rounded-xl bg-card border border-border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_0_20px_hsl(187_90%_52%/0.06)]">
      {/* Badge Visual */}
      <div
        className={`w-full aspect-square rounded-lg bg-gradient-to-br ${badge.imageColor} flex items-center justify-center mb-3 relative overflow-hidden`}
      >
        <Award className="w-10 h-10 text-foreground/80" />
        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
      </div>

      {/* Info */}
      <h4 className="font-display font-semibold text-sm text-foreground truncate mb-1">
        {badge.eventName}
      </h4>
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Calendar className="w-3 h-3" />
        {badge.eventDate}
      </div>
    </div>
  );
};

export default NFTBadgeCard;