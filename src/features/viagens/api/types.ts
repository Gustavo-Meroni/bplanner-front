export type PapelParticipante = 'DONO' | 'MEMBRO';
export type TipoViagem = 'NACIONAL' | 'INTERNACIONAL';

export type TipoDeLugar = 'cidade' | 'bairro' | 'regiao' | 'pais' | 'lugar';
export type TipoTransporte = 'AVIAO' | 'CARRO' | 'ONIBUS' | 'OUTRO';

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
  transporte: TipoTransporte | null;
  estimativa: Record<string, unknown> | null;
  /** false = ainda precisa do onboarding (destino e datas) */
  configurada: boolean;
  papel: PapelParticipante;
}

export interface SalvarViagemDto {
  nome?: string;
  paradas: Array<Omit<Cidade, 'regiao' | 'pais' | 'codigoPais'> & {
    regiao?: string;
    pais?: string;
    codigoPais?: string;
  }>;
  origem?: { nome: string; lat: number; lng: number };
  transporte?: TipoTransporte | null;
  dataIda: string;
  dataVolta: string;
  /** Estimativa opcional de quanto a viagem custa no total */
  metaCentavos?: number;
  /** Dinheiro já guardado, vira o primeiro aporte */
  aporteInicialCentavos?: number;
  pessoas?: number;
  custos?: ItemCustoDto[];
  estimativa?: Record<string, unknown>;
}

/** Como o valor de um item se multiplica para virar o total */
export type BaseDoCusto =
  | 'FIXO'
  | 'POR_PESSOA'
  | 'POR_NOITE'
  | 'POR_DIA'
  | 'POR_PESSOA_DIA'
  | 'POR_PESSOA_NOITE';
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
  /** Ausente ou zero = previsto no onboarding, ainda sem valor */
  valorUnitarioCentavos?: number;
  base?: BaseDoCusto;
  situacao?: SituacaoDoCusto;
  parcelas?: number;
  parcelasPagas?: number;
  primeiroVencimento?: string;
}



export interface Convite {
  codigo: string;
  expiraEm: string | null;
  caminho: string;
}
