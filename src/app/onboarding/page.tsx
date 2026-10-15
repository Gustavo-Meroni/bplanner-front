'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Wordmark } from '@/shared/components/brand/SunMark';
import { Button } from '@/shared/components/ui/Button';
import { encerrarSessao } from '@/shared/auth/session';
import { useMeQuery } from '@/features/auth/api/hooks';

/** Provisório: o onboarding com mapa entra na fase 3 */
export default function OnboardingPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: me } = useMeQuery();

  return (
    <main className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[24px] border border-border bg-card p-8 text-center">
        <Wordmark className="justify-center" />
        <h1 className="mt-6 font-display text-2xl text-foreground">Olá{me ? `, ${me.nome}` : ''}!</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Aqui vai entrar o onboarding: destino no mapa, datas, quem vai e a meta.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            encerrarSessao();
            qc.clear();
            router.replace('/login');
          }}
        >
          Sair
        </Button>
      </div>
    </main>
  );
}
