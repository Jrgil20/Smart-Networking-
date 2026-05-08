import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Zap, Menu, X, LayoutDashboard, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { connected } = useWallet();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const publicLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Compare', href: '#compare' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 group-hover:glow-primary transition-all duration-300">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground tracking-tight">
            Smart<span className="text-gradient-primary">Net</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {publicLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}

          {/* App links when connected */}
          {connected && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                <User className="w-3.5 h-3.5" />
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Wallet + Status */}
        <div className="hidden md:flex items-center gap-3">
          {connected && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
              Devnet
            </span>
          )}
          <WalletMultiButton />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-secondary text-foreground"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-border overflow-hidden"
          >
            <div className="container mx-auto py-4 flex flex-col gap-4">
              {publicLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
              {connected && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 text-sm font-medium text-primary py-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    Profile
                  </Link>
                </>
              )}
              <div className="flex items-center gap-3 pt-2">
                {connected && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
                    Devnet
                  </span>
                )}
                <WalletMultiButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
