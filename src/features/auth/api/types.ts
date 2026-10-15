import type { AuthUser } from '@/shared/store/use-auth-store';
import type { ViagemResumo } from '@/features/viagens/api/types';

export interface LoginDto {
  email: string;
  senha: string;
}

export interface CreateUsuarioDto {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token: string;
  usuario: AuthUser;
}

/** GET /auth/me */
export interface Me extends AuthUser {
  viagens: ViagemResumo[];
}
