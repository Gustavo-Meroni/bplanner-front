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

interface Lugar {
  cidade: string;
  uf: string;
  at: LatLng;
}

const LUGARES = {
  saopaulo: { cidade: 'São Paulo', uf: 'Brasil', at: { lat: -23.55, lng: -46.63 } },
  rio: { cidade: 'Rio de Janeiro', uf: 'Brasil', at: { lat: -22.91, lng: -43.17 } },
  bh: { cidade: 'Belo Horizonte', uf: 'Brasil', at: { lat: -19.92, lng: -43.94 } },
  poa: { cidade: 'Porto Alegre', uf: 'Brasil', at: { lat: -30.03, lng: -51.23 } },
  bsb: { cidade: 'Brasília', uf: 'Brasil', at: { lat: -15.79, lng: -47.88 } },
  recife: { cidade: 'Recife', uf: 'Brasil', at: { lat: -8.05, lng: -34.88 } },
  curitiba: { cidade: 'Curitiba', uf: 'Brasil', at: { lat: -25.43, lng: -49.27 } },
  fortaleza: { cidade: 'Fortaleza', uf: 'Brasil', at: { lat: -3.73, lng: -38.52 } },
  buenosaires: { cidade: 'Buenos Aires', uf: 'Argentina', at: { lat: -34.61, lng: -58.38 } },
  lisboa: { cidade: 'Lisboa', uf: 'Portugal', at: { lat: 38.72, lng: -9.14 } },
  salvador: { cidade: 'Salvador', uf: 'Bahia', at: { lat: -12.97, lng: -38.5 } },
  santiago: { cidade: 'Santiago', uf: 'Chile', at: { lat: -33.45, lng: -70.67 } },
  maceio: { cidade: 'Maceió', uf: 'Alagoas', at: { lat: -9.65, lng: -35.71 } },
  paris: { cidade: 'Paris', uf: 'França', at: { lat: 48.86, lng: 2.35 } },
  floripa: { cidade: 'Florianópolis', uf: 'Santa Catarina', at: { lat: -27.6, lng: -48.55 } },
  cancun: { cidade: 'Cancún', uf: 'México', at: { lat: 21.16, lng: -86.85 } },
  noronha: { cidade: 'Noronha', uf: 'Pernambuco', at: { lat: -3.85, lng: -32.42 } },
  novayork: { cidade: 'Nova York', uf: 'Estados Unidos', at: { lat: 40.71, lng: -74.01 } },
} satisfies Record<string, Lugar>;

const L = LUGARES;

/** Rotas que se alternam: origens variadas, destinos nacionais e internacionais */
const ROTAS: Array<{ de: Lugar; para: Lugar }> = [
  { de: L.saopaulo, para: L.buenosaires },
  { de: L.bh, para: L.salvador },
  { de: L.rio, para: L.lisboa },
  { de: L.curitiba, para: L.floripa },
  { de: L.poa, para: L.santiago },
  { de: L.bsb, para: L.maceio },
  { de: L.recife, para: L.paris },
  { de: L.fortaleza, para: L.noronha },
  { de: L.curitiba, para: L.cancun },
  { de: L.rio, para: L.novayork },
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
          <div className="flex items-end gap-5">
            <div className="min-w-0 flex-1">
              <SplitFlap
                text={de.cidade.toUpperCase()}
                className="font-display text-xl leading-tight text-foreground sm:text-2xl"
              />
              <CidadeTroca nome={de.uf} />
            </div>

            <div className="relative mb-8 flex-[0.6] sm:mb-9" aria-hidden="true">
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

            <div className="min-w-0 flex-1 text-right">
              <SplitFlap
                text={para.cidade.toUpperCase()}
                className="justify-end font-display text-xl leading-tight text-foreground sm:text-2xl"
                delay={0.1}
              />
              <CidadeTroca nome={para.uf} alinhar="direita" />
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
            id: `${r.de.cidade}-${r.para.cidade}`,
            from: r.de.at,
            to: r.para.at,
            active: i === index,
          }))}
          pins={[
            { id: `origem-${de.cidade}`, at: de.at, kind: 'origin' },
            { id: `destino-${para.cidade}-${index}`, at: para.at, kind: 'destination' },
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
