import api from '@/shared/api/client';
import { DashboardResumo } from './types';

export const getDashboardResumoService = async (mes: string): Promise<DashboardResumo> => {
  const response = await api.get<DashboardResumo>('/dashboard/resumo', {
    params: { mes },
  });
  return response.data;
};