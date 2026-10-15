'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PlaneTakeoff, X } from 'lucide-react';
import type { Cidade } from '@/features/viagens/api/types';
import type { Rascunho } from '../../hooks/use-rascunho';
import { Bandeira } from '../Bandeira';
import { CidadeBusca } from '../CidadeBusca';
import { TituloEtapa } from './comum';

const MAX_PARADAS = 5;

export function EtapaDestinos({
  rascunho,
  atualizar,
}: {
  rascunho: Rascunho;
  atualizar: (p: Partial<Rascunho>) => void;
}) {
  const { paradas, origem } = rascunho;

  return (
    <div>
      <TituloEtapa
        titulo="Para onde você vai?"
        subtitulo="Escolha a cidade. Se o roteiro tiver mais de uma, adicione na ordem."
      />

      {paradas.length > 0 && (
        <ol className="mb-3 space-y-2">
          <AnimatePresence initial={false}>
            {paradas.map((p, i) => (
              <motion.li
                key={`${p.lat},${p.lng}`}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <Bandeira codigo={p.codigoPais} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{p.nome}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {[p.regiao, p.pais].filter(Boolean).join(', ')}
                    {p.aeroporto && ` · ${p.aeroporto}`}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => atualizar({ paradas: paradas.filter((_, j) => j !== i) })}
                  className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label={`Remover ${p.nome}`}
                >
                  <X size={16} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ol>
      )}

      {paradas.length < MAX_PARADAS ? (
        <CidadeBusca
          key={paradas.length}
          autoFocus={paradas.length === 0}
          label={paradas.length === 0 ? 'Destino' : 'Adicionar outra cidade (opcional)'}
          excluir={paradas}
          onEscolher={(c) => atualizar({ paradas: [...paradas, c] })}
        />
      ) : (
        <p className="text-xs text-muted-foreground">Limite de {MAX_PARADAS} cidades por viagem.</p>
      )}

      <div className="mt-6 border-t border-dashed border-border pt-5">
        {origem ? (
          <OrigemEscolhida origem={origem} onRemover={() => atualizar({ origem: null })} />
        ) : (
          <CidadeBusca
            label="De onde você sai? (opcional)"
            placeholder="Sua cidade"
            onEscolher={(c) => atualizar({ origem: c })}
          />
        )}
        {!origem && (
          <p className="mt-1.5 text-xs text-muted-foreground">Com a origem, o mapa desenha a rota completa.</p>
        )}
      </div>
    </div>
  );
}

function OrigemEscolhida({ origem, onRemover }: { origem: Cidade; onRemover: () => void }) {
  return (
    <div>
      <p className="mb-1 text-[13px] font-semibold text-foreground">Saindo de</p>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
        <PlaneTakeoff size={18} className="shrink-0 text-muted-foreground" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
          {origem.nome}
          {origem.aeroporto && <span className="ml-1.5 text-xs font-medium text-muted-foreground">{origem.aeroporto}</span>}
        </span>
        <button
          type="button"
          onClick={onRemover}
          className="rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Trocar
        </button>
      </div>
    </div>
  );
}
