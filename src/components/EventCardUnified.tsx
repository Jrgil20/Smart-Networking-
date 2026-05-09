import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, CheckCircle2, Radio, ExternalLink } from 'lucide-react';
import type { UnifiedEvent } from '@/lib/eventUnification';

interface EventCardUnifiedProps {
  event: UnifiedEvent;
  isCheckedIn?: boolean;
}

const statusConfig = {
  live: {
    badge: 'Live Now',
    badgeClass: 'bg-primary/15 text-primary border-primary/20',
    icon: Radio,
  },
  upcoming: {
    badge: 'Upcoming',
    badgeClass: 'bg-accent/15 text-accent border-accent/20',
    icon: Calendar,
  },
  past: {
    badge: 'Completed',
    badgeClass: 'bg-muted text-muted-foreground border-border',
    icon: CheckCircle2,
  },
};

const EventCardUnified: React.FC<EventCardUnifiedProps> = ({ event, isCheckedIn = false }) => {
  const config = statusConfig[event.status];
  const StatusIcon = config.icon;
  const isLumaEvent = event.source === 'luma';

  if (isLumaEvent && event.sourceUrl) {
    return (
      <a
        href={event.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400/20 hover:shadow-[0_0_25px_hsl(217_91%_60%/0.06)]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Luma Event
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${config.badgeClass}`}>
              <StatusIcon className="w-3 h-3" />
              {config.badge}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {event.startDate.toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {event.attendeeCount}/{event.capacity}
          </span>
        </div>

        {/* Category */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
              event.category === 'web3'
                ? 'bg-purple-100 text-purple-700'
                : event.category === 'networking'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {event.category}
          </span>
          {event.ticketPrice && event.ticketPrice > 0 && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              ${event.ticketPrice}
            </span>
          )}
        </div>
      </a>
    );
  }

  return (
    <Link
      to={`/event/${event.id}`}
      className="group block rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_0_25px_hsl(187_90%_52%/0.06)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            SmartNet
          </span>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${config.badgeClass}`}>
            <StatusIcon className="w-3 h-3" />
            {config.badge}
          </span>
          {isCheckedIn && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
              <CheckCircle2 className="w-3 h-3" />
              Checked In
            </span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {event.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{event.description}</p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {event.startDate.toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {event.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {event.attendeeCount}/{event.capacity}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
          {event.category}
        </span>
        {event.blockchainData?.tags && event.blockchainData.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {tag}
          </span>
        ))}
      </div>

      {/* Show Luma link if available */}
      {event.blockchainData?.lumaUrl && (
        <div className="mt-3 pt-3 border-t border-border">
          <a
            href={event.blockchainData.lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:text-blue-700"
          >
            <ExternalLink className="w-3 h-3" />
            Also on Luma
          </a>
        </div>
      )}
    </Link>
  );
};

export default EventCardUnified;
