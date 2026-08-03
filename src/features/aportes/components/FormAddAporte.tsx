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
    <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-2xl">
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="Descrição (ex: Agosto — Gustavo)"
          className="w-full px-3 py-2 bg-card border border-border rounded-xl outline-none focus:border-primary text-sm text-foreground placeholder:text-muted-foreground"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="flex w-full sm:w-auto items-center gap-3">
        <div className="relative w-full sm:w-32">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
          <input
            type="number"
            placeholder="0.00"
            className="w-full pl-8 pr-3 py-2 bg-card border border-border rounded-xl outline-none focus:border-primary text-sm text-secondary font-bold placeholder:text-muted-foreground"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/80 transition-colors font-semibold text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
        >
          <Plus size={16} />
          Adicionar
        </button>
      </div>
    </div>
  );
}
