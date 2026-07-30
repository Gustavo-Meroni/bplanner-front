import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { authServices } from './services';
import type { LoginDto, RegisterDto } from './types';

/**
 * Mutation for POST /auth/login
 * On success: stores auth data and navigates to /dashboard
 */
export function useLoginMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (dto: LoginDto) => authServices.login(dto),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user, data.casal);
      toast.success(`Bem-vindo de volta, ${data.user.nome}!`);
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('E-mail ou senha incorretos. Tente novamente.');
    },
  });
}

/**
 * Mutation for POST /auth/register
 * On success: stores auth data and navigates to /dashboard
 */
export function useRegisterMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (dto: RegisterDto) => authServices.register(dto),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user, data.casal);
      toast.success('Conta criada com sucesso!');
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Erro ao criar conta. Verifique os dados e tente novamente.');
    },
  });
}

/**
 * Query for GET /auth/convite/:token
 * Validates an invite token and returns casal info.
 */
export function useValidarConviteQuery(token: string) {
  return useQuery({
    queryKey: ['convite', token],
    queryFn: () => authServices.validarConvite(token),
    enabled: token.length > 6,
    retry: false,
  });
}
