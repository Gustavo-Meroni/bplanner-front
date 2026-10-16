'use client';

import { CalendarDays, MapPin, Tags, Users } from 'lucide-react';
import { MoneyInput } from '@/shared/components/ui/MoneyInput';
import { dataLonga, duracao } from '@/shared/utils/datas';
import { formatarCentavos } from '@/shared/utils/dinheiro';
import type { Rascunho } from '../../hooks/use-rascunho';
import { TituloEtapa } from './comum';

export function EtapaRevisao({
  rascunho,
  atualizar,
}: {
  rascunho: Rascunho;
  atualizar: (p: Partial<Rascunho>) => void;
}) {
  const { dias } = duracao(rascunho.dataIda, rascunho.dataVolta);
  const roteiro = [rascunho.origem?.nome, ...rascunho.paradas.map((p) => p.nome)].filter(Boolean).join(' → ');
  const pessoas = rascunho.companhia === 'sozinho' ? 'Só você' : `${rascunho.pessoas} pessoas`;

  const linhas = [
    { icone: <MapPin size={16} />, rotulo: 'Roteiro', valor: roteiro },
    {
      icone: <CalendarDays size={16} />,
      rotulo: 'Datas',
      valor: `${dataLonga(rascunho.dataIda)} até ${dataLonga(rascunho.dataVolta)} (${dias} dias)`,
    },
    { icone: <Users size={16} />, rotulo: 'Quem vai', valor: pessoas },
    {
      icone: <Tags size={16} />,
      rotulo: 'Gastos previstos',
      valor:
        rascunho.gastos.length === 0
          ? 'Nenhum ainda — dá para montar no painel'
          : rascunho.gastos.map((g) => g.nome).join(', '),
    },
  ];

  return (
    <div>
      <TituloEtapa titulo="Tudo certo?" subtitulo="Dá para mudar qualquer coisa depois, no painel da viagem." />

      <dl className="divide-y divide-dashed divide-border rounded-2xl border border-border">
        {linhas.map((l) => (
          <div key={l.rotulo} className="flex gap-3 px-4 py-3">
            <span className="mt-0.5 shrink-0 text-primary">{l.icone}</span>
            <div className="min-w-0">
              <dt className="text-xs font-medium text-muted-foreground">{l.rotulo}</dt>
              <dd className="text-sm font-semibold text-foreground">{l.valor}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-5 space-y-3 rounded-2xl border border-dashed border-border px-4 py-4">
        <p className="text-[13px] font-semibold text-foreground">
          Dinheiro <span className="font-normal text-muted-foreground">· opcional, dá para deixar para depois</span>
        </p>

        <MoneyInput
          label="Quanto você acha que vai custar no total?"
          hint={
            rascunho.pessoas > 1
              ? `Só um chute, somando as ${rascunho.pessoas} pessoas. Os gastos reais ajustam isso depois.`
              : 'Só um chute. Os gastos reais ajustam isso depois.'
          }
          value={rascunho.estimativaTotalCentavos}
          onChange={(v) => atualizar({ estimativaTotalCentavos: v })}
        />

        <MoneyInput
          label="Já tem algum dinheiro guardado?"
          hint="Entra como o primeiro valor do cofre."
          value={rascunho.jaGuardadoCentavos}
          onChange={(v) => atualizar({ jaGuardadoCentavos: v })}
        />

        {rascunho.estimativaTotalCentavos > 0 && rascunho.jaGuardadoCentavos > 0 && (
          <p className="text-xs text-muted-foreground animate-in fade-in duration-200">
            Faltariam{' '}
            <strong className="font-semibold text-foreground">
              {formatarCentavos(Math.max(rascunho.estimativaTotalCentavos - rascunho.jaGuardadoCentavos, 0))}
            </strong>{' '}
            para fechar a conta.
          </p>
        )}
      </div>
    </div>
  );
}
