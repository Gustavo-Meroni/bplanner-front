import Link from 'next/link';
import type { Metadata } from 'next';
import { SunMark } from '@/shared/components/brand/SunMark';
import { buttonClasses } from '@/shared/components/ui/Button';

export const metadata: Metadata = {
  title: 'Página não encontrada',
};

export default function NotFound() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-border bg-card px-8 pb-8 pt-10 text-center shadow-[0_40px_80px_-40px_hsl(var(--foreground)/0.35)]">
        <SunMark size={44} className="mx-auto" />
        <p className="mt-6 font-display text-6xl leading-none text-foreground">404</p>
        <h1 className="mt-4 font-display text-2xl text-foreground">Voo não encontrado</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
          Essa página não existe ou mudou de endereço.
        </p>

        {/* picote do cartão de embarque */}
        <div aria-hidden="true" className="relative my-7">
          <div className="border-t-2 border-dashed border-border" />
          <div className="absolute -left-[46px] -top-3.5 size-7 rounded-full border border-border bg-background" />
          <div className="absolute -right-[46px] -top-3.5 size-7 rounded-full border border-border bg-background" />
        </div>

        <Link href="/dashboard" className={buttonClasses('primary', 'lg', 'w-full')}>
          Voltar para o painel
        </Link>
      </div>
    </main>
  );
}
