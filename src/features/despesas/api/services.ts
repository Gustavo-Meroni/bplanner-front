import apiClient from '@/shared/api/client';
import type {
  Despesa,
  DespesaProfile,
  CreateDespesaDto,
  UpdateDespesaDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from './types';

export const despesasServices = {
  // ── Profiles ──

  getProfiles: () =>
    apiClient.get<DespesaProfile[]>('/despesas/profiles').then((r) => r.data),

  // ── Despesas ──

  getDespesas: (mes: string) =>
    apiClient.get<Despesa[]>('/despesas', { params: { mes } }).then((r) => r.data),

  createDespesa: (dto: CreateDespesaDto) =>
    apiClient.post<Despesa>('/despesas', dto).then((r) => r.data),

  updateDespesa: (id: string, dto: UpdateDespesaDto) =>
    apiClient.patch<Despesa>(`/despesas/${id}`, dto).then((r) => r.data),

  deleteDespesa: (id: string) =>
    apiClient.delete(`/despesas/${id}`),

  togglePaga: (id: string) =>
    apiClient.patch<Despesa>(`/despesas/${id}/toggle-paga`).then((r) => r.data),

  // ── Categories ──

  createCategory: (dto: CreateCategoryDto) =>
    apiClient.post<{ id: string; nome: string }>('/despesas/categorias', dto).then((r) => r.data),

  updateCategory: (id: string, dto: UpdateCategoryDto) =>
    apiClient.patch(`/despesas/categorias/${id}`, dto),

  deleteCategory: (id: string) =>
    apiClient.delete(`/despesas/categorias/${id}`),
};
