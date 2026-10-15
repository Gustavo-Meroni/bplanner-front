import { useAuthStore, type AuthUser } from '@/shared/store/use-auth-store';

/** Cookie lido pelo middleware do Next para proteger as rotas */
export const COOKIE_TOKEN = 'bplanner-token';
const SETE_DIAS = 60 * 60 * 24 * 7;

/** Store e cookie sempre andam juntos: um sem o outro gera loop de redirecionamento */
export function iniciarSessao(token: string, user: AuthUser) {
  useAuthStore.getState().setSessao(token, user);
  document.cookie = `${COOKIE_TOKEN}=${token}; path=/; max-age=${SETE_DIAS}; samesite=lax`;
}

export function encerrarSessao() {
  useAuthStore.getState().limpar();
  document.cookie = `${COOKIE_TOKEN}=; path=/; max-age=0; samesite=lax`;
}
