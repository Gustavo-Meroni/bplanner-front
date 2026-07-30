import apiClient from '@/shared/api/client';
import type { DashboardMetricsDTO } from './types';

export const dashboardServices = {
  /**
   * GET /dashboard?mes=Ago%2F2026
   * Returns aggregated metrics for the given month.
   */
  getMetrics: (mes: string) =>
    apiClient
      .get<DashboardMetricsDTO>('/dashboard', { params: { mes } })
      .then((r) => r.data),
};
