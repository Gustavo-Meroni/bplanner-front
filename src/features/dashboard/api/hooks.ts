import { useQuery } from '@tanstack/react-query';
import { getDashboardResumoService } from './services';

export const DASHBOARD_QUERY_KEY = ['dashboard'];

export const useDashboardQuery = (mes: string) => {
  return useQuery({
    queryKey: [...DASHBOARD_QUERY_KEY, mes],
    queryFn: () => getDashboardResumoService(mes),
    enabled: Boolean(mes),
  });
};