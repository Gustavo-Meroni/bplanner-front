'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { formatarCentavos } from '@/shared/utils/dinheiro';

/** Valor em reais que "conta" até o número novo quando ele muda */
export function ValorAnimado({ centavos, className }: { centavos: number; className?: string }) {
  const reduce = useReducedMotion() ?? false;
  const mola = useSpring(centavos, { stiffness: 90, damping: 20, mass: 0.6 });
  const texto = useTransform(mola, (v) => formatarCentavos(Math.round(v), { semCentavos: true }));

  useEffect(() => {
    if (reduce) mola.jump(centavos);
    else mola.set(centavos);
  }, [centavos, mola, reduce]);

  return (
    <motion.span className={className} aria-label={formatarCentavos(centavos, { semCentavos: true })}>
      {texto}
    </motion.span>
  );
}
