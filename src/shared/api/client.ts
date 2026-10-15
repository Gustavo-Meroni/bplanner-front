import axios from 'axios';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { encerrarSessao } from '@/shared/auth/session';

/** Instância do Axios apontando para a API NestJS */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? useAuthStore.getState().token : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Rotas em que 401 é resposta normal (ex.: senha errada) e não sessão expirada
const ROTAS_DE_LOGIN = ['/auth/login', '/auth/registrar'];

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    const sessaoExpirada =
      error.response?.status === 401 && !ROTAS_DE_LOGIN.some((rota) => url.startsWith(rota));

    if (sessaoExpirada && typeof window !== 'undefined') {
      encerrarSessao();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/** Mensagem de erro amigável vinda do NestJS (string ou lista do ValidationPipe) */
export function mensagemDeErro(error: unknown, padrao = 'Algo deu errado. Tente de novo.'): string {
  const message = (error as { response?: { data?: { message?: unknown } } })?.response?.data?.message;
  if (Array.isArray(message)) return String(message[0]);
  if (typeof message === 'string') return message;
  return padrao;
}

export default apiClient;
