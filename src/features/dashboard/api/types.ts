// ─── Dashboard DTOs ───────────────────────────────────────────────────────────

export interface DashboardMetricsDTO {
  /** Total de aportes acumulados no cofre */
  totalEmCaixa: number;
  /** Meta de viagem definida pelo casal */
  tripGoal: number;
  /** Valor disponível para lazer (totalEmCaixa - tripGoal, mín. 0) */
  valorLazer: number;
  /** Total de despesas pagas no mês ativo */
  totalPagas: number;
  /** Total de despesas previstas no mês ativo */
  totalDevido: number;
  /** Série de aportes mensais para o gráfico */
  aportesChart: AporteChartPoint[];
  /** Últimos itens marcados como pagos */
  recentPayments: RecentPayment[];
}

export interface AporteChartPoint {
  /** Abreviação do mês, ex: "Ago" */
  name: string;
  acumulado: number;
}

export interface RecentPayment {
  id: string;
  name: string;
  value: number;
  profileName: string;
}
