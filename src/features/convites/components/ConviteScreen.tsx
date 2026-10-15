'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { toast } from 'sonner';
import { BoardingPassCard } from '@/shared/components/brand/BoardingPass';
import { Wordmark } from '@/shared/components/brand/SunMark';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { WorldMap, viewBoxForPoints, type MapRoute } from '@/shared/components/map/WorldMap';
import { Button, buttonClasses } from '@/shared/components/ui/Button';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { useHydrated } from '@/shared/hooks/use-hydrated';
import { mensagemDeErro } from '@/shared/api/client';
import { ME_KEY, rotaInicial } from '@/features/auth/api/hooks';
import { meService } from '@/features/auth/api/services';
import { useConvitePreviaQuery } from '../api/hooks';
import { aceitarConviteService } from '../api/services';
import type { ConvitePrevia } from '../api/types';

const formatoData = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
const formatarData = (iso: string) => formatoData.format(new Date(`${iso}T00:00:00Z`)).replace('.', '');

export function ConviteScreen({ codigo }: { codigo: string }) {
  const { data: convite, isLoading, isError } = useConvitePreviaQuery(codigo);

  return (
    <BoardingPassCard stub={<Canhoto convite={convite} />}>
      {isLoading ? (
        <Carregando />
      ) : isError || !convite ? (
        <ConviteInvalido />
      ) : (
        <Acoes convite={convite} codigo={codigo} />
      )}
    </BoardingPassCard>
  );
}

/** Lado esquerdo: destino no mapa, datas e quem já está na viagem */
function Canhoto({ convite }: { convite?: ConvitePrevia }) {
  const v = convite?.viagem;
  const paradas = v?.paradas ?? [];
  const pontos = paradas.map((p) => ({ lat: p.lat, lng: p.lng }));
  const rotas: MapRoute[] = pontos.slice(1).map((p, i) => ({ id: `r${i}`, from: pontos[i], to: p, active: true }));
  const paises = [...new Set(paradas.map((p) => p.pais).filter(Boolean))];

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

        {convite && (
          <div className="mt-7 animate-in fade-in slide-in-from-bottom-2 duration-500 sm:mt-10">
            <p className="text-sm font-medium text-foreground/70">
              {convite.convidadoPor ? `${convite.convidadoPor} te convidou para` : 'Você foi convidado para'}
            </p>
            <h1 className="mt-1 font-display text-4xl leading-none text-foreground sm:text-5xl">
              {paradas.length ? paradas.map((p) => p.nome).join(' → ') : v!.nome}
            </h1>

            <dl className="mt-5 space-y-2 text-sm text-foreground/80">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-primary" />
                <dd>{paises.length ? paises.join(', ') : 'Destino ainda a definir'}</dd>
              </div>
              {v!.dataIda && (
                <div className="flex items-center gap-2">
                  <CalendarDays size={15} className="text-primary" />
                  <dd>
                    {formatarData(v!.dataIda)}
                    {v!.dataVolta && ` até ${formatarData(v!.dataVolta)}`}
                  </dd>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users size={15} className="text-primary" />
                <dd>{convite.participantes.join(', ')}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      <div className="relative mt-2 h-[170px] sm:h-[210px] lg:mt-0 lg:h-auto lg:min-h-[230px] lg:flex-1">
        <WorldMap
          className="map-fade-top absolute inset-0 h-full w-full"
          viewBox={viewBoxForPoints(pontos)}
          parallax
          routes={rotas}
          pins={pontos.map((at, i) => ({ id: `p${i}`, at, kind: 'destination' as const, pulse: i === pontos.length - 1 }))}
        />
      </div>
    </div>
  );
}

/** Lado direito: entrar direto (logado) ou ir para login/cadastro levando o código */
function Acoes({ convite, codigo }: { convite: ConvitePrevia; codigo: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const hidratado = useHydrated();
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logado = hidratado && Boolean(token);

  const aceitar = useMutation({
    mutationFn: () => aceitarConviteService(codigo),
    onSuccess: async ({ viagemId }) => {
      toast.success('Você entrou na viagem!');
      const me = await qc.fetchQuery({ queryKey: ME_KEY, queryFn: meService, staleTime: 0 });
      router.replace(rotaInicial(me, viagemId));
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível entrar na viagem.')),
  });

  const destino = convite.viagem.paradas[0]?.nome ?? convite.viagem.nome;
  const query = `?convite=${encodeURIComponent(codigo)}`;

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">
        Bora pra {destino}?
      </h2>

      {logado ? (
        <>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Você vai ver a meta, o que já foi guardado e os custos da viagem, e pode registrar os seus.
          </p>
          <Button
            size="lg"
            className="mt-6 w-full"
            isLoading={aceitar.isPending || aceitar.isSuccess}
            onClick={() => aceitar.mutate()}
          >
            Entrar na viagem
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Entrando como <strong className="font-semibold text-foreground">{user?.nome}</strong>.
          </p>
        </>
      ) : (
        <>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Crie sua conta ou entre para participar. Você já cai direto na viagem.
          </p>
          <div className="mt-6 space-y-2.5">
            <Link href={`/registrar${query}`} className={buttonClasses('primary', 'lg', 'w-full')}>
              Criar conta e entrar
            </Link>
            <Link href={`/login${query}`} className={buttonClasses('outline', 'lg', 'w-full')}>
              Já tenho conta
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function ConviteInvalido() {
  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">Convite indisponível</h2>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        Esse link não existe mais ou foi trocado por um novo. Peça o link atualizado para quem te convidou.
      </p>
      <Link href="/login" className={buttonClasses('outline', 'lg', 'mt-6 w-full')}>
        Ir para o login
      </Link>
    </div>
  );
}

function Carregando() {
  return (
    <div aria-busy="true" aria-label="Carregando convite" className="space-y-3">
      <div className="h-8 w-3/4 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-full animate-pulse rounded bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
      <div className="mt-6 h-11 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  );
}
