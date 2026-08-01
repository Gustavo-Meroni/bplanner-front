'use client';

import { Wallet, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import type { Aporte } from '@/shared/store/use-app-store';

interface AporteItemRowProps {
  aporte: Aporte;
  onDelete: () => void;
}

export function AporteItemRow({ aporte, onDelete }: AporteItemRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
          <Wallet size={16} />
        </div>
        <span className="text-sm font-semibold text-foreground">{aporte.descricao}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-secondary">{formatCurrency(aporte.valor)}</span>
        <button
          onClick={onDelete}
          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          aria-label={`Remover aporte "${aporte.descricao}"`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
