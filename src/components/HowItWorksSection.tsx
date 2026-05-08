import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, QrCode, Award, Users, Star, Sparkles } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Wallet,
    title: 'Connect Wallet',
    description: 'Link your Phantom or Solflare wallet. No signup, no app download. Your wallet is your identity.',
  },
  {
    number: '02',
    icon: QrCode,
    title: 'Scan & Check In',
    description: 'Arrive at the event, scan the QR code, sign one transaction. Attendance recorded on-chain instantly.',
  },
  {
    number: '03',
    icon: Award,
    title: 'Earn NFT Badge',
    description: 'An immutable proof-of-attendance NFT is automatically minted to your wallet. Collect them all.',
  },
  {
    number: '04',
    icon: Sparkles,
    title: 'Get AI Matches',
    description: 'Our engine analyzes interests, reputation, and diversity to suggest your top 3 connections.',
  },
  {
    number: '05',
    icon: Users,
    title: 'Meet & Connect',
    description: 'See compatibility scores and suggested conversation starters. Make meaningful connections.',
  },
  {
    number: '06',
    icon: Star,
    title: 'Review & Grow',
    description: 'Rate your connections post-event. Build your on-chain reputation for future events.',
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Subtle bg */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background pointer-events-none" />

      <div className="container relative z-10 mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block text-xs font-semibold text-accent uppercase tracking-widest mb-4"
          >
            User Flow
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            From Wallet to{' '}
            <span className="text-gradient-accent">Meaningful Connections</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Six simple steps. Every action is verifiable on Solana.
          </motion.p>
        </div>

        {/* Timeline grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="relative group"
            >
              <div className="relative rounded-xl bg-card border border-border p-6 transition-all duration-300 hover:-translate-y-1 group-hover:border-primary/20 group-hover:shadow-[0_0_25px_hsl(187_90%_52%/0.06)]">
                {/* Step number */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-3xl font-bold text-primary/15">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>

                {/* Connector line for non-last items */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-px bg-border" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;