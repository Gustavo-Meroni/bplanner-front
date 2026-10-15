'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Cidade } from '@/features/viagens/api/types';
import { duracao } from '@/shared/utils/datas';

export interface Estimativa {
  passagemPorPessoaCentavos: number;
  hospedagemPorNoiteCentavos: number;
  gastoDiarioPorPessoaCentavos: number;
}

export interface Rascunho {
  paradas: Cidade[];
  origem: Cidade | null;
  dataIda: string;
  dataVolta: string;
  companhia: 'sozinho' | 'grupo';
  /** Contando quem está criando */
  pessoas: number;
  metaModo: 'valor' | 'estimativa';
  metaCentavos: number;
  estimativa: Estimativa;
}

export const RASCUNHO_VAZIO: Rascunho = {
  paradas: [],
  origem: null,
  dataIda: '',
  dataVolta: '',
  companhia: 'sozinho',
  pessoas: 1,
  metaModo: 'estimativa',
  metaCentavos: 0,
  estimativa: { passagemPorPessoaCentavos: 0, hospedagemPorNoiteCentavos: 0, gastoDiarioPorPessoaCentavos: 0 },
};

/** Total da estimativa: passagens + hospedagem por noite + gasto diário de cada pessoa */
export function totalEstimado(r: Rascunho) {
  const { dias, noites } = r.dataIda && r.dataVolta ? duracao(r.dataIda, r.dataVolta) : { dias: 0, noites: 0 };
  const e = r.estimativa;
  const passagens = e.passagemPorPessoaCentavos * r.pessoas;
  const hospedagem = e.hospedagemPorNoiteCentavos * noites;
  const diarias = e.gastoDiarioPorPessoaCentavos * r.pessoas * dias;
  return { passagens, hospedagem, diarias, total: passagens + hospedagem + diarias, dias, noites };
}

export function metaFinal(r: Rascunho) {
  return r.metaModo === 'valor' ? r.metaCentavos : totalEstimado(r).total;
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
      if (salvo) setRascunho({ ...RASCUNHO_VAZIO, ...inicial, ...JSON.parse(salvo) });
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
