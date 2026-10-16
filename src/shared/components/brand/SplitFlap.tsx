'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Texto no estilo painel de partidas (split-flap): cada letra que muda
 * "vira" como uma plaquinha, em sequência. Letras iguais não viram.
 *
 * As letras são agrupadas por palavra: assim "BUENOS AIRES" quebra só no
 * espaço, nunca no meio da palavra, e o alinhamento vem do text-align do
 * elemento pai (não de flex), para a quebra de linha funcionar.
 */
export function SplitFlap({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion() ?? false;
  const palavras = text.split(' ');
  let posicao = 0;

  return (
    <span className={cn('inline', className)} style={{ perspective: 600 }} aria-label={text} role="text">
      {palavras.map((palavra, p) => {
        const letras = palavra.split('').map((letra) => ({ letra, i: posicao++ }));
        posicao++; // o espaço também conta no ritmo da animação
        return (
          <span key={p}>
            {p > 0 && ' '}
            <span className="inline-flex whitespace-nowrap align-baseline">
              {letras.map(({ letra, i }) => (
                <span key={i} aria-hidden="true" className="relative inline-block">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={letra}
                      className="inline-block [backface-visibility:hidden]"
                      style={{ transformOrigin: '50% 50%' }}
                      initial={reduce ? false : { rotateX: -90, opacity: 0 }}
                      animate={{ rotateX: 0, opacity: 1 }}
                      exit={reduce ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
                      transition={{ duration: 0.28, delay: delay + i * 0.08, ease: [0.3, 0.7, 0.4, 1] }}
                    >
                      {letra}
                    </motion.span>
                  </AnimatePresence>
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
