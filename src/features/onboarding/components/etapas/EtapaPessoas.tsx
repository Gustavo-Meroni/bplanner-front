'use client';

import { Minus, Plus, User, Users } from 'lucide-react';
import type { Rascunho } from '../../hooks/use-rascunho';
import { Opcao, TituloEtapa } from './comum';

export function EtapaPessoas({ rascunho, atualizar }: { rascunho: Rascunho; atualizar: (p: Partial<Rascunho>) => void }) {
  const { companhia, pessoas } = rascunho;

  return (
    <div>
      <TituloEtapa titulo="Quem vai?" subtitulo="Isso entra na estimativa de custos e define se você vai convidar alguém." />

      <div className="space-y-2.5" role="radiogroup" aria-label="Quem vai">
        <Opcao
          name="companhia"
          selecionada={companhia === 'sozinho'}
          onSelecionar={() => atualizar({ companhia: 'sozinho', pessoas: 1 })}
          icone={<User size={18} />}
          titulo="Só eu"
          descricao="Você planeja e acompanha tudo sozinho."
        />
        <Opcao
          name="companhia"
          selecionada={companhia === 'grupo'}
          onSelecionar={() => atualizar({ companhia: 'grupo', pessoas: Math.max(pessoas, 2) })}
          icone={<Users size={18} />}
          titulo="Com mais gente"
          descricao="Cada pessoa tem a própria conta e todos veem a mesma viagem."
        />
      </div>

      {companhia === 'grupo' && (
        <div className="mt-5 animate-in fade-in slide-in-from-top-1 duration-200">
          <p className="text-[13px] font-semibold text-foreground">Quantas pessoas, contando você?</p>
          <div className="mt-2 flex items-center gap-3">
            <Passo aria-label="Menos uma pessoa" disabled={pessoas <= 2} onClick={() => atualizar({ pessoas: pessoas - 1 })}>
              <Minus size={16} />
            </Passo>
            <span className="w-10 text-center font-display text-3xl tabular-nums text-foreground" aria-live="polite">
              {pessoas}
            </span>
            <Passo aria-label="Mais uma pessoa" disabled={pessoas >= 20} onClick={() => atualizar({ pessoas: pessoas + 1 })}>
              <Plus size={16} />
            </Passo>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            No final você recebe um link para convidar quem vai junto.
          </p>
        </div>
      )}
    </div>
  );
}

function Passo(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
    />
  );
}
