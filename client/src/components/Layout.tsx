import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, Home, HeartHandshake, Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-primary">Relate</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {user && (
              <>
                <Link href="/dashboard" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/dashboard") ? "text-primary" : "text-muted-foreground"}`}>
                  Dashboard
                </Link>
                <Link href="/reaction-helper" className={`text-sm font-medium transition-colors hover:text-primary ${isActive("/reaction-helper") ? "text-primary" : "text-muted-foreground"}`}>
                  AI Helper
                </Link>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Hi, {user.firstName || 'User'}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => logout()} className="text-muted-foreground hover:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </>
            )}
            {!user && (
              <Button asChild variant="default" className="btn-primary">
                <a href="/api/login">Sign In</a>
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-muted-foreground">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-border bg-background"
          >
            <div className="space-y-1 p-4">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/dashboard") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                    Dashboard
                  </Link>
                  <Link href="/reaction-helper" onClick={() => setIsMobileMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/reaction-helper") ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                    AI Reaction Helper
                  </Link>
                  <button onClick={() => logout()} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10">
                    Sign Out
                  </button>
                </>
              ) : (
                <a href="/api/login" className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10">
                  Sign In
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {children}
      </main>
    </div>
  );
}
