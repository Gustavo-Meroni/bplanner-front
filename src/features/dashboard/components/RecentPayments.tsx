'use client';

import { formatCurrency } from '@/shared/utils/format-currency';

// Interface ajustada para a necessidade do componente
export interface RecentPayment {
  id: string;
  name: string;
  value: number;
  profileName: string;
}

interface RecentPaymentsProps {
  payments: RecentPayment[];
}

export function RecentPayments({ payments }: RecentPaymentsProps) {
  return (
    <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border flex flex-col flex-1 overflow-hidden min-h-[240px]">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-5 flex-shrink-0">
        Últimos Pagamentos
      </h3>
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {payments.length === 0 ? (
          <div className="text-sm text-muted-foreground italic mt-2">Nenhum item marcado ainda.</div>
        ) : (
          payments.slice(0, 3).map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="flex flex-col gap-0.5">
              <div className="flex justify-between items-center min-w-0">
                <span className="text-sm font-medium text-foreground truncate">{item.name}</span>
                <span className="text-sm font-semibold text-secondary flex-shrink-0 pl-2">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground truncate">{item.profileName}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}