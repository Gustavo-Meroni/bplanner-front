import type { Cidade } from '@/features/viagens/api/types';

export type CidadeEncontrada = Cidade;

export interface Pais {
  codigo: string;
  nome: string;
  bandeira: string | null;
  capital: string | null;
  regiao: string | null;
  moedas: Array<{ codigo: string; nome: string; simbolo: string | null }>;
  idiomas: string[];
}

export interface ClimaDoMes {
  mes: number;
  maximaMedia: number;
  minimaMedia: number;
  diasDeChuva: number;
  fonte: string;
}

export interface Feriado {
  data: string;
  nome: string;
  nomeIngles: string;
}

export interface Cambio {
  de: string;
  para: string;
  taxa: number;
  atualizadoEm: string;
  fonte: { nome: string; url: string };
}
