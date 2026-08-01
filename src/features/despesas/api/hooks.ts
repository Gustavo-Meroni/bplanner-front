import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getDespesasService,
  createDespesaService,
  updateDespesaService,
  deleteDespesaService,
  toggleDespesaService,
  createCategoriaService,
  deleteCategoriaService,
} from './services';
import { CreateDespesaDto, UpdateDespesaDto, CreateCategoriaDto } from './types';

export const DESPESAS_QUERY_KEY = ['despesas'];

// Hook para buscar os gastos do mês ativo
export const useDespesasQuery = (mes: string) => {
  return useQuery({
    queryKey: [...DESPESAS_QUERY_KEY, mes],
    queryFn: () => getDespesasService(mes),
    enabled: Boolean(mes),
  });
};

// Hook para criar item de despesa
export const useCreateDespesaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDespesaDto) => createDespesaService(data),
    onSuccess: () => {
      toast.success('Despesa adicionada!');
      queryClient.invalidateQueries({ queryKey: DESPESAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao adicionar despesa.');
    },
  });
};

// Hook para atualizar item (nome/valor)
export const useUpdateDespesaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDespesaDto }) =>
      updateDespesaService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESPESAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao atualizar despesa.');
    },
  });
};

// Hook para alternar o pago (Checkbox)
export const useToggleDespesaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, checked }: { id: string; checked: boolean }) =>
      toggleDespesaService(id, checked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESPESAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao alterar status de pagamento.');
    },
  });
};

// Hook para deletar despesa
export const useDeleteDespesaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDespesaService(id),
    onSuccess: () => {
      toast.success('Despesa removida!');
      queryClient.invalidateQueries({ queryKey: DESPESAS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao remover despesa.');
    },
  });
};

// Hooks de Subcategoria
export const useCreateCategoriaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoriaDto) => createCategoriaService(data),
    onSuccess: () => {
      toast.success('Subcategoria criada!');
      queryClient.invalidateQueries({ queryKey: DESPESAS_QUERY_KEY });
    },
  });
};

export const useDeleteCategoriaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategoriaService(id),
    onSuccess: () => {
      toast.success('Subcategoria removida!');
      queryClient.invalidateQueries({ queryKey: DESPESAS_QUERY_KEY });
    },
  });
};