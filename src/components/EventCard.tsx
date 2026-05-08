import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Users, ArrowRight, CheckCircle2, Radio } from 'lucide-react';
import type { EventConfig } from '@/lib/mockData';

interface EventCardProps {
  event: EventConfig;
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

const EventCard: React.FC<EventCardProps> = ({ event, isCheckedIn = false }) => {
  const config = statusConfig[event.status];
  const StatusIcon = config.icon;

  return (
    <Link
      to={`/event/${event.eventId}`}
      className="group block rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_0_25px_hsl(187_90%_52%/0.06)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
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
      <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
        {event.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {event.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {event.date}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {event.location}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          {event.attendeesCount}/{event.maxAttendees}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {event.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default EventCard;