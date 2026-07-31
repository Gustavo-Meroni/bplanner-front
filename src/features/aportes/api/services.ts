import api from '@/shared/api/client';
import type { Aporte, CreateAporteDto } from './types';

export const getAportesService = async (): Promise<Aporte[]> => {
  const response = await api.get<Aporte[]>('/aportes');
  return response.data;
};

export const createAporteService = async (data: CreateAporteDto): Promise<Aporte> => {
  const response = await api.post<Aporte>('/aportes', data);
  return response.data;
};

export const deleteAporteService = async (id: string): Promise<void> => {
  await api.delete(`/aportes/${id}`);
};