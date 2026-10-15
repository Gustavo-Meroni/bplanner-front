'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * Cartão de embarque: canhoto (stub) à esquerda, conteúdo à direita,
 * separados por um picote. No celular o canhoto fica em cima.
 * Usado no login/cadastro e na página de convite.
 */
export function BoardingPassCard({
  stub,
  children,
  className,
  contentClassName,
}: {
  stub: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Classes do miolo do lado direito (largura, alinhamento) */
  contentClassName?: string;
}) {
  const reduce = useReducedMotion() ?? false;

  return (
    <main className="flex min-h-dvh items-center justify-center overflow-hidden p-3 sm:p-4">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative flex w-full max-w-[880px] flex-col overflow-hidden rounded-[24px] border border-border bg-card shadow-[0_40px_80px_-40px_hsl(var(--foreground)/0.35)] lg:min-h-[540px] lg:flex-row',
          className
        )}
      >
        {stub}
        <section className="relative flex flex-1 flex-col px-6 py-8 sm:px-10 lg:py-6">
          <Perforation />
          <div className={cn('mx-auto flex w-full max-w-sm flex-1 flex-col justify-center', contentClassName)}>
            {children}
          </div>
        </section>
      </motion.div>
    </main>
  );
}

/** Picote entre o canhoto e o cartão */
function Perforation() {
  const notch = 'absolute size-6 rounded-full border border-border bg-background';
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="lg:hidden">
        <div className="absolute inset-x-6 top-0 border-t-2 border-dashed border-border" />
        <div className={`${notch} -left-3 -top-3`} />
        <div className={`${notch} -right-3 -top-3`} />
      </div>
      <div className="hidden lg:block">
        <div className="absolute inset-y-6 left-0 border-l-2 border-dashed border-border" />
        <div className={`${notch} -left-3 -top-3`} />
        <div className={`${notch} -bottom-3 -left-3`} />
      </div>
    </div>
  );
}
