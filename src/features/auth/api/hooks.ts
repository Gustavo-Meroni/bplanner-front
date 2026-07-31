import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { loginService, registerService, validarConviteService } from './services';
import { CreateUsuarioDto, LoginDto } from './types';

// Helper para tratar mensagens de erro vindas do NestJS ValidationPipe
const getErrorMessage = (error: any): string => {
  const message = error?.response?.data?.message;
  if (Array.isArray(message)) {
    return message[0];
  }
  return message || 'Ocorreu um erro inesperado. Tente novamente.';
};

export const useLoginMutation = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginDto) => loginService(data),
    onSuccess: (data) => {
      const { access_token, usuario } = data;

      // 1. Salva no Zustand / localStorage
      setAuth(
        access_token,
        { id: usuario.id, nome: usuario.nome, email: usuario.email },
        { id: usuario.casal.id, nome: usuario.casal.nome }
      );

      // 2. Salva no Cookie (Para o Middleware do Next.js poder ler)
      document.cookie = `bplanner-token=${access_token}; path=/; max-age=604800`; // Expira em 7 dias

      toast.success(`Bem-vindo(a) de volta, ${usuario.nome}!`);
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// Hook de Registro
export const useRegisterMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateUsuarioDto) => registerService(data),
    onSuccess: () => {
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      router.push('/login');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

// Hook de Pré-visualização do Convite
export const useValidarConviteQuery = (codigo: string) => {
  const codigoLimpo = codigo?.trim()?.toUpperCase() || '';

  return useQuery({
    queryKey: ['validar-convite', codigoLimpo],
    queryFn: () => validarConviteService(codigoLimpo),
    enabled: codigoLimpo.length === 6,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });
};