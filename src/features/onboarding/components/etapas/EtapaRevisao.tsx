'use client';

import { CalendarDays, MapPin, Users, Wallet } from 'lucide-react';
import { formatarCentavos } from '@/shared/utils/dinheiro';
import { dataLonga, duracao, mesesAte } from '@/shared/utils/datas';
import { metaFinal, type Rascunho } from '../../hooks/use-rascunho';
import { TituloEtapa } from './comum';

export function EtapaRevisao({ rascunho }: { rascunho: Rascunho }) {
  const meta = metaFinal(rascunho);
  const { dias } = duracao(rascunho.dataIda, rascunho.dataVolta);
  const roteiro = [rascunho.origem?.nome, ...rascunho.paradas.map((p) => p.nome)].filter(Boolean).join(' → ');

  const linhas = [
    { icone: <MapPin size={16} />, rotulo: 'Roteiro', valor: roteiro },
    {
      icone: <CalendarDays size={16} />,
      rotulo: 'Datas',
      valor: `${dataLonga(rascunho.dataIda)} até ${dataLonga(rascunho.dataVolta)} (${dias} dias)`,
    },
    {
      icone: <Users size={16} />,
      rotulo: 'Quem vai',
      valor: rascunho.companhia === 'sozinho' ? 'Só você' : `${rascunho.pessoas} pessoas`,
    },
    {
      icone: <Wallet size={16} />,
      rotulo: 'Meta',
      valor: `${formatarCentavos(meta, { semCentavos: true })} · ${formatarCentavos(Math.ceil(meta / mesesAte(rascunho.dataIda)), { semCentavos: true })} por mês`,
    },
  ];

  return (
    <div>
      <TituloEtapa titulo="Tudo certo?" subtitulo="Dá para mudar qualquer coisa depois, no painel da viagem." />
      <dl className="divide-y divide-dashed divide-border rounded-2xl border border-border">
        {linhas.map((l) => (
          <div key={l.rotulo} className="flex gap-3 px-4 py-3">
            <span className="mt-0.5 text-primary">{l.icone}</span>
            <div className="min-w-0">
              <dt className="text-xs font-medium text-muted-foreground">{l.rotulo}</dt>
              <dd className="text-sm font-semibold text-foreground">{l.valor}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
