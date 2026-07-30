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
    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#CFFFDC] flex items-center justify-center text-[#2E6F40]">
          <Wallet size={16} />
        </div>
        <span className="text-sm font-semibold text-[#253D2C]">{aporte.descricao}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-[#2E6F40]">{formatCurrency(aporte.valor)}</span>
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          aria-label={`Remover aporte "${aporte.descricao}"`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
