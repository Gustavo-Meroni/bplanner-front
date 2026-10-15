'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { cn } from '@/lib/utils';

const DIAS_DA_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
];

interface CalendarioProps {
  /** "AAAA-MM-DD" */
  inicio: string;
  fim: string;
  onSelecionar: (intervalo: { inicio: string; fim: string }) => void;
  /** Datas marcadas com um ponto (feriados) */
  marcadas?: Set<string>;
  /** Menor data selecionável (padrão: hoje) */
  minimo?: string;
}

/**
 * Calendário de período (ida e volta) próprio: o nativo muda de cara em cada
 * navegador e não mostra feriados nem a contagem de noites.
 * O primeiro clique marca a ida; o segundo, a volta.
 */
export function Calendario({ inicio, fim, onSelecionar, marcadas, minimo }: CalendarioProps) {
  const hoje = useMemo(() => isoDe(new Date()), []);
  const min = minimo ?? hoje;
  const doisMeses = useMediaQuery('(min-width: 640px)');

  const [mesBase, setMesBase] = useState(() => primeiroDoMes(inicio || min));
  const [passando, setPassando] = useState<string | null>(null);

  // Enquanto escolhe a volta, o intervalo acompanha o cursor
  const selecionandoVolta = Boolean(inicio) && !fim;
  const fimVisual = fim || (selecionandoVolta && passando && passando >= inicio ? passando : '');

  const clicar = (dia: string) => {
    if (!inicio || fim || dia < inicio) {
      onSelecionar({ inicio: dia, fim: '' });
    } else {
      onSelecionar({ inicio, fim: dia });
    }
  };

  const meses = doisMeses ? [mesBase, somarMeses(mesBase, 1)] : [mesBase];

  return (
    <div onMouseLeave={() => setPassando(null)}>
      <div className="mb-2 flex items-center justify-between">
        <Navegar
          direcao="anterior"
          onClick={() => setMesBase((m) => somarMeses(m, -1))}
          desabilitado={mesBase <= primeiroDoMes(min)}
        />
        <div className="flex flex-1 justify-around px-2">
          {meses.map((m) => (
            <p key={m} className="text-sm font-semibold text-foreground">
              {MESES[Number(m.slice(5, 7)) - 1]} <span className="text-muted-foreground">{m.slice(0, 4)}</span>
            </p>
          ))}
        </div>
        <Navegar direcao="proximo" onClick={() => setMesBase((m) => somarMeses(m, 1))} />
      </div>

      <div className={cn('grid gap-5', doisMeses && 'grid-cols-2')}>
        {meses.map((mes) => (
          <Mes
            key={mes}
            mes={mes}
            inicio={inicio}
            fim={fimVisual}
            min={min}
            marcadas={marcadas}
            onClicar={clicar}
            onPassar={setPassando}
          />
        ))}
      </div>
    </div>
  );
}

function Navegar({ direcao, onClick, desabilitado }: { direcao: 'anterior' | 'proximo'; onClick: () => void; desabilitado?: boolean }) {
  const Icone = direcao === 'anterior' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desabilitado}
      aria-label={direcao === 'anterior' ? 'Mês anterior' : 'Próximo mês'}
      className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
    >
      <Icone size={18} />
    </button>
  );
}

function Mes({
  mes,
  inicio,
  fim,
  min,
  marcadas,
  onClicar,
  onPassar,
}: {
  mes: string;
  inicio: string;
  fim: string;
  min: string;
  marcadas?: Set<string>;
  onClicar: (dia: string) => void;
  onPassar: (dia: string | null) => void;
}) {
  const ano = Number(mes.slice(0, 4));
  const mesIndice = Number(mes.slice(5, 7)) - 1;
  const primeiroDiaSemana = new Date(Date.UTC(ano, mesIndice, 1)).getUTCDay();
  const diasNoMes = new Date(Date.UTC(ano, mesIndice + 1, 0)).getUTCDate();

  return (
    <div>
      <div className="mb-1 grid grid-cols-7">
        {DIAS_DA_SEMANA.map((d, i) => (
          <span key={i} className="text-center text-[11px] font-semibold text-muted-foreground">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {Array.from({ length: primeiroDiaSemana }, (_, i) => (
          <span key={`vazio-${i}`} />
        ))}
        {Array.from({ length: diasNoMes }, (_, i) => {
          const dia = `${mes}-${String(i + 1).padStart(2, '0')}`;
          const desabilitado = dia < min;
          const ehInicio = dia === inicio;
          const ehFim = Boolean(fim) && dia === fim;
          const noMeio = Boolean(inicio && fim) && dia > inicio && dia < fim;
          const pontaDeIntervalo = (ehInicio && Boolean(fim)) || ehFim;

          return (
            <button
              key={dia}
              type="button"
              disabled={desabilitado}
              onClick={() => onClicar(dia)}
              onMouseEnter={() => onPassar(dia)}
              aria-label={`${i + 1} de ${MESES[mesIndice]}`}
              aria-pressed={ehInicio || ehFim}
              className={cn(
                'relative mx-auto flex size-9 items-center justify-center rounded-lg text-[13px] transition-colors',
                desabilitado && 'cursor-not-allowed text-muted-foreground/35',
                !desabilitado && !ehInicio && !ehFim && !noMeio && 'text-foreground hover:bg-muted',
                noMeio && 'rounded-none bg-primary/15 text-foreground',
                pontaDeIntervalo && 'bg-primary font-semibold text-primary-foreground',
                ehInicio && !fim && 'bg-primary font-semibold text-primary-foreground',
                ehInicio && Boolean(fim) && 'rounded-r-none',
                ehFim && 'rounded-l-none'
              )}
            >
              {i + 1}
              {marcadas?.has(dia) && (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute bottom-1 size-1 rounded-full',
                    pontaDeIntervalo ? 'bg-primary-foreground/80' : 'bg-primary'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const isoDe = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const primeiroDoMes = (iso: string) => iso.slice(0, 7);

function somarMeses(mes: string, quantidade: number) {
  const ano = Number(mes.slice(0, 4));
  const indice = Number(mes.slice(5, 7)) - 1 + quantidade;
  const data = new Date(Date.UTC(ano, indice, 1));
  return `${data.getUTCFullYear()}-${String(data.getUTCMonth() + 1).padStart(2, '0')}`;
}
