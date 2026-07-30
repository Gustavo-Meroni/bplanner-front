'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/shared/store/use-app-store';

export function FormAddAporte() {
  const [desc, setDesc] = useState('');
  const [valor, setValor] = useState('');
  const addAporte = useAppStore((s) => s.addAporte);

  const handleSubmit = () => {
    if (!desc.trim() || !valor) return;
    const parsed = parseFloat(valor);
    if (isNaN(parsed) || parsed <= 0) return;
    addAporte(desc.trim(), parsed);
    setDesc('');
    setValor('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-[#CFFFDC]/30 border border-[#CFFFDC]/50 rounded-2xl">
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="Descrição (ex: Agosto — Gustavo)"
          className="w-full px-3 py-2 bg-white border border-[#68BA7F]/30 rounded-xl outline-none focus:border-[#2E6F40] text-sm text-[#253D2C]"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex w-full sm:w-auto items-center gap-3">
        <div className="relative w-full sm:w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
          <input
            type="number"
            placeholder="0.00"
            className="w-full pl-8 pr-3 py-2 bg-white border border-[#68BA7F]/30 rounded-xl outline-none focus:border-[#2E6F40] text-sm text-[#2E6F40] font-bold"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#2E6F40] text-white rounded-xl hover:bg-[#253D2C] transition-colors font-semibold text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>
    </div>
  );
}
