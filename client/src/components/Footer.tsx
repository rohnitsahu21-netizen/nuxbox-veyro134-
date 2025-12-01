import { Link } from "wouter";
import { Package, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <Package className="w-5 h-5 text-background" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg tracking-wider gradient-neon-text">
                  NuxBox
                </span>
                <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                  by Veyro
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Your ultimate destination for free Linux apps and tools. 
              Discover, download, and enhance your Linux experience with our curated collection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-neon-cyan">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/browse"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  data-testid="footer-link-browse"
                >
                  Browse Apps
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  data-testid="footer-link-feedback"
                >
                  Give Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/report"
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  data-testid="footer-link-report"
                >
                  Report Issue
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 text-neon-purple">
              Connect
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-neon-cyan/20 hover:text-neon-cyan transition-all"
                data-testid="footer-social-github"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-neon-purple/20 hover:text-neon-purple transition-all"
                data-testid="footer-social-twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-neon-pink/20 hover:text-neon-pink transition-all"
                data-testid="footer-social-email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} NuxBox by Veyro. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs">
            Made with love for the Linux community
          </p>
        </div>
      </div>
    </footer>
  );
}
