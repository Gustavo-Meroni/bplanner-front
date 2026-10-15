/** URL da bandeira (flagcdn.com, gratuito). Emoji de bandeira não aparece no Windows. */
export function urlBandeira(codigoPais: string | null | undefined, largura: 20 | 40 | 80 = 40) {
  if (!codigoPais || !/^[A-Za-z]{2}$/.test(codigoPais)) return null;
  return `https://flagcdn.com/w${largura}/${codigoPais.toLowerCase()}.png`;
}
