'use client';

import { formatCurrency } from '@/shared/utils/format-currency';

interface DespesasPanelProps {
  totalPagas: number;
  totalDevido: number;
  activeMonth: string;
}

export function DespesasPanel({ totalPagas, totalDevido, activeMonth }: DespesasPanelProps) {
  const percentage = totalDevido > 0 ? Math.round((totalPagas / totalDevido) * 100) : 100;

  let strokeColor = '#2E6F40';
  const bgColor = '#f1f5f9';
  let textColor = 'text-[#2E6F40]';

  if (percentage < 100 && totalDevido > 0) {
    strokeColor = '#e2a7a4';
    textColor = 'text-[#c27b78]';
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center gap-8 h-full transition-shadow hover:shadow-md min-h-[160px]">
      {/* SVG Donut */}
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke={bgColor} strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className={`text-xl font-bold ${textColor}`}>{percentage}%</span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Progresso do Mês • {activeMonth}
        </span>
        <div className="mt-2 space-y-1">
          <div className="text-2xl font-bold text-[#253D2C]">{formatCurrency(totalPagas)}</div>
          <div className="text-sm font-medium text-slate-400">de {formatCurrency(totalDevido)}</div>
        </div>
      </div>
    </div>
  );
}
