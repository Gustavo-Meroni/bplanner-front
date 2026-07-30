// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Aporte {
  id: string;
  descricao: string;
  valor: number;
  /** ISO date string */
  data: string;
  casalId: string;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateAporteDto {
  descricao: string;
  valor: number;
  /** Optional: defaults to current date on the server */
  data?: string;
}
