'use client';

import { formatCurrency } from '@/shared/utils/format-currency';
import { InfoTooltip } from '@/shared/components/ui/InfoTooltip';

interface DespesasPanelProps {
  totalPagas: number;
  totalDevido: number;
  activeMonth: string;
}

export function DespesasPanel({ totalPagas, totalDevido, activeMonth }: DespesasPanelProps) {
  const percentage = totalDevido > 0 ? Math.round((totalPagas / totalDevido) * 100) : 100;

  const isPaid = percentage >= 100 || totalDevido === 0;
  const strokeColor = isPaid ? 'hsl(var(--success))' : 'hsl(var(--destructive))';
  const bgColor = 'hsl(var(--muted))';
  const textClass = isPaid ? 'text-success' : 'text-foreground';

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-card p-6 sm:p-8 rounded-[2rem] shadow-sm border border-border/50 flex flex-col sm:flex-row items-center gap-8 h-full transition-shadow hover:shadow-md min-h-[160px]">
      <div className="relative w-28 h-28 flex-shrink-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke={bgColor} strokeWidth="6" />
          <circle
            cx="50" cy="50" r={radius}
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
          <span className={`text-xl font-bold ${textClass}`}>{percentage}%</span>
        </div>
      </div>

      <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
        {/* 💡 Tooltip Adicionado Aqui */}
        <div className="flex items-center justify-center sm:justify-start gap-1.5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Progresso • {activeMonth}
          </span>
          <InfoTooltip text="Mostra o quanto das contas e compromissos deste mês já foram pagos." />
        </div>
        <div className="mt-2 space-y-1">
          <div className="text-2xl font-bold text-foreground">{formatCurrency(totalPagas)}</div>
          <div className="text-sm font-medium text-muted-foreground">de {formatCurrency(totalDevido)}</div>
        </div>
      </div>
    </div>
  );
}