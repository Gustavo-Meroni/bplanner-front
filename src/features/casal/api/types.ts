// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface Casal {
  id: string;
  nome: string;
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface UpdateCasalDto {
  nome: string;
}
