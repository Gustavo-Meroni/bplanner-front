'use client';

import { CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import type { RecentPayment } from '@/features/dashboard/api/types';

interface RecentPaymentsProps {
  payments: RecentPayment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border/50 flex flex-col flex-1 overflow-hidden min-h-[240px]">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-5 flex-shrink-0">
        Últimos Pagamentos
      </h3>
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {payments.length === 0 ? (
          <div className="text-sm text-muted-foreground italic mt-2">Nenhum item marcado ainda.</div>
        ) : (
          payments.slice(0, 4).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">

              {/* Círculo de Check Animado (Feedback Positivo) */}
              <div className="w-8 h-8 rounded-full bg-success/15 flex items-center justify-center flex-shrink-0 group-hover:bg-success/25 transition-colors">
                <CheckCircle2 size={16} className="text-success" strokeWidth={2.5} />
              </div>

              {/* Informações da Despesa */}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex justify-between items-center min-w-0">
                  <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                  <span className="text-sm font-bold text-foreground flex-shrink-0 pl-2">
                    {formatCurrency(item.value)}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground truncate uppercase">
                  {item.profileName}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}