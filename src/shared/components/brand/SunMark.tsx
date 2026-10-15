import { cn } from '@/lib/utils';

interface SunMarkProps {
  size?: number;
  className?: string;
}

/** Marca do BPlanner: um Sol de Mayo simplificado (raios alternados). */
export function SunMark({ size = 28, className }: SunMarkProps) {
  const rays = Array.from({ length: 16 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 16;
    const inner = 9.5;
    const outer = i % 2 === 0 ? 15 : 12.5;
    return {
      x1: 16 + Math.cos(angle) * inner,
      y1: 16 + Math.sin(angle) * inner,
      x2: 16 + Math.cos(angle) * outer,
      y2: 16 + Math.sin(angle) * outer,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('text-sun', className)}
    >
      <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        {rays.map((r, i) => (
          <line key={i} x1={r.x1.toFixed(2)} y1={r.y1.toFixed(2)} x2={r.x2.toFixed(2)} y2={r.y2.toFixed(2)} />
        ))}
      </g>
      <circle cx="16" cy="16" r="6.5" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <SunMark size={30} />
      <span className="font-display text-xl tracking-tight text-foreground">BPlanner</span>
    </span>
  );
}
