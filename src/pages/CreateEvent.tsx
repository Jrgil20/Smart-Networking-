import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import WalletGuard from '@/components/WalletGuard';
import { useCreateEvent } from '@/hooks/useCreateEvent';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { status, txHash, error, createEvent, reset } = useCreateEvent();

  const [formData, setFormData] = useState({
    eventId: '',
    name: '',
    date: '',
    location: '',
    maxAttendees: 50,
    description: '',
    lumaUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxAttendees' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent({
      eventId: formData.eventId,
      name: formData.name,
      maxAttendees: formData.maxAttendees,
      lumaUrl: formData.lumaUrl || undefined,
    });
  };

  const handleSuccess = () => {
    reset();
    navigate('/manage-events');
  };

  return (
    <WalletGuard>
      <AppLayout backTo="/manage-events" backLabel="Back">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Create Event</h1>
            <p className="text-muted-foreground">
              Launch a new networking event and manage attendees on-chain
            </p>
          </motion.div>

          {/* Form or Success Message */}
          {status === 'success' && txHash ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-xl bg-card border border-border p-8 text-center space-y-4"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Event Created!</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your event has been registered on the blockchain and is ready for attendees to discover and join.
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 text-xs text-muted-foreground font-mono break-all">
                TX: {txHash}
              </div>
              <button
                onClick={handleSuccess}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition-all duration-300"
              >
                Go to Manage Events
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="rounded-xl bg-card border border-border p-8 space-y-6"
            >
              {/* Event ID */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Event ID <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleChange}
                  placeholder="e.g., solana-hacker-house-2025"
                  maxLength={64}
                  required
                  disabled={status !== 'idle'}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Unique identifier for this event (max 64 characters)
                </p>
              </div>

              {/* Event Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Event Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Solana Hacker House 2025"
                  maxLength={128}
                  required
                  disabled={status !== 'idle'}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Display name visible to attendees (max 128 characters)
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Date <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={status !== 'idle'}
                    className="flex-1 rounded-lg bg-secondary border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Location <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Miami, FL"
                    required
                    disabled={status !== 'idle'}
                    className="flex-1 rounded-lg bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Max Attendees */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Max Attendees <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    min="1"
                    max="10000"
                    required
                    disabled={status !== 'idle'}
                    className="flex-1 rounded-lg bg-secondary border border-border px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your event..."
                  rows={4}
                  disabled={status !== 'idle'}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Luma URL (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Link Luma Event <span className="text-muted-foreground font-normal">(optional)</span></label>
                <input
                  type="url"
                  name="lumaUrl"
                  value={formData.lumaUrl}
                  onChange={handleChange}
                  placeholder="e.g., https://lu.ma/event-123"
                  disabled={status !== 'idle'}
                  className="w-full rounded-lg bg-secondary border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If this event is also listed on Luma, paste the link here to help attendees find it there too
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-3 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-destructive">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status !== 'idle'}
                className={`w-full py-3 rounded-lg font-display font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  status === 'idle'
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {status === 'creating' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'confirming' && <Loader2 className="w-4 h-4 animate-spin" />}
                {status === 'idle' && 'Create Event'}
                {status === 'creating' && 'Validating...'}
                {status === 'confirming' && 'Confirming on blockchain...'}
                {status === 'error' && 'Try Again'}
              </button>
            </motion.form>
          )}
        </div>
      </AppLayout>
    </WalletGuard>
  );
};

export default CreateEvent;
