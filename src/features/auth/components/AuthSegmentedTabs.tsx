'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export type AuthTab = 'login' | 'register';

interface AuthSegmentedTabsProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

const TABS: Array<{ id: AuthTab; label: string }> = [
  { id: 'login', label: 'Entrar' },
  { id: 'register', label: 'Criar conta' },
];

export function AuthSegmentedTabs({ activeTab, onTabChange }: AuthSegmentedTabsProps) {
  return (
    <div role="tablist" aria-label="Acesso" className="mb-5 flex rounded-full bg-muted p-1">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex-1 rounded-full py-2 text-sm font-semibold transition-colors',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="auth-tab-pill"
                className="absolute inset-0 rounded-full border border-border bg-card shadow-sm"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
              />
            )}
            <span className="relative">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
