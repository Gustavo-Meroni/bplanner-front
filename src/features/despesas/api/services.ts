import api from '@/shared/api/client';
import { Profile, CreateDespesaDto, UpdateDespesaDto, ItemDespesa, CreateCategoriaDto } from './types';

// Busca a estrutura de perfis e categorias filtrada por mês
export const getDespesasService = async (mes: string): Promise<Profile[]> => {
  const response = await api.get<Profile[]>('/despesas', {
    params: { mes },
  });
  return response.data;
};

// Criar novo item de despesa
export const createDespesaService = async (data: CreateDespesaDto): Promise<ItemDespesa> => {
  const response = await api.post<ItemDespesa>('/despesas', data);
  return response.data;
};

// Atualizar valor, nome ou status (checked) de uma despesa
export const updateDespesaService = async (id: string, data: UpdateDespesaDto): Promise<ItemDespesa> => {
  const response = await api.patch<ItemDespesa>(`/despesas/${id}`, data);
  return response.data;
};

// Excluir despesa
export const deleteDespesaService = async (id: string): Promise<void> => {
  await api.delete(`/despesas/${id}`);
};

// Alternar status de pago (check/uncheck)
export const toggleDespesaService = async (id: string, checked: boolean): Promise<ItemDespesa> => {
  const response = await api.patch<ItemDespesa>(`/despesas/${id}/toggle`, { checked });
  return response.data;
};

// Criar nova subcategoria num perfil
export const createCategoriaService = async (data: CreateCategoriaDto) => {
  const response = await api.post('/despesas/categorias', data);
  return response.data;
};

// Excluir subcategoria
export const deleteCategoriaService = async (id: string) => {
  await api.delete(`/despesas/categorias/${id}`);
};