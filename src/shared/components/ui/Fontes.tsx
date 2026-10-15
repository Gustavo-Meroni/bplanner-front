'use client';

import { useState } from 'react';

const FONTES = [
  { nome: 'OpenStreetMap', url: 'https://www.openstreetmap.org/copyright', uso: 'busca de lugares' },
  { nome: 'Open-Meteo', url: 'https://open-meteo.com/', uso: 'clima típico' },
  { nome: 'Nager.Date', url: 'https://date.nager.at/', uso: 'feriados' },
  { nome: 'ExchangeRate-API', url: 'https://www.exchangerate-api.com', uso: 'câmbio' },
  { nome: 'OurAirports', url: 'https://ourairports.com/data/', uso: 'aeroportos' },
];

/**
 * Crédito das bases públicas usadas no app. Fica discreto e só abre quando
 * alguém quer ver — as licenças de OpenStreetMap, Open-Meteo e da cotação
 * pedem a atribuição.
 */
export function Fontes({ className }: { className?: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="text-[11px] text-muted-foreground/70 underline-offset-2 transition-colors hover:text-muted-foreground hover:underline"
      >
        Fontes
      </button>
      {aberto && (
        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground/70 animate-in fade-in duration-200">
          Dados de{' '}
          {FONTES.map((f, i) => (
            <span key={f.nome}>
              {i > 0 && (i === FONTES.length - 1 ? ' e ' : ', ')}
              <a
                href={f.url}
                target="_blank"
                rel="noreferrer noopener"
                className="underline underline-offset-2 hover:text-foreground"
              >
                {f.nome}
              </a>{' '}
              ({f.uso})
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}
