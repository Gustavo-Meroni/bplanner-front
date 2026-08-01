import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAportes, createAporte, deleteAporte } from './services';
import type { CreateAportePayload } from './types';

export const APORTES_QUERY_KEY = ['aportes'];

export const useAportesQuery = () => {
  return useQuery({
    queryKey: APORTES_QUERY_KEY,
    queryFn: getAportes,
  });
};

export const useCreateAporteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAportePayload) => createAporte(data),
    onSuccess: () => {
      // Força a atualização da lista de aportes e do dashboard
      queryClient.invalidateQueries({ queryKey: APORTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useDeleteAporteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAporte(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: APORTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};