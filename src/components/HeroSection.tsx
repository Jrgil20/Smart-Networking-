import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Users, Sparkles } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

const stats = [
  { value: '$0.004', label: 'Per Transaction' },
  { value: '< 1s', label: 'Check-in Time' },
  { value: '100%', label: 'On-chain Data' },
];

const HeroSection: React.FC = () => {
  const { connected } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-primary/5 blur-[100px] animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/6 w-64 h-64 rounded-full bg-accent/5 blur-[100px] animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">
              Built on Solana Devnet
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Networking at Events,{' '}
            <span className="text-gradient-primary">Powered by Blockchain</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect your wallet. Check in with a QR scan. Get AI-matched with the right people.
            Your reputation and attendance are immutable, portable, and truly yours.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            {connected ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-display font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_30px_hsl(187_90%_52%/0.3)] hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <WalletMultiButton />
            )}
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-secondary/60 border border-border text-foreground font-display font-semibold text-sm transition-all duration-300 hover:bg-secondary hover:border-primary/20"
            >
              <Users className="w-4 h-4" />
              Learn How It Works
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl sm:text-3xl font-bold text-gradient-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;