import React from 'react';
import { motion } from 'framer-motion';
import {
  Fingerprint,
  QrCode,
  Star,
  Brain,
  Coins,
  Lock,
} from 'lucide-react';

const features = [
  {
    icon: Fingerprint,
    title: 'Portable Identity',
    description:
      'Connect your Solana wallet — no app download, no signup forms. Your wallet IS your identity across every event.',
    accent: 'primary' as const,
  },
  {
    icon: QrCode,
    title: 'Instant Check-in',
    description:
      'Scan a QR code, sign one transaction, done. Proof of attendance is recorded on-chain in under a second.',
    accent: 'primary' as const,
  },
  {
    icon: Star,
    title: 'On-chain Reputation',
    description:
      'Your attendance history and peer reviews build a verifiable reputation score that travels with you.',
    accent: 'accent' as const,
  },
  {
    icon: Brain,
    title: 'AI Matchmaking',
    description:
      'Our matching engine analyzes interests, reputation, and diversity to suggest your top 3 connections at every event.',
    accent: 'primary' as const,
  },
  {
    icon: Coins,
    title: 'Native Economy',
    description:
      'SOL/USDC incentives reward genuine engagement. Stake to filter ghosting. Earn by being a great connector.',
    accent: 'accent' as const,
  },
  {
    icon: Lock,
    title: 'Web3 Privacy',
    description:
      'You control your data. Personal info is encrypted off-chain, with only verifiable links stored on Solana.',
    accent: 'primary' as const,
  },
];

const accentClasses = {
  primary: {
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    border: 'group-hover:border-primary/25',
    glow: 'group-hover:shadow-[0_0_30px_hsl(187_90%_52%/0.08)]',
  },
  accent: {
    iconBg: 'bg-accent/10',
    iconText: 'text-accent',
    border: 'group-hover:border-accent/25',
    glow: 'group-hover:shadow-[0_0_30px_hsl(42_92%_56%/0.08)]',
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      <div className="container relative z-10 mx-auto">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-4"
          >
            Core Capabilities
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            Everything You Need for{' '}
            <span className="text-gradient-primary">Smart Events</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Blockchain-first features that make networking trustworthy, efficient, and rewarding.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((feature) => {
            const ac = accentClasses[feature.accent];
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group relative rounded-xl bg-card border border-border p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 ${ac.border} ${ac.glow}`}
              >
                <div className={`w-11 h-11 rounded-lg ${ac.iconBg} flex items-center justify-center mb-5`}>
                  <feature.icon className={`w-5 h-5 ${ac.iconText}`} />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;