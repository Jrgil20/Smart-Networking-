import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Zap,
  LayoutDashboard,
  User,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { truncateWallet } from '@/lib/mockData';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  backTo?: string;
  backLabel?: string;
}

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Profile', icon: User },
];

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, backTo, backLabel }) => {
  const { publicKey } = useWallet();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 p-5 fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            Smart<span className="text-gradient-primary">Net</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="w-4.5 h-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet info */}
        <div className="pt-4 border-t border-border">
          {publicKey && (
            <div className="text-xs text-muted-foreground font-mono mb-3 truncate">
              {truncateWallet(publicKey.toBase58(), 6)}
            </div>
          )}
          <WalletMultiButton />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-foreground"
            >
              {sidebarOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="font-display font-bold text-foreground">
                Smart<span className="text-gradient-primary">Net</span>
              </span>
            </Link>
          </div>
          <WalletMultiButton />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-5 pt-20">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    <item.icon className="w-4.5 h-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">
          {/* Page header */}
          {(title || backTo) && (
            <div className="border-b border-border px-6 py-4 flex items-center gap-4">
              {backTo && (
                <Link
                  to={backTo}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {backLabel || 'Back'}
                </Link>
              )}
              {title && (
                <h1 className="font-display text-xl font-bold text-foreground">
                  {title}
                </h1>
              )}
            </div>
          )}

          <div className="p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;