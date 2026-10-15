export type PapelParticipante = 'DONO' | 'MEMBRO';
export type TipoViagem = 'NACIONAL' | 'INTERNACIONAL';

export type TipoDeLugar = 'cidade' | 'bairro' | 'regiao' | 'pais' | 'lugar';

/** Lugar escolhido na busca: cidade ou bairro (destino ou origem) */
export interface Cidade {
  nome: string;
  /** Onde fica, para diferenciar homônimos: "Buenos Aires, Argentina" */
  contexto: string | null;
  tipo: TipoDeLugar;
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
  pessoas?: number;
  custos?: ItemCustoDto[];
  estimativa?: Record<string, unknown>;
}

/** Como o valor de um item se multiplica para virar o total */
export type BaseDoCusto = 'FIXO' | 'POR_PESSOA' | 'POR_NOITE' | 'POR_DIA' | 'POR_PESSOA_DIA';
export type SituacaoDoCusto = 'A_PAGAR' | 'PAGO' | 'PARCELADO';
export type CategoriaCusto =
  | 'TRANSPORTE'
  | 'HOSPEDAGEM'
  | 'ALIMENTACAO'
  | 'PASSEIOS'
  | 'COMPRAS'
  | 'SEGURO'
  | 'DOCUMENTOS'
  | 'OUTROS';

/** Item previsto no onboarding; vira um custo com parcelas */
export interface ItemCustoDto {
  nome: string;
  categoria?: CategoriaCusto;
  valorUnitarioCentavos: number;
  base: BaseDoCusto;
  situacao: SituacaoDoCusto;
  parcelas?: number;
  parcelasPagas?: number;
  primeiroVencimento?: string;
}

export interface Aeroporto {
  iata: string;
  nome: string;
  cidade: string;
  codigoPais: string;
  distanciaKm: number;
}

export interface Convite {
  codigo: string;
  expiraEm: string | null;
  caminho: string;
}
