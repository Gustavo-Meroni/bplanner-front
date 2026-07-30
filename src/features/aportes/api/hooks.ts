import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { aportesServices } from './services';
import type { CreateAporteDto } from './types';

export const aportesKeys = {
  all: ['aportes'] as const,
  list: () => [...aportesKeys.all, 'list'] as const,
};

/**
 * ⚠️ All hooks are currently disabled (enabled: false).
 * The UI currently reads from useAppStore (Zustand local state).
 * Enable after NestJS API integration.
 */

export function useAportesQuery() {
  return useQuery({
    queryKey: aportesKeys.list(),
    queryFn: () => aportesServices.getAportes(),
    enabled: false, // TODO: enable after API integration
  });
}

export function useCreateAporteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateAporteDto) => aportesServices.createAporte(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aportesKeys.all });
      toast.success('Aporte adicionado ao cofre!');
    },
    onError: () => toast.error('Erro ao adicionar aporte.'),
  });
}

export function useDeleteAporteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => aportesServices.deleteAporte(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: aportesKeys.all });
      toast.success('Aporte removido.');
    },
    onError: () => toast.error('Erro ao remover aporte.'),
  });
}
