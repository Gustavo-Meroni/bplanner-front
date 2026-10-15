import api from '@/shared/api/client';
import type { AuthResponse, CreateUsuarioDto, LoginDto, Me } from './types';

export const loginService = (data: LoginDto) =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data);

export const registerService = (data: CreateUsuarioDto) =>
  api.post<AuthResponse>('/auth/registrar', data).then((r) => r.data);

export const meService = () => api.get<Me>('/auth/me').then((r) => r.data);
