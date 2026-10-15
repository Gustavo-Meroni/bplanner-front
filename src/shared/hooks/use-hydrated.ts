import { useEffect, useState } from 'react';

/**
 * true depois da primeira renderização no navegador.
 * O token fica no localStorage, que o servidor não enxerga; use isso antes de
 * decidir algo pela sessão para não gerar diferença entre servidor e cliente.
 */
export function useHydrated() {
  const [hidratado, setHidratado] = useState(false);
  useEffect(() => setHidratado(true), []);
  return hidratado;
}
