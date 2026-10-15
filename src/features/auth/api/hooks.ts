import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mensagemDeErro } from '@/shared/api/client';
import { iniciarSessao } from '@/shared/auth/session';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { aceitarConviteService } from '@/features/convites/api/services';
import { loginService, meService, registerService } from './services';
import type { AuthResponse, CreateUsuarioDto, LoginDto, Me } from './types';

export const ME_KEY = ['me'] as const;

export function useMeQuery() {
  const token = useAuthStore((s) => s.token);
  return useQuery({ queryKey: ME_KEY, queryFn: meService, enabled: Boolean(token) });
}

/**
 * Decide para onde a pessoa vai depois de entrar:
 *  - sem viagens → onboarding
 *  - viagem ativa sem destino/datas → onboarding daquela viagem
 *  - caso contrário → painel
 */
export function rotaInicial(me: Me, viagemPreferida?: string | null): string {
  if (me.viagens.length === 0) return '/onboarding';

  const store = useAuthStore.getState();
  const ativa =
    me.viagens.find((v) => v.id === viagemPreferida) ??
    me.viagens.find((v) => v.id === store.viagemAtivaId) ??
    me.viagens.find((v) => v.configurada) ??
    me.viagens[0];

  store.setViagemAtiva(ativa.id);
  return ativa.configurada ? '/dashboard' : `/onboarding?viagem=${ativa.id}`;
}

/** Depois de login/cadastro: salva a sessão, aceita o convite (se houver) e redireciona */
function useAposAutenticar() {
  const router = useRouter();
  const qc = useQueryClient();

  return async (resposta: AuthResponse, convite?: string | null) => {
    iniciarSessao(resposta.access_token, resposta.usuario);

    let viagemDoConvite: string | null = null;
    if (convite) {
      try {
        viagemDoConvite = (await aceitarConviteService(convite)).viagemId;
        toast.success('Você entrou na viagem!');
      } catch (erro) {
        toast.error(mensagemDeErro(erro, 'Não foi possível usar esse convite.'));
      }
    }

    const me = await qc.fetchQuery({ queryKey: ME_KEY, queryFn: meService, staleTime: 0 });
    router.replace(rotaInicial(me, viagemDoConvite));
  };
}

export function useLoginMutation(convite?: string | null) {
  const aposAutenticar = useAposAutenticar();
  return useMutation({
    mutationFn: (data: LoginDto) => loginService(data),
    onSuccess: async (resposta) => {
      toast.success(`Que bom te ver, ${resposta.usuario.nome}!`);
      await aposAutenticar(resposta, convite);
    },
    onError: (erro) => toast.error(mensagemDeErro(erro)),
  });
}

export function useRegisterMutation(convite?: string | null) {
  const aposAutenticar = useAposAutenticar();
  return useMutation({
    mutationFn: (data: CreateUsuarioDto) => registerService(data),
    onSuccess: async (resposta) => {
      toast.success('Conta criada!');
      await aposAutenticar(resposta, convite);
    },
    onError: (erro) => toast.error(mensagemDeErro(erro)),
  });
}
