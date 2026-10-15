'use client';

import { useEffect, useId, useMemo } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { LAND_ROWS, MAP_LAT_BOTTOM, MAP_LAT_TOP, MAP_STEP } from './world-dots';

/*
 * Mapa-múndi de pontos, sem dependências.
 * Projeção equirretangular: x = longitude, y = latitude, em escala linear.
 * Usado no login (rotas), no onboarding (pin do destino) e no painel (rota da viagem).
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapRoute {
  id: string;
  from: LatLng;
  to: LatLng;
  active?: boolean;
}

export interface MapPin {
  id: string;
  at: LatLng;
  /** "destination" usa a cor principal; "origin" é discreto */
  kind?: 'origin' | 'destination';
  /** Anel pulsando em volta (padrão: true para destino) */
  pulse?: boolean;
  /** Número exibido ao lado do pin (ordem no roteiro) */
  label?: string;
}

export const MAP_WIDTH = 1000;
const CELL = (MAP_WIDTH * MAP_STEP) / 360;
export const MAP_HEIGHT = ((MAP_LAT_TOP - MAP_LAT_BOTTOM) / MAP_STEP) * CELL;

export function project({ lat, lng }: LatLng) {
  return {
    x: ((lng + 180) / 360) * MAP_WIDTH,
    y: ((MAP_LAT_TOP - lat) / (MAP_LAT_TOP - MAP_LAT_BOTTOM)) * MAP_HEIGHT,
  };
}

/** Recorte do mapa centrado num ponto, sem sair das bordas */
export function viewBoxAround(at: LatLng, width = 520, height = 330): [number, number, number, number] {
  const { x, y } = project(at);
  const vx = Math.min(Math.max(x - width / 2, 0), MAP_WIDTH - width);
  const vy = Math.min(Math.max(y - height / 2, 0), MAP_HEIGHT - height);
  return [Math.round(vx), Math.round(vy), width, height];
}

/**
 * Recorte que enquadra todos os pontos com folga, na proporção do canhoto.
 * Sem pontos, mostra Américas, Atlântico, Europa e África.
 */
export function viewBoxForPoints(
  pontos: LatLng[],
  { aspecto = 520 / 330, folga = 70, minLargura = 300 } = {}
): [number, number, number, number] {
  if (pontos.length === 0) return [150, 30, 520, 330];
  const xy = pontos.map(project);
  let minX = Math.min(...xy.map((p) => p.x)) - folga;
  let maxX = Math.max(...xy.map((p) => p.x)) + folga;
  let minY = Math.min(...xy.map((p) => p.y)) - folga;
  let maxY = Math.max(...xy.map((p) => p.y)) + folga;

  let largura = Math.max(maxX - minX, minLargura);
  let altura = maxY - minY;
  if (largura / altura > aspecto) altura = largura / aspecto;
  else largura = altura * aspecto;
  largura = Math.min(largura, MAP_WIDTH);
  altura = Math.min(altura, MAP_HEIGHT);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const x = Math.min(Math.max(cx - largura / 2, 0), MAP_WIDTH - largura);
  const y = Math.min(Math.max(cy - altura / 2, 0), MAP_HEIGHT - altura);
  return [Math.round(x), Math.round(y), Math.round(largura), Math.round(altura)];
}

/** Arco curvado para cima entre dois pontos (curva quadrática). */
export function arcPath(from: LatLng, to: LatLng) {
  const a = project(from);
  const b = project(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1;
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const lift = Math.min(dist * 0.35, 120);
  const cx = mx + nx * lift;
  const cy = my + ny * lift;
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

interface WorldMapProps {
  routes?: MapRoute[];
  pins?: MapPin[];
  /** Recorte do mapa: [x, y, largura, altura] em unidades do mapa */
  viewBox?: [number, number, number, number];
  /** Parallax leve acompanhando o cursor */
  parallax?: boolean;
  /** Como o recorte se ajusta ao container (padrão: centralizado) */
  preserveAspectRatio?: string;
  className?: string;
}

export function WorldMap({
  routes = [],
  pins = [],
  viewBox,
  parallax = false,
  preserveAspectRatio = 'xMidYMid slice',
  className,
}: WorldMapProps) {
  const uid = useId().replace(/:/g, '');
  const reduce = useReducedMotion() ?? false;

  const landRects = useMemo(() => {
    const rects: Array<{ x: number; y: number; w: number }> = [];
    for (const [row, ...runs] of LAND_ROWS) {
      for (let i = 0; i < runs.length; i += 2) {
        rects.push({ x: runs[i] * CELL, y: (row - 0.5) * CELL, w: (runs[i + 1] - runs[i] + 1) * CELL });
      }
    }
    return rects;
  }, []);

  // Parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18, mass: 0.8 });
  const sy = useSpring(my, { stiffness: 40, damping: 18, mass: 0.8 });
  const tx = useTransform(sx, (v) => v * -14);
  const ty = useTransform(sy, (v) => v * -8);

  useEffect(() => {
    if (!parallax || reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [parallax, reduce, mx, my]);

  const vb = viewBox ?? [0, 0, MAP_WIDTH, MAP_HEIGHT];

  const vbTexto = vb.join(' ');

  return (
    // O recorte (viewBox) é animado: o mapa "viaja" até o novo enquadramento
    <motion.svg
      viewBox={vbTexto}
      initial={false}
      animate={{ viewBox: vbTexto }}
      transition={{ duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
      preserveAspectRatio={preserveAspectRatio}
      aria-hidden="true"
      className={className}
    >
      <defs>
        <pattern id={`dots-${uid}`} width={CELL} height={CELL} y={-CELL / 2} patternUnits="userSpaceOnUse">
          <circle cx={CELL / 2} cy={CELL / 2} r={CELL * 0.26} fill="hsl(var(--foreground) / 0.22)" />
        </pattern>
        <clipPath id={`land-${uid}`}>
          {landRects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={CELL} />
          ))}
        </clipPath>
      </defs>

      <motion.g style={parallax ? { x: tx, y: ty } : undefined}>
        <rect
          x={0}
          y={-CELL}
          width={MAP_WIDTH}
          height={MAP_HEIGHT + CELL * 2}
          fill={`url(#dots-${uid})`}
          clipPath={`url(#land-${uid})`}
        />

        {/* Rotas inativas: tracejado discreto */}
        {routes
          .filter((r) => !r.active)
          .map((r) => (
            <path
              key={r.id}
              d={arcPath(r.from, r.to)}
              fill="none"
              stroke="hsl(var(--foreground) / 0.14)"
              strokeWidth={1.4}
              strokeDasharray="3 5"
              strokeLinecap="round"
            />
          ))}

        {/* Rota ativa: desenhada na cor principal */}
        <AnimatePresence>
          {routes
            .filter((r) => r.active)
            .map((r) => (
              <motion.path
                key={r.id}
                d={arcPath(r.from, r.to)}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={reduce ? false : { pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
        </AnimatePresence>

        {pins.map((pin) => {
          const p = project(pin.at);
          const isDest = pin.kind !== 'origin';
          const pulsar = pin.pulse ?? isDest;
          return (
            <g key={pin.id} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
              {pulsar && !reduce && (
                <motion.circle
                  r={6}
                  fill="hsl(var(--primary) / 0.35)"
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 2.6, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              <motion.circle
                r={isDest ? 5.5 : 4}
                fill={isDest ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
                stroke="hsl(var(--card))"
                strokeWidth={2}
                initial={reduce || !isDest ? false : { scale: 0, y: -14 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18, delay: isDest ? 0.9 : 0 }}
              />
              {pin.label && (
                <text
                  x={9}
                  y={-8}
                  fontSize={11}
                  fontWeight={700}
                  fill="hsl(var(--foreground))"
                  stroke="hsl(var(--card))"
                  strokeWidth={3}
                  paintOrder="stroke"
                >
                  {pin.label}
                </text>
              )}
            </g>
          );
        })}
      </motion.g>
    </motion.svg>
  );
}
