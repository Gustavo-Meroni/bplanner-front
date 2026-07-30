import apiClient from '@/shared/api/client';
import type { Aporte, CreateAporteDto } from './types';

export const aportesServices = {
  /**
   * GET /aportes
   * Returns all trip contributions for the authenticated casal.
   */
  getAportes: () =>
    apiClient.get<Aporte[]>('/aportes').then((r) => r.data),

  /**
   * POST /aportes
   * Creates a new contribution.
   */
  createAporte: (dto: CreateAporteDto) =>
    apiClient.post<Aporte>('/aportes', dto).then((r) => r.data),

  /**
   * DELETE /aportes/:id
   * Removes a contribution.
   */
  deleteAporte: (id: string) =>
    apiClient.delete(`/aportes/${id}`),
};
