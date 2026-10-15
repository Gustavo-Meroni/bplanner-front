'use client';

import { useCallback, useEffect, useState } from 'react';
import type { BaseDoCusto, CategoriaCusto, Cidade, SituacaoDoCusto } from '@/features/viagens/api/types';
import { duracao } from '@/shared/utils/datas';

/** Item previsto no onboarding. Vira um custo com parcelas quando a viagem é criada. */
export interface ItemCusto {
  /** Só no navegador, para a lista ter chave estável */
  id: string;
  nome: string;
  categoria: CategoriaCusto;
  valorUnitarioCentavos: number;
  base: BaseDoCusto;
  situacao: SituacaoDoCusto;
  parcelas: number;
  parcelasPagas: number;
}

export interface Rascunho {
  paradas: Cidade[];
  origem: Cidade | null;
  dataIda: string;
  dataVolta: string;
  companhia: 'sozinho' | 'grupo';
  /** Contando quem está criando */
  pessoas: number;
  itens: ItemCusto[];
  metaCentavos: number;
  /** true quando o usuário digitou uma meta diferente da sugerida */
  metaEditada: boolean;
}

export const ITENS_SUGERIDOS: Array<Omit<ItemCusto, 'id'>> = [
  { nome: 'Passagem ida e volta', categoria: 'TRANSPORTE', valorUnitarioCentavos: 0, base: 'POR_PESSOA', situacao: 'A_PAGAR', parcelas: 2, parcelasPagas: 0 },
  { nome: 'Hospedagem', categoria: 'HOSPEDAGEM', valorUnitarioCentavos: 0, base: 'POR_NOITE', situacao: 'A_PAGAR', parcelas: 2, parcelasPagas: 0 },
  { nome: 'Passeios e atrações', categoria: 'PASSEIOS', valorUnitarioCentavos: 0, base: 'FIXO', situacao: 'A_PAGAR', parcelas: 2, parcelasPagas: 0 },
  { nome: 'Gasto do dia a dia', categoria: 'ALIMENTACAO', valorUnitarioCentavos: 0, base: 'POR_PESSOA_DIA', situacao: 'A_PAGAR', parcelas: 2, parcelasPagas: 0 },
];

export const novoId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());

export const RASCUNHO_VAZIO: Rascunho = {
  paradas: [],
  origem: null,
  dataIda: '',
  dataVolta: '',
  companhia: 'sozinho',
  pessoas: 1,
  itens: ITENS_SUGERIDOS.map((item) => ({ ...item, id: novoId() })),
  metaCentavos: 0,
  metaEditada: false,
};

/** Quantas vezes o valor do item se repete */
export function quantidadeDaBase(base: BaseDoCusto, r: Pick<Rascunho, 'pessoas' | 'dataIda' | 'dataVolta'>) {
  const { dias, noites } = r.dataIda && r.dataVolta ? duracao(r.dataIda, r.dataVolta) : { dias: 1, noites: 1 };
  const pessoas = Math.max(r.pessoas, 1);
  switch (base) {
    case 'POR_PESSOA':
      return pessoas;
    case 'POR_NOITE':
      return Math.max(noites, 1);
    case 'POR_DIA':
      return dias;
    case 'POR_PESSOA_DIA':
      return pessoas * dias;
    default:
      return 1;
  }
}

export function totalDoItem(item: ItemCusto, r: Rascunho) {
  return item.valorUnitarioCentavos * quantidadeDaBase(item.base, r);
}

/** Quanto do item ainda falta pagar (o que já foi pago fica fora da meta) */
export function aPagarDoItem(item: ItemCusto, r: Rascunho) {
  const total = totalDoItem(item, r);
  if (item.situacao === 'PAGO') return 0;
  if (item.situacao === 'PARCELADO') {
    const pagas = Math.min(item.parcelasPagas, item.parcelas);
    // A sobra de centavos vai na 1ª parcela, então o cálculo acompanha o do backend
    const base = Math.floor(total / item.parcelas);
    const sobra = total - base * item.parcelas;
    const jaPago = base * pagas + (pagas > 0 ? sobra : 0);
    return total - jaPago;
  }
  return total;
}

export function totaisDoRascunho(r: Rascunho) {
  const comValor = r.itens.filter((i) => i.valorUnitarioCentavos > 0);
  const total = comValor.reduce((s, i) => s + totalDoItem(i, r), 0);
  const aPagar = comValor.reduce((s, i) => s + aPagarDoItem(i, r), 0);
  return { total, aPagar, jaPago: total - aPagar, itens: comValor };
}

/** A meta nasce do que falta pagar, mas o usuário pode guardar mais do que isso */
export function metaFinal(r: Rascunho) {
  return r.metaEditada ? r.metaCentavos : totaisDoRascunho(r).aPagar;
}

/**
 * Rascunho do onboarding guardado no navegador: um F5 no meio do caminho
 * não apaga o que já foi preenchido.
 */
export function useRascunho(chave: string, inicial?: Partial<Rascunho>) {
  const [rascunho, setRascunho] = useState<Rascunho>({ ...RASCUNHO_VAZIO, ...inicial });
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(chave);
      if (salvo) {
        const guardado = JSON.parse(salvo) as Partial<Rascunho>;
        setRascunho({
          ...RASCUNHO_VAZIO,
          ...inicial,
          ...guardado,
          // rascunho antigo (antes da lista de itens) não tem itens
          itens: guardado.itens?.length ? guardado.itens : RASCUNHO_VAZIO.itens,
        });
      }
    } catch {
      // armazenamento indisponível: segue sem rascunho
    }
    setCarregado(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave]);

  useEffect(() => {
    if (!carregado) return;
    try {
      localStorage.setItem(chave, JSON.stringify(rascunho));
    } catch {
      // ignora
    }
  }, [chave, rascunho, carregado]);

  const atualizar = useCallback((parcial: Partial<Rascunho>) => setRascunho((r) => ({ ...r, ...parcial })), []);

  const limpar = useCallback(() => {
    try {
      localStorage.removeItem(chave);
    } catch {
      // ignora
    }
  }, [chave]);

  return { rascunho, atualizar, limpar, carregado };
}
