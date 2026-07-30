import apiClient from '@/shared/api/client';
import type { Casal, UpdateCasalDto } from './types';

export const casalServices = {
  /**
   * PATCH /auth/casal
   * Updates the authenticated casal's name.
   */
  updateCasal: (dto: UpdateCasalDto) =>
    apiClient.patch<Casal>('/auth/casal', dto).then((r) => r.data),
};
