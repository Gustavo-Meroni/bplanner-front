// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Despesa {
  id: string;
  nome: string;
  valor: number;
  isPaga: boolean;
  /** Mês de referência, ex: "Ago/2026" */
  mes: string;
  profileId: string;
  categoryId: string;
}

export interface DespesaCategory {
  id: string;
  nome: string;
  despesas: Despesa[];
}

export interface DespesaProfile {
  id: string;
  nome: string;
  teto: number;
  categorias: DespesaCategory[];
}

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface CreateDespesaDto {
  nome: string;
  valor: number;
  mes: string;
  profileId: string;
  categoryId: string;
}

export interface UpdateDespesaDto {
  nome?: string;
  valor?: number;
  isPaga?: boolean;
}

export interface CreateCategoryDto {
  nome: string;
  profileId: string;
}

export interface UpdateCategoryDto {
  nome: string;
}
