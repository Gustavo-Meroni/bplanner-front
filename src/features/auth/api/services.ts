import api from '@/shared/api/client';
import {
  AuthResponse,
  CreateUsuarioDto,
  LoginDto,
  UsuarioInfo,
  ValidarConviteResponse,
} from './types';

export const loginService = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const registerService = async (data: CreateUsuarioDto): Promise<UsuarioInfo> => {
  const response = await api.post<UsuarioInfo>('/auth/registrar', data);
  return response.data;
};

export const validarConviteService = async (codigo: string): Promise<ValidarConviteResponse> => {
  const response = await api.get<ValidarConviteResponse>(`/auth/validar-convite/${codigo}`);
  return response.data;
};