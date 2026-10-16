'use client';

import { Calendario } from '@/shared/components/ui/Calendario';
import { dataLonga, diasEntre, duracao, hojeIso } from '@/shared/utils/datas';
import type { Rascunho } from '../../hooks/use-rascunho';
import { TituloEtapa } from './comum';

export function EtapaDatas({ rascunho, atualizar }: { rascunho: Rascunho; atualizar: (p: Partial<Rascunho>) => void }) {
  const { dataIda, dataVolta } = rascunho;
  const valido = Boolean(dataIda && dataVolta);
  const { dias, noites } = valido ? duracao(dataIda, dataVolta) : { dias: 0, noites: 0 };
  const faltam = dataIda ? diasEntre(hojeIso(), dataIda) : 0;

  return (
    <div>
      <TituloEtapa titulo="Quando?" subtitulo="Escolha a ida e depois a volta." />

      <Calendario
        inicio={dataIda}
        fim={dataVolta}
        onSelecionar={({ inicio, fim }) => atualizar({ dataIda: inicio, dataVolta: fim })}
      />

      <div className="mt-4 flex min-h-[2.5rem] items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-2.5">
        {valido ? (
          <>
            <p className="text-[13px] text-foreground animate-in fade-in duration-200">
              {dataLonga(dataIda)} <span className="text-muted-foreground">até</span> {dataLonga(dataVolta)}
            </p>
            <p className="shrink-0 text-[13px] font-semibold text-foreground">
              {dias} {dias === 1 ? 'dia' : 'dias'}
              {noites > 0 && `, ${noites} ${noites === 1 ? 'noite' : 'noites'}`}
            </p>
          </>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            {dataIda ? 'Agora escolha a volta.' : 'Escolha o dia da ida.'}
          </p>
        )}
      </div>

      {valido && faltam > 0 && (
        <p className="mt-2 text-xs text-muted-foreground">Faltam {faltam} dias para a viagem.</p>
      )}
    </div>
  );
}
