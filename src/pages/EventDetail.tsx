import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Users,
  QrCode,
  CheckCircle2,
  Loader2,
  Award,
  ArrowRight,
  Star,
  ExternalLink,
  ScanLine,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import { useCheckIn, type CheckInStatus } from '@/hooks/useCheckIn';
import { getEventById, isCheckedIn as checkMockAttendance, truncateWallet } from '@/lib/mockData';

const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const event = eventId ? getEventById(eventId) : undefined;
  const alreadyCheckedIn = eventId ? checkMockAttendance(eventId) : false;
  const { status, txHash, error, checkIn, reset } = useCheckIn();

  // Track if we use the mock pre-checked-in state or the live check-in flow
  const [confirmedCheckIn, setConfirmedCheckIn] = useState(alreadyCheckedIn);

  useEffect(() => {
    if (status === 'success') {
      setConfirmedCheckIn(true);
    }
  }, [status]);

  if (!event) {
    return (
      <WalletGuard>
        <AppLayout title="Event Not Found" backTo="/dashboard" backLabel="Dashboard">
          <div className="text-center py-20">
            <p className="text-muted-foreground">This event does not exist.</p>
          </div>
        </AppLayout>
      </WalletGuard>
    );
  }

  return (
    <WalletGuard>
      <AppLayout backTo="/dashboard" backLabel="Dashboard">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Status badge */}
            <div className="flex items-center gap-2 mb-4">
              <StatusBadge status={event.status} />
              {confirmedCheckIn && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Checked In
                </span>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
              {event.name}
            </h1>

            <p className="text-muted-foreground leading-relaxed mb-6">
              {event.description}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <MetaItem icon={Calendar} label="Date" value={event.date} />
              <MetaItem icon={MapPin} label="Location" value={event.location} />
              <MetaItem icon={Users} label="Attendees" value={`${event.attendeesCount}/${event.maxAttendees}`} />
              <MetaItem icon={Award} label="Organizer" value={event.organizerName} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Check-in Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl bg-card border border-border p-6 sm:p-8"
          >
            <AnimatePresence mode="wait">
              {confirmedCheckIn && status !== 'success' ? (
                <PostCheckInView key="post" eventId={event.eventId} />
              ) : status === 'success' ? (
                <CheckInSuccessView key="success" eventId={event.eventId} txHash={txHash} />
              ) : (
                <CheckInFlowView
                  key="flow"
                  status={status}
                  error={error}
                  eventStatus={event.status}
                  onCheckIn={() => checkIn(event.eventId)}
                  onReset={reset}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Links - only if checked in */}
          {confirmedCheckIn && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <Link
                to={`/event/${event.eventId}/matches`}
                className="flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-[0_0_25px_hsl(187_90%_52%/0.06)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-foreground">View Matches</div>
                    <div className="text-xs text-muted-foreground">See your AI-powered suggestions</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to={`/event/${event.eventId}/reviews`}
                className="flex items-center justify-between p-5 rounded-xl bg-card border border-border hover:border-accent/20 hover:shadow-[0_0_25px_hsl(42_92%_56%/0.06)] transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-foreground">Write Reviews</div>
                    <div className="text-xs text-muted-foreground">Rate your connections</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              </Link>
            </motion.div>
          )}
        </div>
      </AppLayout>
    </WalletGuard>
  );
};

// -- Sub-components --

const MetaItem: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="p-3 rounded-lg bg-secondary/50 border border-border">
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <div className="text-sm font-semibold text-foreground truncate">{value}</div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; className: string }> = {
    live: { label: 'Live Now', className: 'bg-primary/15 text-primary border-primary/20' },
    upcoming: { label: 'Upcoming', className: 'bg-accent/15 text-accent border-accent/20' },
    past: { label: 'Completed', className: 'bg-muted text-muted-foreground border-border' },
  };
  const cfg = map[status] || map.past;
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

interface CheckInFlowViewProps {
  status: CheckInStatus;
  error: string | null;
  eventStatus: string;
  onCheckIn: () => void;
  onReset: () => void;
}

const CheckInFlowView: React.FC<CheckInFlowViewProps> = ({
  status,
  error,
  eventStatus,
  onCheckIn,
  onReset,
}) => {
  const isLive = eventStatus === 'live';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center"
    >
      {/* QR Icon */}
      <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
        {status === 'idle' && <QrCode className="w-10 h-10 text-primary" />}
        {status === 'scanning' && <ScanLine className="w-10 h-10 text-primary animate-pulse" />}
        {status === 'confirming' && <Loader2 className="w-10 h-10 text-primary animate-spin" />}
        {status === 'error' && <QrCode className="w-10 h-10 text-destructive" />}
      </div>

      <h3 className="font-display text-xl font-bold text-foreground mb-2">
        {status === 'idle' && 'Ready to Check In'}
        {status === 'scanning' && 'Scanning QR Code...'}
        {status === 'confirming' && 'Confirming on Solana...'}
        {status === 'error' && 'Check-in Failed'}
      </h3>

      <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
        {status === 'idle' && (
          isLive
            ? 'Scan the event QR code or tap below to check in. This will record your attendance on-chain.'
            : 'This event is not currently live. Check-in will be available when the event starts.'
        )}
        {status === 'scanning' && 'Reading event data from QR code...'}
        {status === 'confirming' && 'Your wallet is signing the check-in transaction. Please confirm in your wallet.'}
        {status === 'error' && (error || 'Something went wrong. Please try again.')}
      </p>

      {status === 'idle' && (
        <button
          onClick={onCheckIn}
          disabled={!isLive}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-lg font-display font-semibold text-sm transition-all duration-300 ${
            isLive
              ? 'bg-primary text-primary-foreground hover:shadow-[0_0_30px_hsl(187_90%_52%/0.3)] hover:-translate-y-0.5'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <QrCode className="w-4 h-4" />
          {isLive ? 'Check In Now' : 'Not Available Yet'}
        </button>
      )}

      {status === 'error' && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-foreground font-display font-semibold text-sm transition-all duration-300 hover:bg-secondary/80"
        >
          Try Again
        </button>
      )}

      {/* Progress indicator */}
      {(status === 'scanning' || status === 'confirming') && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <StepDot active={status === 'scanning'} completed={status === 'confirming'} label="Scan" />
          <div className="w-8 h-px bg-border" />
          <StepDot active={status === 'confirming'} completed={false} label="Confirm" />
          <div className="w-8 h-px bg-border" />
          <StepDot active={false} completed={false} label="Done" />
        </div>
      )}
    </motion.div>
  );
};

const StepDot: React.FC<{ active: boolean; completed: boolean; label: string }> = ({
  active,
  completed,
  label,
}) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`w-3 h-3 rounded-full transition-colors ${
        completed
          ? 'bg-primary'
          : active
          ? 'bg-primary animate-pulse'
          : 'bg-border'
      }`}
    />
    <span className="text-[10px] text-muted-foreground">{label}</span>
  </div>
);

interface CheckInSuccessViewProps {
  eventId: string;
  txHash: string | null;
}

const CheckInSuccessView: React.FC<CheckInSuccessViewProps> = ({ eventId, txHash }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
      <CheckCircle2 className="w-10 h-10 text-primary" />
    </div>

    <h3 className="font-display text-xl font-bold text-foreground mb-2">
      Check-in Confirmed!
    </h3>

    <p className="text-sm text-muted-foreground mb-4">
      Your attendance has been recorded on-chain. An NFT badge has been minted to your wallet.
    </p>

    {txHash && (
      <div className="inline-flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2 mb-6 font-mono">
        tx: {truncateWallet(txHash, 8)}
        <ExternalLink className="w-3 h-3" />
      </div>
    )}

    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Link
        to={`/event/${eventId}/matches`}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_30px_hsl(187_90%_52%/0.3)]"
      >
        <Users className="w-4 h-4" />
        View Your Matches
      </Link>
    </div>
  </motion.div>
);

interface PostCheckInViewProps {
  eventId: string;
}

const PostCheckInView: React.FC<PostCheckInViewProps> = ({ eventId }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center"
  >
    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
      <CheckCircle2 className="w-8 h-8 text-primary" />
    </div>

    <h3 className="font-display text-lg font-bold text-foreground mb-2">
      You are checked in
    </h3>
    <p className="text-sm text-muted-foreground mb-5">
      Your attendance is verified on-chain. Explore your matches or leave reviews.
    </p>

    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <Link
        to={`/event/${eventId}/matches`}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-display font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300"
      >
        <Users className="w-4 h-4" />
        View Matches
      </Link>
      <Link
        to={`/event/${eventId}/reviews`}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-foreground font-display font-semibold text-sm hover:bg-secondary/80 transition-all duration-300"
      >
        <Star className="w-4 h-4" />
        Write Reviews
      </Link>
    </div>
  </motion.div>
);

export default EventDetail;