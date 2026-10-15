'use client';

import { useId, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { useBuscaCidades } from '@/features/destinos/api/hooks';
import type { Cidade } from '@/features/viagens/api/types';
import { cn } from '@/lib/utils';
import { Bandeira } from './Bandeira';

interface CidadeBuscaProps {
  label: string;
  placeholder?: string;
  onEscolher: (cidade: Cidade) => void;
  /** Cidades que não devem aparecer de novo nos resultados */
  excluir?: Cidade[];
  autoFocus?: boolean;
}

const mesmaCidade = (a: Cidade, b: Cidade) => Math.abs(a.lat - b.lat) < 0.01 && Math.abs(a.lng - b.lng) < 0.01;

/** Campo de busca com a lista de cidades logo abaixo (setas + Enter funcionam) */
export function CidadeBusca({ label, placeholder, onEscolher, excluir = [], autoFocus }: CidadeBuscaProps) {
  const id = useId();
  const [termo, setTermo] = useState('');
  const [ativo, setAtivo] = useState(0);
  const { data, isFetching, isError } = useBuscaCidades(termo);

  const resultados = (termo.trim().length >= 2 ? (data ?? []) : []).filter(
    (c) => !excluir.some((e) => mesmaCidade(e, c))
  );

  const escolher = (cidade: Cidade) => {
    onEscolher(cidade);
    setTermo('');
    setAtivo(0);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[13px] font-semibold text-foreground">
        {label}
      </label>
      <div className="relative flex items-center">
        <Search size={16} className="pointer-events-none absolute left-3.5 text-muted-foreground" />
        <input
          id={id}
          autoFocus={autoFocus}
          autoComplete="off"
          role="combobox"
          aria-expanded={resultados.length > 0}
          aria-controls={`${id}-lista`}
          value={termo}
          placeholder={placeholder ?? 'Ex.: Buenos Aires, Salvador, Lisboa'}
          onChange={(e) => {
            setTermo(e.target.value);
            setAtivo(0);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setAtivo((i) => Math.min(i + 1, resultados.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setAtivo((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter' && resultados[ativo]) {
              e.preventDefault();
              escolher(resultados[ativo]);
            } else if (e.key === 'Escape') {
              setTermo('');
            }
          }}
          className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-10 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 hover:border-foreground/25 focus:border-ring focus:ring-4 focus:ring-ring/15 focus-visible:outline-none"
        />
        {isFetching && <Loader2 size={16} className="absolute right-3.5 animate-spin text-muted-foreground" />}
      </div>

      {termo.trim().length >= 2 && (
        <ul
          id={`${id}-lista`}
          role="listbox"
          className="mt-1 overflow-hidden rounded-xl border border-border bg-card animate-in fade-in slide-in-from-top-1 duration-150"
        >
          {isError ? (
            <li className="px-3.5 py-3 text-[13px] text-muted-foreground">
              A busca de cidades está fora do ar agora. Tente de novo em instantes.
            </li>
          ) : resultados.length === 0 ? (
            <li className="px-3.5 py-3 text-[13px] text-muted-foreground">
              {isFetching || !data ? 'Procurando…' : 'Nenhuma cidade com esse nome.'}
            </li>
          ) : (
            resultados.slice(0, 6).map((c, i) => (
              <li key={`${c.lat},${c.lng}`} role="option" aria-selected={i === ativo}>
                <button
                  type="button"
                  onMouseEnter={() => setAtivo(i)}
                  onClick={() => escolher(c)}
                  className={cn(
                    'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors',
                    i === ativo ? 'bg-primary/[0.08]' : 'hover:bg-muted'
                  )}
                >
                  <Bandeira codigo={c.codigoPais} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">{c.nome}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {[c.regiao, c.pais].filter(Boolean).join(', ')}
                    </span>
                  </span>
                  {c.aeroporto && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-muted-foreground">
                      {c.aeroporto}
                    </span>
                  )}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
