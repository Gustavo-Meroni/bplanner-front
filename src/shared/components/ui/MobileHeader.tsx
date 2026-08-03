'use client';

import { Menu, Target } from 'lucide-react';
import { useUIStore } from '@/shared/store/use-ui-store';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export function MobileHeader() {
  const setMobileOpen = useUIStore((s) => s.setMobileOpen);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:hidden flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-primary rounded-lg text-primary-foreground">
          <Target size={18} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-foreground">BPlanner</span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          id="mobile-menu-btn"
          className="p-2 text-muted-foreground hover:bg-muted rounded-lg"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}
