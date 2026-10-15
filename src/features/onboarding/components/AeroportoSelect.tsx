'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, PlaneTakeoff } from 'lucide-react';
import { useAeroportos } from '@/features/destinos/api/hooks';
import { cn } from '@/lib/utils';

interface AeroportoSelectProps {
  lat: number;
  lng: number;
  valor: string | null;
  onEscolher: (iata: string | null) => void;
  /** Rótulo lido por leitores de tela, ex.: "Aeroporto de São Paulo" */
  descricao: string;
}

/**
 * Mostra o aeroporto escolhido e, ao clicar, as outras opções da região.
 * Existe porque o palpite do app nem sempre serve: quem sai de São Paulo
 * pode preferir Congonhas a Guarulhos.
 */
export function AeroportoSelect({ lat, lng, valor, onEscolher, descricao }: AeroportoSelectProps) {
  const [aberto, setAberto] = useState(false);
  const { data: aeroportos = [], isFetching } = useAeroportos(lat, lng);

  if (!isFetching && aeroportos.length === 0) return null;

  const atual = aeroportos.find((a) => a.iata === valor);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-label={descricao}
        disabled={aeroportos.length === 0}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors',
          aberto ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground hover:text-foreground'
        )}
      >
        <PlaneTakeoff size={12} />
        {valor ?? '—'}
      </button>

      <AnimatePresence>
        {aberto && (
          <>
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              className="fixed inset-0 z-10 cursor-default"
              onClick={() => setAberto(false)}
            />
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-1 max-h-56 w-60 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg"
            >
              {aeroportos.map((a) => (
                <li key={a.iata}>
                  <button
                    type="button"
                    onClick={() => {
                      onEscolher(a.iata === valor ? null : a.iata);
                      setAberto(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                  >
                    <span className="w-9 shrink-0 text-[11px] font-bold tracking-wide text-foreground">{a.iata}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs text-foreground">{a.nome}</span>
                      <span className="block text-[11px] text-muted-foreground">{a.distanciaKm} km</span>
                    </span>
                    {a.iata === valor && <Check size={14} className="shrink-0 text-primary" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
