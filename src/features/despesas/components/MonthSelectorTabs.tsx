'use client';

import React from 'react';

const MESES = [
  'Jan/2026', 'Fev/2026', 'Mar/2026', 'Abr/2026',
  'Mai/2026', 'Jun/2026', 'Jul/2026', 'Ago/2026',
  'Set/2026', 'Out/2026', 'Nov/2026', 'Dez/2026'
];

interface MonthSelectorTabsProps {
  activeMonth: string;
  onSelectMonth: (month: string) => void;
}

export const MonthSelectorTabs: React.FC<MonthSelectorTabsProps> = ({
  activeMonth,
  onSelectMonth,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
      {MESES.map((mes) => {
        const isActive = activeMonth === mes;
        return (
          <button
            key={mes}
            onClick={() => onSelectMonth(mes)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card text-muted-foreground hover:bg-muted border border-border'
              }`}
          >
            {mes}
          </button>
        );
      })}
    </div>
  );
};