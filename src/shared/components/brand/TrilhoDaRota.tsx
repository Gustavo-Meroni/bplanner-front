'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Bus, Car, MapPinned, Plane } from 'lucide-react';
import type { TipoTransporte } from '@/features/viagens/api/types';
import { cn } from '@/lib/utils';
import { SplitFlap } from './SplitFlap';

/**
 * Roteiro empilhado, no espírito do painel de embarque.
 *
 * O layout antigo era um par lado a lado ("GRU ✈ EZE"), herdado de quando
 * o campo era o código do aeroporto: três letras sempre cabiam. Com nome
 * de cidade isso deixa de funcionar — "Rio" e "São José do Rio Preto" não
 * dividem bem a mesma linha. Empilhado, cada parada tem a largura inteira
 * do cartão, então todas usam o MESMO tamanho de fonte, sem quebra de
 * linha e sem encolher conforme o nome. Nome gigante some suave na borda.
 *
 * De brinde, o roteiro inteiro aparece (a viagem pode ter até 5 cidades),
 * e não só a primeira e a última.
 */
export interface PontoDaRota {
  /** Chave estável: mantém a animação parada quando só o resto muda */
  id: string;
  nome: string;
  detalhe?: string | null;
  /** Ainda não preenchido: fica esmaecido, como uma linha a completar */
  vazio?: boolean;
}

export function TrilhoDaRota({
  pontos,
  transporte,
  className,
  /** Muda de valor = o ícone percorre o trecho de novo (usado na tela de login) */
  animarEm,
}: {
  pontos: PontoDaRota[];
  transporte?: TipoTransporte | null;
  className?: string;
  animarEm?: string | number;
}) {
  const Icone = transporte ? ICONES[transporte] : null;
  const reduce = useReducedMotion() ?? false;

  return (
    <ol className={cn('space-y-5 sm:space-y-6', className)}>
      {pontos.map((ponto, i) => {
        const ultimo = i === pontos.length - 1;
        return (
          <li key={ponto.id} className="flex gap-3.5 sm:gap-4">
            {/* Trilho: bolinha da parada + linha tracejada até a próxima */}
            <div className="relative flex w-3 shrink-0 flex-col items-center pt-[0.6rem]" aria-hidden="true">
              <span
                className={cn(
                  'size-3 shrink-0 rounded-full ring-4',
                  ponto.vazio
                    ? 'bg-foreground/20 ring-transparent'
                    : ultimo
                      ? 'bg-primary ring-primary/15'
                      : 'bg-foreground/45 ring-transparent'
                )}
              />
              {!ultimo && (
                <span className="relative mt-1.5 -mb-3 w-0 flex-1 border-l-2 border-dashed border-foreground/20">
                  {i === 0 && Icone && (
                    <motion.span
                      key={animarEm === undefined ? 'parado' : `icone-${animarEm}`}
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card p-1 text-primary shadow-sm"
                      initial={animarEm === undefined || reduce ? { top: '50%' } : { top: '0%' }}
                      animate={{ top: '50%' }}
                      transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Icone size={13} />
                    </motion.span>
                  )}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 pb-0.5">
              {/* A máscara só aparece quando o nome realmente chega na borda */}
              <div className="overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,#000_88%,transparent_100%)]">
                <SplitFlap
                  text={ponto.nome.toUpperCase()}
                  delay={i * 0.06}
                  className={cn(
                    'font-display text-lg leading-snug tracking-[0.01em] sm:text-xl',
                    ponto.vazio ? 'text-foreground/35' : 'text-foreground'
                  )}
                />
              </div>
              {ponto.detalhe && (
                <p className="truncate text-xs font-medium text-foreground/55 sm:text-[13px]">{ponto.detalhe}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

const ICONES: Record<TipoTransporte, typeof Plane> = { AVIAO: Plane, CARRO: Car, ONIBUS: Bus, OUTRO: MapPinned };
