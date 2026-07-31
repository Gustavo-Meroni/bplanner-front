'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Wallet } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import { useUIStore } from '@/shared/store/use-ui-store';
import { useAportesQuery, useCreateAporteMutation, useDeleteAporteMutation } from '../api/hooks';

export const CofreViagemSection = () => {
  const [novoAporteDesc, setNovoAporteDesc] = useState('');
  const [novoAporteValor, setNovoAporteValor] = useState('');

  // 1. Pega o mês que está selecionado na aba (ex: "Ago/2026")
  const activeMonth = useUIStore((state) => state.activeMonth);

  // Hooks do TanStack Query
  const { data: aportes = [], isLoading } = useAportesQuery();
  const { mutate: criarAporte, isPending: isCreating } = useCreateAporteMutation();
  const { mutate: deletarAporte, isPending: isDeleting } = useDeleteAporteMutation();

  // Filtra os aportes para mostrar apenas os do mês selecionado
  const aportesDoMes = aportes.filter(a => a.mes === activeMonth);

  const handleAddAporte = () => {
    if (!novoAporteDesc.trim() || !novoAporteValor) return;
    const val = parseFloat(novoAporteValor);
    if (isNaN(val) || val <= 0) return;

    // 2. Envia o mês junto no payload para a API
    criarAporte(
      {
        descricao: novoAporteDesc.trim(),
        valor: val,
        mes: activeMonth
      },
      {
        onSuccess: () => {
          setNovoAporteDesc('');
          setNovoAporteValor('');
        },
      }
    );
  };

  return (
    <section className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-[#253D2C] tracking-tight mb-4">
        Cofre da Viagem <span className="text-sm font-medium text-slate-400 ml-2">• {activeMonth}</span>
      </h2>

      <div className="flex flex-col gap-4">
        {/* Formulário de Adição */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-[#CFFFDC]/30 border border-[#CFFFDC]/50 rounded-2xl">
          <div className="flex-1 w-full">
            <input
              type="text"
              placeholder="Descrição (ex: Salário Gustavo)"
              className="w-full px-3 py-2 bg-white border border-[#68BA7F]/30 rounded-xl outline-none focus:border-[#2E6F40] text-sm text-[#253D2C]"
              value={novoAporteDesc}
              onChange={(e) => setNovoAporteDesc(e.target.value)}
            />
          </div>
          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative w-full sm:w-36">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 bg-white border border-[#68BA7F]/30 rounded-xl outline-none focus:border-[#2E6F40] text-sm text-[#2E6F40] font-bold"
                value={novoAporteValor}
                onChange={(e) => setNovoAporteValor(e.target.value)}
              />
            </div>
            <button
              onClick={handleAddAporte}
              disabled={isCreating}
              className="px-4 py-2 bg-[#2E6F40] text-white rounded-xl hover:bg-[#253D2C] transition-colors font-semibold text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} /> {isCreating ? 'Salvando...' : 'Adicionar'}
            </button>
          </div>
        </div>

        {/* Lista de Aportes Filtrada por Mês */}
        <div className="space-y-2 mt-4">
          {isLoading ? (
            <div className="text-sm text-slate-400 italic text-center p-4">Carregando aportes...</div>
          ) : aportesDoMes.length === 0 ? (
            <div className="text-sm text-slate-400 italic text-center p-4">Nenhum aporte registrado em {activeMonth}.</div>
          ) : (
            aportesDoMes.map((aporte) => (
              <div
                key={aporte.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#CFFFDC] flex items-center justify-center text-[#2E6F40]">
                    <Wallet size={16} />
                  </div>
                  <span className="text-sm font-semibold text-[#253D2C]">{aporte.descricao}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#2E6F40]">
                    {formatCurrency(aporte.valor)}
                  </span>
                  <button
                    onClick={() => deletarAporte(aporte.id)}
                    disabled={isDeleting}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Excluir aporte"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};