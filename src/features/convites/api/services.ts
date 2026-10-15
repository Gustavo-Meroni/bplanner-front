import api from '@/shared/api/client';
import type { ConvitePrevia } from './types';

const normalizar = (codigo: string) => encodeURIComponent(codigo.trim().toUpperCase());

export const previaConviteService = (codigo: string) =>
  api.get<ConvitePrevia>(`/convites/${normalizar(codigo)}`).then((r) => r.data);

export const aceitarConviteService = (codigo: string) =>
  api.post<{ viagemId: string }>(`/convites/${normalizar(codigo)}/aceitar`).then((r) => r.data);
