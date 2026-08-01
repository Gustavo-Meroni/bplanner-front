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
}