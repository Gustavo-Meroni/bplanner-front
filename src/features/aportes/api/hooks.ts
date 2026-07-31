import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getAportesService, createAporteService, deleteAporteService } from './services';
import { CreateAporteDto } from './types';

export const APORTES_QUERY_KEY = ['aportes'];

// Busca todos os aportes do casal
export const useAportesQuery = () => {
  return useQuery({
    queryKey: APORTES_QUERY_KEY,
    queryFn: getAportesService,
  });
};

// Adiciona um novo aporte e invalida os caches de Aportes e Dashboard
export const useCreateAporteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAporteDto) => createAporteService(data),
    onSuccess: () => {
      toast.success('Aporte adicionado com sucesso!');
      queryClient.invalidateQueries({ queryKey: APORTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao cadastrar aporte. Verifique os dados.');
    },
  });
};

// Remove um aporte e invalida os caches
export const useDeleteAporteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAporteService(id),
    onSuccess: () => {
      toast.success('Aporte removido!');
      queryClient.invalidateQueries({ queryKey: APORTES_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => {
      toast.error('Erro ao excluir aporte.');
    },
  });
};