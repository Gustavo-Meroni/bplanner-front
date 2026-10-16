'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus, X } from 'lucide-react';
import { CATALOGO, sugestoes, type TipoDeGasto } from '@/features/custos/catalogo';
import { cn } from '@/lib/utils';
import {
  gastoDoCatalogo,
  novoId,
  viagemInternacional,
  type GastoEscolhido,
  type Rascunho,
} from '../../hooks/use-rascunho';
import { TituloEtapa } from './comum';

export function EtapaGastos({
  rascunho,
  atualizar,
}: {
  rascunho: Rascunho;
  atualizar: (p: Partial<Rascunho>) => void;
}) {
  const [verTudo, setVerTudo] = useState(false);
  const [novo, setNovo] = useState('');

  const sugeridos = useMemo(
    () => new Set(sugestoes(rascunho.transporte, viagemInternacional(rascunho))),
    [rascunho.transporte, rascunho.paradas],
  );

  const escolhidos = new Set(rascunho.gastos.map((g) => g.id));
  const personalizados = rascunho.gastos.filter((g) => !sugeridos.has(g.id) && !ehDoCatalogo(g.id));

  const alternar = (tipo: TipoDeGasto) => {
    const jaTem = escolhidos.has(tipo.chave);
    atualizar({
      gastos: jaTem
        ? rascunho.gastos.filter((g) => g.id !== tipo.chave)
        : [...rascunho.gastos, gastoDoCatalogo(tipo.chave)!],
    });
  };

  const adicionarPersonalizado = () => {
    const nome = novo.trim();
    if (!nome) return;
    atualizar({
      gastos: [...rascunho.gastos, { id: novoId(), nome, categoria: 'OUTROS', base: 'FIXO' }],
    });
    setNovo('');
  };

  // Sugeridos primeiro; o resto só aparece quando a pessoa pede
  const grupos = CATALOGO.map((grupo) => ({
    titulo: grupo.titulo,
    itens: grupo.itens.filter((t) => verTudo || sugeridos.has(t.chave) || escolhidos.has(t.chave)),
  })).filter((grupo) => grupo.itens.length > 0);

  return (
    <div>
      <TituloEtapa
        titulo="Que gastos essa viagem tem?"
        subtitulo="Marque o que se aplica. Os valores você preenche depois, com calma."
      />

      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {verTudo ? 'Catálogo completo' : 'Sugeridos para a sua viagem'}
        </p>
        <button
          type="button"
          onClick={() => setVerTudo((v) => !v)}
          className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          {verTudo ? 'ver só os sugeridos' : 'ver todos os gastos'}
        </button>
      </div>

      <div className="space-y-4">
        {grupos.map((grupo) => (
          <div key={grupo.titulo}>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {grupo.titulo}
            </p>
            <div className="flex flex-wrap gap-2">
              {grupo.itens.map((tipo) => {
                const marcado = escolhidos.has(tipo.chave);
                return (
                  <button
                    key={tipo.chave}
                    type="button"
                    onClick={() => alternar(tipo)}
                    aria-pressed={marcado}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors',
                      marcado
                        ? 'border-primary bg-primary/10 font-semibold text-primary'
                        : 'border-border text-foreground hover:border-foreground/30 hover:bg-muted'
                    )}
                  >
                    {marcado && <Check size={13} />}
                    {tipo.nome}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {personalizados.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Seus</p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence initial={false}>
              {personalizados.map((g) => (
                <motion.span
                  key={g.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1.5 rounded-full border border-primary bg-primary/10 px-3 py-1.5 text-[13px] font-semibold text-primary"
                >
                  {g.nome}
                  <button
                    type="button"
                    onClick={() => atualizar({ gastos: rascunho.gastos.filter((x) => x.id !== g.id) })}
                    aria-label={`Remover ${g.nome}`}
                    className="-mr-1 rounded-full p-0.5 transition-colors hover:bg-primary/20"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <input
          value={novo}
          onChange={(e) => setNovo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              adicionarPersonalizado();
            }
          }}
          placeholder="Outro gasto: pet, presente, estacionamento…"
          aria-label="Nome de outro gasto"
          className="h-10 min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-foreground/25 focus:border-ring"
        />
        <button
          type="button"
          onClick={adicionarPersonalizado}
          disabled={!novo.trim()}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-dashed border-primary/40 text-primary transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
          aria-label="Adicionar gasto"
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        {rascunho.gastos.length === 0
          ? 'Pode seguir sem marcar nada e montar a lista depois.'
          : `${rascunho.gastos.length} ${rascunho.gastos.length === 1 ? 'gasto vai aparecer' : 'gastos vão aparecer'} no painel esperando o valor.`}
      </p>
    </div>
  );
}

const ehDoCatalogo = (id: string) => CATALOGO.some((grupo) => grupo.itens.some((t) => t.chave === id));
