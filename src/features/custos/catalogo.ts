import type { BaseDoCusto, CategoriaCusto, TipoTransporte } from '@/features/viagens/api/types';

/**
 * Catálogo de gastos de viagem.
 *
 * Existe porque quem planeja nem sempre sabe o que vai gastar: em vez de um
 * campo em branco, a pessoa escolhe de uma lista. Cada tipo já sabe como o
 * valor dele costuma ser contado (por pessoa, por noite...), o que evita
 * absurdo como "passagem aérea por noite".
 */
export interface TipoDeGasto {
  chave: string;
  nome: string;
  categoria: CategoriaCusto;
  /** Como o valor costuma ser contado */
  base: BaseDoCusto;
  /** Outras bases que fazem sentido para esse gasto */
  basesAceitas: BaseDoCusto[];
  /** Transportes em que ele costuma aparecer; vazio = aparece sempre */
  transportes?: TipoTransporte[];
  /** Só sugerido quando a viagem sai do país */
  somenteInternacional?: boolean;
}

export interface GrupoDeGastos {
  titulo: string;
  itens: TipoDeGasto[];
}

const g = (
  chave: string,
  nome: string,
  categoria: CategoriaCusto,
  base: BaseDoCusto,
  basesAceitas: BaseDoCusto[] = [],
  extra: Partial<TipoDeGasto> = {},
): TipoDeGasto => ({ chave, nome, categoria, base, basesAceitas: [base, ...basesAceitas], ...extra });

export const CATALOGO: GrupoDeGastos[] = [
  {
    titulo: 'Transporte',
    itens: [
      g('passagem-aerea', 'Passagem aérea', 'TRANSPORTE', 'POR_PESSOA', ['FIXO'], { transportes: ['AVIAO'] }),
      g('passagem-onibus', 'Passagem de ônibus', 'TRANSPORTE', 'POR_PESSOA', ['FIXO'], { transportes: ['ONIBUS'] }),
      g('combustivel', 'Combustível', 'TRANSPORTE', 'FIXO', ['POR_DIA'], { transportes: ['CARRO'] }),
      g('pedagio', 'Pedágio', 'TRANSPORTE', 'FIXO', [], { transportes: ['CARRO'] }),
      g('aluguel-carro', 'Aluguel de carro', 'TRANSPORTE', 'POR_DIA', ['FIXO']),
      g('estacionamento', 'Estacionamento', 'TRANSPORTE', 'POR_DIA', ['FIXO']),
      g('transporte-local', 'Transporte no destino', 'TRANSPORTE', 'POR_PESSOA_DIA', ['POR_DIA', 'FIXO']),
      g('bagagem', 'Bagagem despachada', 'TRANSPORTE', 'POR_PESSOA', ['FIXO'], { transportes: ['AVIAO'] }),
    ],
  },
  {
    titulo: 'Hospedagem',
    itens: [
      g('hotel', 'Hotel', 'HOSPEDAGEM', 'POR_NOITE', ['FIXO']),
      g('airbnb', 'Airbnb ou casa alugada', 'HOSPEDAGEM', 'POR_NOITE', ['FIXO']),
      g('hostel', 'Hostel', 'HOSPEDAGEM', 'POR_PESSOA_NOITE', ['POR_NOITE', 'FIXO']),
      g('camping', 'Camping', 'HOSPEDAGEM', 'POR_NOITE', ['FIXO']),
    ],
  },
  {
    titulo: 'Alimentação',
    itens: [
      g('mercado', 'Mercado', 'ALIMENTACAO', 'FIXO', ['POR_DIA']),
      g('restaurantes', 'Restaurantes', 'ALIMENTACAO', 'POR_PESSOA_DIA', ['POR_DIA', 'FIXO']),
    ],
  },
  {
    titulo: 'Passeios',
    itens: [
      g('passeios', 'Passeios e atrações', 'PASSEIOS', 'POR_PESSOA', ['FIXO']),
      g('ingressos', 'Ingressos (shows, jogos)', 'PASSEIOS', 'POR_PESSOA', ['FIXO']),
      g('compras', 'Compras e lembranças', 'COMPRAS', 'POR_PESSOA', ['FIXO']),
    ],
  },
  {
    titulo: 'Extras',
    itens: [
      g('seguro', 'Seguro viagem', 'SEGURO', 'POR_PESSOA', ['FIXO'], { somenteInternacional: true }),
      g('documentos', 'Documentos (passaporte, visto)', 'DOCUMENTOS', 'POR_PESSOA', ['FIXO'], { somenteInternacional: true }),
      g('chip', 'Chip de internet', 'OUTROS', 'POR_PESSOA', ['FIXO'], { somenteInternacional: true }),
      g('cambio', 'Câmbio / dinheiro em espécie', 'OUTROS', 'FIXO', [], { somenteInternacional: true }),
      g('vacinas', 'Vacinas', 'DOCUMENTOS', 'POR_PESSOA', ['FIXO'], { somenteInternacional: true }),
      g('pet', 'Hospedagem do pet', 'OUTROS', 'FIXO', ['POR_DIA']),
    ],
  },
];

export const TODOS_OS_GASTOS = CATALOGO.flatMap((grupo) => grupo.itens);

export function buscarTipo(chave: string) {
  return TODOS_OS_GASTOS.find((t) => t.chave === chave) ?? null;
}

/**
 * Quais gastos sugerir. São só sugestões: a tela sempre deixa ver o catálogo
 * inteiro, porque quem vai de avião também pode alugar carro e pagar pedágio.
 */
export function sugestoes(transporte: TipoTransporte | null, internacional: boolean): string[] {
  return TODOS_OS_GASTOS.filter((t) => {
    if (t.somenteInternacional && !internacional) return false;
    if (t.transportes && (!transporte || !t.transportes.includes(transporte))) return false;
    return true;
  })
    .filter((t) => PADRAO.includes(t.chave) || Boolean(t.transportes) || Boolean(t.somenteInternacional))
    .map((t) => t.chave);
}

/** Gastos que quase toda viagem tem, independente de como se chega lá */
const PADRAO = ['hotel', 'mercado', 'restaurantes', 'passeios', 'transporte-local'];
