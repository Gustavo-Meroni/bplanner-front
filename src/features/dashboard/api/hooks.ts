import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDashboardResumoService, updateMetaService } from './services';

export const DASHBOARD_QUERY_KEY = ['dashboard'];

export const useDashboardQuery = (mes: string) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, mes],
    queryFn: () => getDashboardResumoService(mes),
    enabled: Boolean(mes),
  });
};

export const useUpdateMetaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (novaMeta: number) => updateMetaService(novaMeta),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DASHBOARD_QUERY_KEY });
    },
  });
};