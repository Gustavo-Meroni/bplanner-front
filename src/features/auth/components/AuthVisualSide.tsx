'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Plane } from 'lucide-react';
import { Wordmark } from '@/shared/components/brand/SunMark';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { WorldMap, type LatLng } from '@/shared/components/map/WorldMap';

const EASE = [0.22, 1, 0.36, 1] as const;
const CYCLE_MS = 4200;

const ORIGIN = { code: 'GRU', city: 'São Paulo', at: { lat: -23.43, lng: -46.47 } };

const DESTINATIONS: Array<{ code: string; city: string; at: LatLng }> = [
  { code: 'EZE', city: 'Buenos Aires', at: { lat: -34.82, lng: -58.54 } },
  { code: 'LIS', city: 'Lisboa', at: { lat: 38.77, lng: -9.13 } },
  { code: 'CUN', city: 'Cancún', at: { lat: 21.04, lng: -86.87 } },
  { code: 'CDG', city: 'Paris', at: { lat: 49.01, lng: 2.55 } },
  { code: 'SCL', city: 'Santiago', at: { lat: -33.39, lng: -70.79 } },
  { code: 'JFK', city: 'Nova York', at: { lat: 40.64, lng: -73.78 } },
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
        setIndex((i) => (i + 1) % DESTINATIONS.length);
      }
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  const dest = DESTINATIONS[index];

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
            <div>
              <p className="font-display text-4xl leading-none text-foreground sm:text-5xl">{ORIGIN.code}</p>
              <p className="mt-1.5 text-[13px] font-medium text-foreground/70">{ORIGIN.city}</p>
            </div>

            <div className="relative mb-8 flex-1 sm:mb-9" aria-hidden="true">
              <div className="h-0 border-t-2 border-dashed border-foreground/25" />
              <motion.div
                className="absolute inset-x-0 -top-px h-[2px] origin-left rounded-full bg-primary"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
              />
              <motion.span
                className="absolute top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card p-1.5 text-primary shadow-sm"
                initial={reduce ? false : { left: '0%' }}
                animate={{ left: '100%' }}
                transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
              >
                <Plane size={16} className="rotate-45" strokeWidth={2.25} />
              </motion.span>
            </div>

            <div className="relative min-w-[6.5rem] text-right" aria-live="off">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={dest.code}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <p className="font-display text-4xl leading-none text-foreground sm:text-5xl">{dest.code}</p>
                  <p className="mt-1.5 whitespace-nowrap text-[13px] font-medium text-foreground/70">
                    {dest.city}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <p className="mt-5 hidden max-w-[20rem] text-sm leading-relaxed text-foreground/75 sm:block">
            Planeje sua próxima viagem, sozinho ou com quem vai junto: o destino, a meta, o que já foi
            guardado e cada parcela até o embarque.
          </p>
        </div>
      </div>

      <div className="relative mt-2 h-[170px] sm:h-[210px] lg:mt-0 lg:h-auto lg:min-h-[230px] lg:flex-1">
        <WorldMap
          className="absolute inset-0 h-full w-full"
          viewBox={VIEWBOX}
          preserveAspectRatio="xMidYMax slice"
          parallax
          routes={DESTINATIONS.map((d, i) => ({
            id: d.code,
            from: ORIGIN.at,
            to: d.at,
            active: i === index,
          }))}
          pins={[
            { id: 'origin', at: ORIGIN.at, kind: 'origin' },
            { id: `dest-${dest.code}`, at: dest.at, kind: 'destination' },
          ]}
        />
      </div>
    </div>
  );
}
