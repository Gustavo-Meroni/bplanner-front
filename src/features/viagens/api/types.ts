export type PapelParticipante = 'DONO' | 'MEMBRO';
export type TipoViagem = 'NACIONAL' | 'INTERNACIONAL';

/** Cidade escolhida na busca (destino ou origem) */
export interface Cidade {
  nome: string;
  regiao: string | null;
  pais: string | null;
  codigoPais: string | null;
  lat: number;
  lng: number;
  /** Código IATA do aeroporto que atende a cidade */
  aeroporto: string | null;
}

export interface Parada extends Cidade {
  id: string;
  ordem: number;
  chegada: string | null;
  saida: string | null;
}

export interface Origem {
  nome: string;
  lat: number;
  lng: number;
  aeroporto: string | null;
}

/** Viagem como aparece nas listas (/auth/me, /viagens) */
export interface ViagemResumo {
  id: string;
  nome: string;
  paradas: Parada[];
  tipo: TipoViagem | null;
  origem: Origem | null;
  dataIda: string | null;
  dataVolta: string | null;
  metaCentavos: number;
  estimativa: Record<string, unknown> | null;
  /** false = ainda precisa do onboarding (destino e datas) */
  configurada: boolean;
  papel: PapelParticipante;
}

export interface SalvarViagemDto {
  nome?: string;
  paradas: Array<Omit<Cidade, 'regiao' | 'pais' | 'codigoPais' | 'aeroporto'> & {
    regiao?: string;
    pais?: string;
    codigoPais?: string;
    aeroporto?: string;
  }>;
  origem?: { nome: string; lat: number; lng: number; aeroporto?: string };
  dataIda: string;
  dataVolta: string;
  metaCentavos: number;
  estimativa?: Record<string, unknown>;
}

export interface Convite {
  codigo: string;
  expiraEm: string | null;
  caminho: string;
}
