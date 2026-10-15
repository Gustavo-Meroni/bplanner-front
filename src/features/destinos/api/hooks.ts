import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import api from '@/shared/api/client';
import type { Cambio, CidadeEncontrada, ClimaDoMes, Feriado, Pais } from './types';
import type { Aeroporto } from '@/features/viagens/api/types';

const HORA = 60 * 60 * 1000;

function useDebounce<T>(valor: T, ms = 300) {
  const [atrasado, setAtrasado] = useState(valor);
  useEffect(() => {
    const id = window.setTimeout(() => setAtrasado(valor), ms);
    return () => window.clearTimeout(id);
  }, [valor, ms]);
  return atrasado;
}

/** Busca de cidades com espera de 300 ms entre teclas */
export function useBuscaCidades(termo: string) {
  const q = useDebounce(termo.trim());
  return useQuery({
    queryKey: ['destinos', 'busca', q.toLowerCase()],
    queryFn: () => api.get<CidadeEncontrada[]>('/destinos/busca', { params: { q } }).then((r) => r.data),
    enabled: q.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 24 * HORA,
    retry: false,
  });
}

export function usePais(codigo: string | null | undefined) {
  return useQuery({
    queryKey: ['destinos', 'pais', codigo],
    queryFn: () => api.get<Pais | null>(`/destinos/paises/${codigo}`).then((r) => r.data),
    enabled: Boolean(codigo),
    staleTime: Infinity,
  });
}

export function useClima(lat: number | undefined, lng: number | undefined, mes: number | undefined) {
  return useQuery({
    queryKey: ['destinos', 'clima', lat?.toFixed(1), lng?.toFixed(1), mes],
    queryFn: () => api.get<ClimaDoMes | null>('/destinos/clima', { params: { lat, lng, mes } }).then((r) => r.data),
    enabled: lat !== undefined && lng !== undefined && Boolean(mes),
    staleTime: 24 * HORA,
    retry: false,
  });
}

export function useFeriados(pais: string | null | undefined, inicio: string, fim: string) {
  return useQuery({
    queryKey: ['destinos', 'feriados', pais, inicio, fim],
    queryFn: () => api.get<Feriado[]>('/destinos/feriados', { params: { pais, inicio, fim } }).then((r) => r.data),
    enabled: Boolean(pais && inicio && fim && fim >= inicio),
    staleTime: 24 * HORA,
    retry: false,
  });
}

export function useCambio(para: string | null | undefined, de = 'BRL') {
  return useQuery({
    queryKey: ['destinos', 'cambio', de, para],
    queryFn: () => api.get<Cambio>('/destinos/cambio', { params: { de, para } }).then((r) => r.data),
    enabled: Boolean(para && para !== de),
    staleTime: 6 * HORA,
    retry: false,
  });
}

/** Aeroportos que atendem uma coordenada, do mais indicado ao menos */
export function useAeroportos(lat: number | undefined, lng: number | undefined) {
  return useQuery({
    queryKey: ['destinos', 'aeroportos', lat?.toFixed(2), lng?.toFixed(2)],
    queryFn: () =>
      api.get<Aeroporto[]>('/destinos/aeroportos', { params: { lat, lng } }).then((r) => r.data),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: Infinity,
    retry: false,
  });
}
