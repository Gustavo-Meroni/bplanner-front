'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  BaseDoCusto,
  CategoriaCusto,
  Cidade,
  TipoTransporte,
} from '@/features/viagens/api/types';
import { buscarTipo } from '@/features/custos/catalogo';

/**
 * Gasto escolhido no catálogo durante o onboarding. Aqui ele ainda não tem
 * valor: vira um custo "previsto" que a tela de custos preenche depois.
 */
export interface GastoEscolhido {
  /** Chave do catálogo, ou um id local quando é um gasto digitado */
  id: string;
  nome: string;
  categoria: CategoriaCusto;
  base: BaseDoCusto;
}

export interface Rascunho {
  paradas: Cidade[];
  origem: Cidade | null;
  transporte: TipoTransporte | null;
  dataIda: string;
  dataVolta: string;
  companhia: 'sozinho' | 'grupo';
  /** Quantas pessoas viajam, contando quem está criando */
  pessoas: number;
  gastos: GastoEscolhido[];
  /** Opcionais: a pessoa pode deixar para preencher depois */
  estimativaTotalCentavos: number;
  jaGuardadoCentavos: number;
}

export const RASCUNHO_VAZIO: Rascunho = {
  paradas: [],
  origem: null,
  transporte: null,
  dataIda: '',
  dataVolta: '',
  companhia: 'sozinho',
  pessoas: 1,
  gastos: [],
  estimativaTotalCentavos: 0,
  jaGuardadoCentavos: 0,
};

export const novoId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());

/** Monta o gasto a partir do catálogo */
export function gastoDoCatalogo(chave: string): GastoEscolhido | null {
  const tipo = buscarTipo(chave);
  return tipo ? { id: tipo.chave, nome: tipo.nome, categoria: tipo.categoria, base: tipo.base } : null;
}

export function viagemInternacional(r: Rascunho) {
  return r.paradas.some((p) => p.codigoPais && p.codigoPais.toUpperCase() !== 'BR');
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
        setRascunho({ ...RASCUNHO_VAZIO, ...inicial, ...guardado, gastos: guardado.gastos ?? [] });
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
