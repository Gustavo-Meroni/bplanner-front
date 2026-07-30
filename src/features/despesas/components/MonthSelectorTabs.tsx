'use client';

import { MESES_VIAGEM } from '@/shared/utils/format-date';

interface MonthSelectorTabsProps {
  activeMonth: string;
  onSelect: (month: string) => void;
}

export function MonthSelectorTabs({ activeMonth, onSelect }: MonthSelectorTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
      {MESES_VIAGEM.map((m) => (
        <button
          key={m}
          onClick={() => onSelect(m)}
          className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
            activeMonth === m
              ? 'bg-[#2E6F40] text-white shadow-md'
              : 'bg-white text-slate-500 hover:bg-[#CFFFDC]/50 border border-slate-200'
          }`}
          aria-pressed={activeMonth === m}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
