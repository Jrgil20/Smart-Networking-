import React from 'react';
import { Zap } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border py-12">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground">
              Smart<span className="text-gradient-primary">Net</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#compare"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Compare
            </a>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Built on Solana</span>
            <span className="w-px h-3 bg-border" />
            <span>Devnet</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            Smart Networking &mdash; Blockchain-first event matchmaking. All attendance and reputation data is stored immutably on Solana.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;