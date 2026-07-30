import { useQuery } from '@tanstack/react-query';
import { dashboardServices } from './services';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  metrics: (mes: string) => [...dashboardKeys.all, 'metrics', mes] as const,
};

/**
 * Query for GET /dashboard?mes=...
 * ⚠️ Currently disabled (enabled: false) — local Zustand state is used instead.
 * Enable this once the NestJS API is ready.
 */
export function useDashboardQuery(mes: string) {
  return useQuery({
    queryKey: dashboardKeys.metrics(mes),
    queryFn: () => dashboardServices.getMetrics(mes),
    enabled: false, // TODO: set to `true` after API integration
  });
}
