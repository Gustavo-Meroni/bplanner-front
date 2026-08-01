import api from '@/shared/api/client';
import type { Aporte, CreateAportePayload } from './types';

export const getAportes = async (): Promise<Aporte[]> => {
  const response = await api.get('/aportes');
  return response.data;
};

export const createAporte = async (data: CreateAportePayload): Promise<Aporte> => {
  const response = await api.post('/aportes', data);
  return response.data;
};

export const deleteAporte = async (id: string): Promise<void> => {
  await api.delete(`/aportes/${id}`);
};