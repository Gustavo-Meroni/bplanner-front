export interface DashboardResumo {
  mes: string;
  totalAportes: number;
  totalDespesas: number;
  totalDespesasPagas: number;
  totalDespesasPendentes: number;
  totalDespesasFixas: number;
  totalDespesasVariaveis: number;
  saldo: number;
  balancoPositivo: boolean;
  metaViagem: number;
}

export interface AporteChartPoint {
  name: string;
  acumulado: number;
}

export interface RecentPayment {
  id: string;
  name: string;
  value: number;
  profileName: string;
}