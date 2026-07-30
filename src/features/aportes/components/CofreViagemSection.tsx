'use client';

import { useAppStore } from '@/shared/store/use-app-store';
import { FormAddAporte } from './FormAddAporte';
import { AporteItemRow } from './AporteItemRow';

export function CofreViagemSection() {
  const aportes = useAppStore((s) => s.aportes);
  const deleteAporte = useAppStore((s) => s.deleteAporte);

  return (
    <section className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold text-[#253D2C] tracking-tight mb-4">Cofre da Viagem</h2>
      <div className="flex flex-col gap-4">
        <FormAddAporte />

        <div className="space-y-2 mt-4">
          {aportes.length === 0 ? (
            <div className="text-sm text-slate-400 italic text-center p-4">
              Nenhum aporte registrado.
            </div>
          ) : (
            aportes.map((aporte) => (
              <AporteItemRow
                key={aporte.id}
                aporte={aporte}
                onDelete={() => deleteAporte(aporte.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
