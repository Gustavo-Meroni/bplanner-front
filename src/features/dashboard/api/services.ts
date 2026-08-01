import api from '@/shared/api/client';
import type { DashboardResumo } from './types';

export const getDashboardResumoService = async (mes: string): Promise<DashboardResumo> => {
  const response = await api.get<DashboardResumo>('/dashboard/resumo', {
    params: { mes },
  });
  return response.data;
};

export const updateMetaService = async (metaViagem: number): Promise<void> => {
  await api.patch('/dashboard/meta', { metaViagem });
};