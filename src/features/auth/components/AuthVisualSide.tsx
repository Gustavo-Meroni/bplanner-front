'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plane } from 'lucide-react';
import { Wordmark } from '@/shared/components/brand/SunMark';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { WorldMap, type LatLng } from '@/shared/components/map/WorldMap';
import { SplitFlap } from '@/shared/components/brand/SplitFlap';

const EASE = [0.22, 1, 0.36, 1] as const;
const CYCLE_MS = 4200;

interface Aeroporto {
  code: string;
  city: string;
  at: LatLng;
}

const AEROPORTOS = {
  GRU: { code: 'GRU', city: 'São Paulo', at: { lat: -23.43, lng: -46.47 } },
  GIG: { code: 'GIG', city: 'Rio de Janeiro', at: { lat: -22.81, lng: -43.25 } },
  CNF: { code: 'CNF', city: 'Belo Horizonte', at: { lat: -19.62, lng: -43.97 } },
  POA: { code: 'POA', city: 'Porto Alegre', at: { lat: -29.99, lng: -51.17 } },
  BSB: { code: 'BSB', city: 'Brasília', at: { lat: -15.87, lng: -47.92 } },
  REC: { code: 'REC', city: 'Recife', at: { lat: -8.13, lng: -34.92 } },
  CWB: { code: 'CWB', city: 'Curitiba', at: { lat: -25.53, lng: -49.17 } },
  FOR: { code: 'FOR', city: 'Fortaleza', at: { lat: -3.78, lng: -38.53 } },
  EZE: { code: 'EZE', city: 'Buenos Aires', at: { lat: -34.82, lng: -58.54 } },
  LIS: { code: 'LIS', city: 'Lisboa', at: { lat: 38.77, lng: -9.13 } },
  SSA: { code: 'SSA', city: 'Salvador', at: { lat: -12.91, lng: -38.33 } },
  SCL: { code: 'SCL', city: 'Santiago', at: { lat: -33.39, lng: -70.79 } },
  MCZ: { code: 'MCZ', city: 'Maceió', at: { lat: -9.51, lng: -35.79 } },
  CDG: { code: 'CDG', city: 'Paris', at: { lat: 49.01, lng: 2.55 } },
  FLN: { code: 'FLN', city: 'Florianópolis', at: { lat: -27.67, lng: -48.55 } },
  CUN: { code: 'CUN', city: 'Cancún', at: { lat: 21.04, lng: -86.87 } },
  FEN: { code: 'FEN', city: 'Noronha', at: { lat: -3.85, lng: -32.42 } },
  JFK: { code: 'JFK', city: 'Nova York', at: { lat: 40.64, lng: -73.78 } },
} satisfies Record<string, Aeroporto>;

const A = AEROPORTOS;

/** Rotas que se alternam: origens variadas, destinos nacionais e internacionais */
const ROTAS: Array<{ de: Aeroporto; para: Aeroporto }> = [
  { de: A.GRU, para: A.EZE },
  { de: A.CNF, para: A.SSA },
  { de: A.GIG, para: A.LIS },
  { de: A.CWB, para: A.FLN },
  { de: A.POA, para: A.SCL },
  { de: A.BSB, para: A.MCZ },
  { de: A.REC, para: A.CDG },
  { de: A.FOR, para: A.FEN },
  { de: A.CWB, para: A.CUN },
  { de: A.GIG, para: A.JFK },
];

// Recorte: Américas, Atlântico, Europa e África
const VIEWBOX: [number, number, number, number] = [150, 30, 520, 330];

/** Canhoto do cartão de embarque: a rota muda de destino a cada poucos segundos. */
export function AuthVisualSide() {
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setIndex((i) => (i + 1) % ROTAS.length);
      }
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const { de, para } = ROTAS[index];

  return (
    <div
      className="relative flex flex-col overflow-hidden lg:w-[54%]"
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

        {/* Rota do voo */}
        <div className="mt-7 sm:mt-10">
          <div className="flex items-end gap-4">
            <div className="min-w-[6.5rem]">
              <SplitFlap text={de.code} className="font-display text-4xl leading-none text-foreground sm:text-5xl" />
              <CidadeTroca nome={de.city} />
            </div>

            <div className="relative mb-8 flex-1 sm:mb-9" aria-hidden="true">
              <div className="h-0 border-t-2 border-dashed border-foreground/25" />
              <motion.div
                key={`linha-${index}`}
                className="absolute inset-x-0 -top-px h-[2px] origin-left rounded-full bg-primary"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.45, ease: EASE }}
              />
              <motion.span
                key={`aviao-${index}`}
                className="absolute top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card p-1.5 text-primary shadow-sm"
                initial={reduce ? false : { left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1.2, delay: 0.45, ease: EASE }}
              >
                <Plane size={16} className="rotate-45" strokeWidth={2.25} />
              </motion.span>
            </div>

            <div className="min-w-[6.5rem] text-right">
              <SplitFlap text={para.code} className="font-display text-4xl leading-none text-foreground sm:text-5xl" delay={0.1} />
              <CidadeTroca nome={para.city} alinhar="direita" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-2 h-[170px] sm:h-[230px] lg:mt-4 lg:h-auto lg:min-h-[220px] lg:flex-1">
        <WorldMap
          className="map-fade absolute inset-0 h-full w-full"
          viewBox={VIEWBOX}
          preserveAspectRatio="xMidYMax slice"
          parallax
          routes={ROTAS.map((r, i) => ({
            id: `${r.de.code}-${r.para.code}`,
            from: r.de.at,
            to: r.para.at,
            active: i === index,
          }))}
          pins={[
            { id: `origem-${de.code}`, at: de.at, kind: 'origin' },
            { id: `destino-${para.code}-${index}`, at: para.at, kind: 'destination' },
          ]}
        />
      </div>

      {/* Legenda no rodapé do canhoto, em linha própria (não cobre os pins) */}
      <p className="relative z-10 hidden border-t border-dashed border-foreground/15 px-8 py-4 text-[13px] leading-relaxed text-foreground/70 sm:block">
        Planeje sozinho ou com quem vai junto: destino, meta, aportes e parcelas até o embarque.
      </p>
    </div>
  );
}

/** Nome da cidade trocando junto com o código */
function CidadeTroca({ nome, alinhar = 'esquerda' }: { nome: string; alinhar?: 'esquerda' | 'direita' }) {
  return (
    <span className={`relative mt-1.5 block h-5 ${alinhar === 'direita' ? 'text-right' : ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={nome}
          className="block whitespace-nowrap text-[13px] font-medium text-foreground/70"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {nome}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
