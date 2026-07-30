'use client';

import { Menu, Target } from 'lucide-react';
import { useUIStore } from '@/shared/store/use-ui-store';

export function MobileHeader() {
  const setMobileOpen = useUIStore((s) => s.setMobileOpen);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:hidden flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-[#2E6F40] rounded-lg text-white">
          <Target size={18} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-[#253D2C]">BPlanner</span>
      </div>
      <button
        id="mobile-menu-btn"
        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
