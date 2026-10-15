const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const curto = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const longo = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

const utc = (iso: string) => new Date(`${iso.slice(0, 10)}T00:00:00Z`);

/** "2026-12-27" → "27 dez" */
export const dataCurta = (iso: string) => curto.format(utc(iso)).replace('.', '');
/** "2026-12-27" → "27 de dez. de 2026" sem ponto */
export const dataLonga = (iso: string) => longo.format(utc(iso)).replace('.', '');
/** 12 → "dezembro" */
export const nomeDoMes = (mes: number) => MESES[mes - 1] ?? '';

/** Hoje em "AAAA-MM-DD" (fuso local) */
export function hojeIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function diasEntre(inicio: string, fim: string) {
  return Math.round((utc(fim).getTime() - utc(inicio).getTime()) / 86_400_000);
}

/** Viagem de 27/12 a 03/01 → 8 dias e 7 noites */
export function duracao(ida: string, volta: string) {
  const noites = Math.max(diasEntre(ida, volta), 0);
  return { dias: noites + 1, noites };
}

/** Meses de calendário de hoje até a data (mínimo 1) */
export function mesesAte(iso: string) {
  const hoje = utc(hojeIso());
  const alvo = utc(iso);
  const meses = (alvo.getUTCFullYear() - hoje.getUTCFullYear()) * 12 + (alvo.getUTCMonth() - hoje.getUTCMonth());
  return Math.max(meses, 1);
}
