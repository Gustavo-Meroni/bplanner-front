'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/shared/store/use-app-store';
import { useUIStore } from '@/shared/store/use-ui-store';
import { SuperMetaCard } from '@/features/dashboard/components/SuperMetaCard';
import { DespesasPanel } from '@/features/dashboard/components/DespesasPanel';
import { BarChartWidget } from '@/features/dashboard/components/BarChartWidget';
import { RecentPayments } from '@/features/dashboard/components/RecentPayments';
import { TotalLazerCard } from '@/features/dashboard/components/TotalLazerCard';
import { getMesAno, MESES_VIAGEM } from '@/shared/utils/format-date';
import type { AporteChartPoint, RecentPayment } from '@/features/dashboard/api/types';
import type { Aporte, Item } from '@/shared/store/use-app-store';

export default function DashboardPage() {
  const { tripGoal, aportes, profiles, updateTripGoal } = useAppStore();
  const { activeMonth } = useUIStore();

  // ── Compute metrics ──────────────────────────────────────────────────────────
  const totalEmCaixa = aportes.reduce((acc, a: Aporte) => acc + a.valor, 0);
  const valorLazer = Math.max(totalEmCaixa - tripGoal, 0);

  let totalPagas = 0;
  let totalDevido = 0;
  const recentPayments: RecentPayment[] = [];

  profiles.forEach((p) =>
    p.categories.forEach((c) =>
      c.items.forEach((i: Item) => {
        const itemMes = i.mes ?? 'Ago/2026';
        if (itemMes === activeMonth) {
          totalDevido += i.value;
          if (i.checked) totalPagas += i.value;
        }
        if (i.checked) {
          recentPayments.push({ id: i.id, name: i.name, value: i.value, profileName: p.name });
        }
      })
    )
  );

  // ── Chart data ───────────────────────────────────────────────────────────────
  const chartData: AporteChartPoint[] = MESES_VIAGEM.map((mes) => {
    const sum = aportes
      .filter((a: Aporte) => {
        if (!a.data) return mes === 'Jul/2026';
        return getMesAno(new Date(a.data)) === mes;
      })
      .reduce((s: number, a: Aporte) => s + a.valor, 0);
    return { name: mes.split('/')[0], acumulado: sum };
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#253D2C]">Visão Geral</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Acompanhe o progresso da sua poupança e metas.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SuperMetaCard
              current={Math.min(totalEmCaixa, tripGoal)}
              goal={tripGoal}
              onUpdateGoal={updateTripGoal}
            />
            <DespesasPanel
              totalPagas={totalPagas}
              totalDevido={totalDevido}
              activeMonth={activeMonth}
            />
          </div>

          {/* Bottom row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left column — 25% */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <TotalLazerCard valor={valorLazer} />
              <RecentPayments payments={recentPayments.slice().reverse()} />
            </div>

            {/* Right column — 75% */}
            <div className="lg:col-span-3 flex">
              <div className="flex-1 w-full min-h-[360px] lg:min-h-0">
                <BarChartWidget metaViagem={tripGoal} data={chartData} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
