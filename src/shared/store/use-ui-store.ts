import { create } from 'zustand';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ActiveView = 'dashboard' | 'gestao';

interface UIState {
  /** Currently selected planning month, e.g. "Ago/2026" */
  activeMonth: string;
  /** Controls the mobile drawer sidebar */
  isMobileOpen: boolean;
  /** Active navigation view (mirrors route, used for AnimatePresence key) */
  activeView: ActiveView;

  setActiveMonth: (month: string) => void;
  toggleMobileSidebar: () => void;
  setMobileOpen: (open: boolean) => void;
  setActiveView: (view: ActiveView) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useUIStore = create<UIState>()((set) => ({
  activeMonth: 'Ago/2026',
  isMobileOpen: false,
  activeView: 'dashboard',

  setActiveMonth: (month) => set({ activeMonth: month }),
  toggleMobileSidebar: () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
  setActiveView: (view) => set({ activeView: view }),
}));
