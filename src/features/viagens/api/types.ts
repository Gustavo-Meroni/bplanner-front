export type PapelParticipante = 'DONO' | 'MEMBRO';

export interface Local {
  nome: string;
  lat: number;
  lng: number;
}

export interface Destino extends Local {
  regiao: string | null;
  pais: string | null;
  codigoPais: string | null;
}

/** Viagem como aparece nas listas (/auth/me, /viagens) */
export interface ViagemResumo {
  id: string;
  nome: string;
  destino: Destino | null;
  origem: Local | null;
  dataIda: string | null;
  dataVolta: string | null;
  metaCentavos: number;
  estimativa: Record<string, unknown> | null;
  /** false = ainda precisa do onboarding (destino e datas) */
  configurada: boolean;
  papel: PapelParticipante;
}
