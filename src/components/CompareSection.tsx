import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';

interface CompareRow {
  feature: string;
  brella: 'yes' | 'no' | 'partial';
  swapcard: 'yes' | 'no' | 'partial';
  poap: 'yes' | 'no' | 'partial';
  smartNet: 'yes' | 'no' | 'partial';
}

const rows: CompareRow[] = [
  { feature: 'No app download required', brella: 'no', swapcard: 'no', poap: 'yes', smartNet: 'yes' },
  { feature: 'Cost per transaction', brella: 'no', swapcard: 'no', poap: 'partial', smartNet: 'yes' },
  { feature: 'On-chain attendance proof', brella: 'no', swapcard: 'no', poap: 'yes', smartNet: 'yes' },
  { feature: 'AI-powered matchmaking', brella: 'partial', swapcard: 'partial', poap: 'no', smartNet: 'yes' },
  { feature: 'Portable reputation score', brella: 'no', swapcard: 'no', poap: 'no', smartNet: 'yes' },
  { feature: 'User owns their data', brella: 'no', swapcard: 'no', poap: 'partial', smartNet: 'yes' },
  { feature: 'Native token incentives', brella: 'no', swapcard: 'no', poap: 'no', smartNet: 'yes' },
  { feature: 'Anti-ghosting mechanism', brella: 'no', swapcard: 'no', poap: 'no', smartNet: 'yes' },
];

const StatusIcon: React.FC<{ status: 'yes' | 'no' | 'partial' }> = ({ status }) => {
  if (status === 'yes') {
    return (
      <div className="w-6 h-6 rounded-full bg-primary/15 flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-primary" />
      </div>
    );
  }
  if (status === 'partial') {
    return (
      <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
        <Minus className="w-3.5 h-3.5 text-accent" />
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
      <X className="w-3.5 h-3.5 text-destructive" />
    </div>
  );
};

const CompareSection: React.FC = () => {
  return (
    <section id="compare" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      <div className="container relative z-10 mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-4"
          >
            Why Smart Networking
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            The Web3{' '}
            <span className="text-gradient-primary">Advantage</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            See how blockchain-first design beats traditional event networking platforms.
          </motion.p>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-0 border-b border-border">
            <div className="p-4 sm:p-5 text-sm font-medium text-muted-foreground">
              Feature
            </div>
            <div className="p-4 sm:p-5 text-center text-sm font-medium text-muted-foreground border-l border-border">
              Brella
            </div>
            <div className="p-4 sm:p-5 text-center text-sm font-medium text-muted-foreground border-l border-border">
              Swapcard
            </div>
            <div className="p-4 sm:p-5 text-center text-sm font-medium text-muted-foreground border-l border-border">
              POAP
            </div>
            <div className="p-4 sm:p-5 text-center border-l border-primary/20 bg-primary/5">
              <span className="text-sm font-semibold text-primary">SmartNet</span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, index) => (
            <div
              key={row.feature}
              className={`grid grid-cols-5 gap-0 ${
                index < rows.length - 1 ? 'border-b border-border' : ''
              } hover:bg-secondary/30 transition-colors`}
            >
              <div className="p-4 sm:p-5 text-sm text-foreground flex items-center">
                {row.feature}
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center border-l border-border">
                <StatusIcon status={row.brella} />
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center border-l border-border">
                <StatusIcon status={row.swapcard} />
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center border-l border-border">
                <StatusIcon status={row.poap} />
              </div>
              <div className="p-4 sm:p-5 flex items-center justify-center border-l border-primary/20 bg-primary/[0.03]">
                <StatusIcon status={row.smartNet} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Comparison based on publicly available feature sets as of 2025. Costs reflect per-transaction pricing on Solana Devnet.
        </motion.p>
      </div>
    </section>
  );
};

export default CompareSection;