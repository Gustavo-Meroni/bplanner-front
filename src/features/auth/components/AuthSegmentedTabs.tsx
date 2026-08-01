'use client';

import { motion } from 'framer-motion';

interface AuthSegmentedTabsProps {
  activeTab: 'login' | 'register';
  onTabChange: (tab: 'login' | 'register') => void;
}

export function AuthSegmentedTabs({ activeTab, onTabChange }: AuthSegmentedTabsProps) {
  return (
    <div className="flex p-1 mb-8 bg-muted rounded-2xl relative">
      <button
        type="button"
        onClick={() => onTabChange('login')}
        className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors rounded-xl ${
          activeTab === 'login' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        ENTRAR
      </button>
      <button
        type="button"
        onClick={() => onTabChange('register')}
        className={`flex-1 relative z-10 py-2.5 text-sm font-semibold transition-colors rounded-xl ${
          activeTab === 'register' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        CADASTRAR
      </button>

      {/* Pill Animação */}
      <motion.div
        className="absolute inset-y-1 w-[calc(50%-4px)] bg-card rounded-xl shadow-sm border border-border"
        animate={{
          left: activeTab === 'login' ? '4px' : 'calc(50% + 2px)',
        }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
      />
    </div>
  );
}
