const MONTH_NAMES = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

/**
 * Returns "Ago/2026" format from a Date object.
 */
export function getMesAno(date: Date): string {
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${month}/${year}`;
}

/**
 * Parses "Ago/2026" format back to a Date object (day 1).
 */
export function parseMesAno(mesAno: string): Date {
  const [monthStr, yearStr] = mesAno.split('/');
  const monthIndex = MONTH_NAMES.indexOf(monthStr);
  return new Date(parseInt(yearStr), monthIndex, 1);
}

/**
 * The full list of months for the trip planning period.
 */
export const MESES_VIAGEM: string[] = [
  'Jul/2026', 'Ago/2026', 'Set/2026', 'Out/2026',
  'Nov/2026', 'Dez/2026', 'Jan/2027', 'Fev/2027',
];
