import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const CTASection: React.FC = () => {
  const { connected } = useWallet();

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-8 animate-glow-pulse">
            <Zap className="w-7 h-7 text-primary" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Ready to Network{' '}
            <span className="text-gradient-primary">Smarter</span>?
          </h2>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Join the next generation of event networking. Connect your wallet and start building
            your on-chain reputation today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {connected ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_30px_hsl(187_90%_52%/0.3)] hover:-translate-y-0.5"
              >
                Open Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <WalletMultiButton />
            )}
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              Solana Devnet
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              Open Source
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              No Fees
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;