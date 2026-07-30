import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { despesasServices } from './services';
import type { CreateDespesaDto, UpdateDespesaDto } from './types';

export const despesasKeys = {
  all: ['despesas'] as const,
  profiles: () => [...despesasKeys.all, 'profiles'] as const,
  list: (mes: string) => [...despesasKeys.all, 'list', mes] as const,
};

/**
 * ⚠️ All hooks are currently disabled (enabled: false).
 * They will be activated once the NestJS API is integrated.
 * The UI currently reads from useAppStore (Zustand local state).
 */

export function useDespesasQuery(mes: string) {
  return useQuery({
    queryKey: despesasKeys.list(mes),
    queryFn: () => despesasServices.getDespesas(mes),
    enabled: false, // TODO: enable after API integration
  });
}

export function useCreateDespesaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateDespesaDto) => despesasServices.createDespesa(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: despesasKeys.all });
      toast.success('Despesa adicionada!');
    },
    onError: () => toast.error('Erro ao adicionar despesa.'),
  });
}

export function useUpdateDespesaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateDespesaDto }) =>
      despesasServices.updateDespesa(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: despesasKeys.all }),
    onError: () => toast.error('Erro ao atualizar despesa.'),
  });
}

export function useDeleteDespesaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => despesasServices.deleteDespesa(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: despesasKeys.all });
      toast.success('Despesa removida.');
    },
    onError: () => toast.error('Erro ao remover despesa.'),
  });
}

export function useTogglePayDespesaMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => despesasServices.togglePaga(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: despesasKeys.all }),
    onError: () => toast.error('Erro ao atualizar pagamento.'),
  });
}
