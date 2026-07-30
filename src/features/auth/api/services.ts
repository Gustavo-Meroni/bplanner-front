import apiClient from '@/shared/api/client';
import type { LoginDto, RegisterDto, AuthResponse, ConviteInfo } from './types';

export const authServices = {
  /**
   * POST /auth/login
   * Autentica o usuário e retorna o token JWT.
   */
  login: (dto: LoginDto) =>
    apiClient.post<AuthResponse>('/auth/login', dto).then((r) => r.data),

  /**
   * POST /auth/register
   * Cria novo usuário (opcionalmente vinculado a um casal via convite).
   */
  register: (dto: RegisterDto) =>
    apiClient.post<AuthResponse>('/auth/register', dto).then((r) => r.data),

  /**
   * GET /auth/convite/:token
   * Valida um token de convite e retorna informações do casal.
   */
  validarConvite: (token: string) =>
    apiClient.get<ConviteInfo>(`/auth/convite/${token}`).then((r) => r.data),
};
