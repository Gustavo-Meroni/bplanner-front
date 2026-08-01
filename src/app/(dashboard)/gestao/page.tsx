'use client';

import React from 'react';
import { useUIStore } from '@/shared/store/use-ui-store';
import { MonthSelectorTabs } from '@/features/despesas/components/MonthSelectorTabs';
import { CofreViagemSection } from '@/features/aportes/components/CofreViagemSection';
import { ProfileCard } from '@/features/despesas/components/ProfileCard';
import { useDespesasQuery } from '@/features/despesas/api/hooks';

export default function GestaoPage() {
  const activeMonth = useUIStore((state) => state.activeMonth);
  const setActiveMonth = useUIStore((state) => state.setActiveMonth);

  // Busca as despesas reais do mês selecionado
  const { data: profiles = [], isLoading } = useDespesasQuery(activeMonth);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Cofre de Aportes */}
      <CofreViagemSection />

      {/* Tabs de Seleção do Mês */}
      <MonthSelectorTabs activeMonth={activeMonth} onSelectMonth={setActiveMonth} />

      {/* Cartões dos Perfis (Gustavo / Rafa) */}
      {isLoading ? (
        <div className="text-center p-12 text-slate-400 font-medium">
          Carregando planejamento de {activeMonth}...
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-3xl border border-slate-200 text-slate-400">
          Nenhum perfil de planejamento encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} activeMonth={activeMonth} />
          ))}
        </div>
      )}
    </div>
  );
}