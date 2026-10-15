const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const brlSemCentavos = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** 123456 → "R$ 1.234,56" */
export function formatarCentavos(centavos: number, { semCentavos = false } = {}) {
  return (semCentavos ? brlSemCentavos : brl).format(centavos / 100);
}

/** Valor em outra moeda, com o símbolo de lá (ex.: ARS) */
export function formatarMoeda(valor: number, moeda: string) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda, maximumFractionDigits: 0 }).format(valor);
  } catch {
    return `${Math.round(valor).toLocaleString('pt-BR')} ${moeda}`;
  }
}
