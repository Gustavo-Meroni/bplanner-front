import api from '@/shared/api/client';
import type { Convite, SalvarViagemDto, ViagemResumo } from './types';

export const criarViagemService = (dto: SalvarViagemDto) =>
  api.post<ViagemResumo>('/viagens', dto).then((r) => r.data);

export const atualizarViagemService = (id: string, dto: Partial<SalvarViagemDto>) =>
  api.patch<ViagemResumo>(`/viagens/${id}`, dto).then((r) => r.data);

export const conviteDaViagemService = (id: string) =>
  api.get<Convite>(`/viagens/${id}/convite`).then((r) => r.data);
