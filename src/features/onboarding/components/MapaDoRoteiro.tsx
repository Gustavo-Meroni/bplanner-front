'use client';

import { Wordmark } from '@/shared/components/brand/SunMark';
import { TrilhoDaRota, type PontoDaRota } from '@/shared/components/brand/TrilhoDaRota';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { WorldMap, viewBoxForPoints, type MapPin, type MapRoute } from '@/shared/components/map/WorldMap';
import { Fontes } from '@/shared/components/ui/Fontes';
import { dataCurta, duracao } from '@/shared/utils/datas';
import type { Rascunho } from '../hooks/use-rascunho';
import { Bandeira } from './Bandeira';

/** Canhoto do onboarding: o cartão de embarque se monta conforme a pessoa preenche */
export function MapaDoRoteiro({ rascunho }: { rascunho: Rascunho }) {
  const { paradas, origem, dataIda, dataVolta, transporte } = rascunho;

  const pontos = [...(origem ? [origem] : []), ...paradas];
  const rotas: MapRoute[] = pontos.slice(1).map((p, i) => ({
    id: `${pontos[i].lat},${pontos[i].lng}->${p.lat},${p.lng}`,
    from: pontos[i],
    to: p,
    active: true,
  }));
  const pins: MapPin[] = [
    ...(origem ? [{ id: `o-${origem.lat},${origem.lng}`, at: origem, kind: 'origin' as const }] : []),
    ...paradas.map((p, i) => ({
      id: `d-${p.lat},${p.lng}`,
      at: p,
      kind: 'destination' as const,
      pulse: i === paradas.length - 1,
      label: paradas.length > 1 ? String(i + 1) : undefined,
    })),
  ];

  const roteiro = montarRoteiro(rascunho);

  const internacional = paradas.some((p) => p.codigoPais && p.codigoPais.toUpperCase() !== 'BR');
  const paises = [...new Map(paradas.filter((p) => p.codigoPais).map((p) => [p.codigoPais, p])).values()];

  return (
    <div
      className="relative flex flex-col overflow-hidden lg:w-[50%]"
      style={{
        background:
          'radial-gradient(120% 90% at 20% 100%, hsl(var(--celeste) / 0.16), transparent 60%), hsl(var(--muted) / 0.55)',
      }}
    >
      <div className="relative z-10 px-6 pt-6 sm:px-8 sm:pt-7">
        <div className="flex items-center justify-between">
          <Wordmark />
          <ThemeToggle />
        </div>

        <TrilhoDaRota className="mt-6 sm:mt-7" pontos={roteiro} transporte={transporte} />
      </div>

      <div className="relative mt-2 h-[170px] sm:h-[220px] lg:mt-2 lg:h-auto lg:min-h-[220px] lg:flex-1">
        <WorldMap
          className="map-fade absolute inset-0 h-full w-full"
          viewBox={viewBoxForPoints(pontos)}
          parallax
          routes={rotas}
          pins={pins}
        />
        {paises.length > 0 && (
          <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-border bg-card/85 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur animate-in fade-in zoom-in-95 duration-300">
            <span className="flex -space-x-1">
              {paises.slice(0, 3).map((p) => (
                <Bandeira key={p.codigoPais} codigo={p.codigoPais} />
              ))}
            </span>
            {internacional ? 'Internacional' : 'Nacional'}
          </div>
        )}
      </div>

      <div className="relative z-10 hidden items-end justify-between gap-4 border-t border-dashed border-foreground/15 px-8 py-4 sm:flex">
        <p className="text-[13px] leading-relaxed text-foreground/70">
          {dataIda && dataVolta && dataVolta >= dataIda
            ? `${dataCurta(dataIda)} → ${dataCurta(dataVolta)} · ${duracao(dataIda, dataVolta).dias} dias`
            : 'Seu cartão de embarque vai se montando enquanto você responde.'}
        </p>
        <Fontes className="shrink-0 text-right" />
      </div>
    </div>
  );
}

/**
 * O que aparece no trilho. Com muitas cidades o miolo vira uma linha só,
 * para o cabeçalho não comer o mapa: São Paulo → +2 cidades → Mendoza.
 */
function montarRoteiro({ origem, paradas }: Rascunho): PontoDaRota[] {
  const origemNoTrilho: PontoDaRota = origem
    ? { id: `o-${origem.lat},${origem.lng}`, nome: origem.nome, detalhe: origem.contexto ?? 'Saída' }
    : { id: 'origem-vazia', nome: 'Origem', detalhe: 'De onde você sai', vazio: true };

  if (paradas.length === 0) {
    return [origemNoTrilho, { id: 'destino-vazio', nome: 'Destino', detalhe: 'Para onde você vai', vazio: true }];
  }

  const comoPonto = (p: (typeof paradas)[number]): PontoDaRota => ({
    id: `d-${p.lat},${p.lng}`,
    nome: p.nome,
    detalhe: p.contexto ?? ([p.regiao, p.pais].filter(Boolean).join(', ') || null),
  });

  const visiveis =
    paradas.length <= 3
      ? paradas.map(comoPonto)
      : [
          comoPonto(paradas[0]),
          { id: 'meio', nome: `+${paradas.length - 2} cidades`, detalhe: 'no meio do caminho' },
          comoPonto(paradas[paradas.length - 1]),
        ];

  return [origemNoTrilho, ...visiveis];
}
