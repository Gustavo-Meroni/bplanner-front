'use client';

import { CalendarHeart, CloudSun } from 'lucide-react';
import { Calendario } from '@/shared/components/ui/Calendario';
import { useClima, useFeriados } from '@/features/destinos/api/hooks';
import { dataCurta, dataLonga, diasEntre, duracao, hojeIso, nomeDoMes } from '@/shared/utils/datas';
import type { Cidade } from '@/features/viagens/api/types';
import type { Rascunho } from '../../hooks/use-rascunho';
import { Info, TituloEtapa } from './comum';

export function EtapaDatas({ rascunho, atualizar }: { rascunho: Rascunho; atualizar: (p: Partial<Rascunho>) => void }) {
  const { dataIda, dataVolta, paradas } = rascunho;
  const hoje = hojeIso();
  const valido = Boolean(dataIda && dataVolta);
  const { dias, noites } = valido ? duracao(dataIda, dataVolta) : { dias: 0, noites: 0 };
  const faltam = dataIda ? diasEntre(hoje, dataIda) : 0;

  // Os feriados do destino viram pontinhos no calendário
  const principal = paradas[0];
  const { data: feriados } = useFeriados(
    principal?.codigoPais ?? null,
    dataIda || hoje,
    dataVolta || somarDias(dataIda || hoje, 60),
  );
  const marcadas = new Set((feriados ?? []).map((f) => f.data));

  return (
    <div>
      <TituloEtapa titulo="Quando?" subtitulo="Escolha a ida e depois a volta. As datas definem a contagem e as noites." />

      <Calendario
        inicio={dataIda}
        fim={dataVolta}
        marcadas={marcadas}
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
        <p className="mt-2 text-xs text-muted-foreground">Faltam {faltam} dias para o embarque.</p>
      )}

      {valido && paradas.length > 0 && (
        <div className="mt-4 space-y-2.5">
          <ClimaInfo cidade={paradas[0]} mes={Number(dataIda.slice(5, 7))} />
          <FeriadosInfo paradas={paradas} inicio={dataIda} fim={dataVolta} />
        </div>
      )}
    </div>
  );
}

function ClimaInfo({ cidade, mes }: { cidade: Cidade; mes: number }) {
  const { data, isLoading } = useClima(cidade.lat, cidade.lng, mes);
  if (isLoading) return <div className="h-[58px] animate-pulse rounded-xl bg-muted" />;
  if (!data) return null;
  const nome = nomeDoMes(mes);
  return (
    <Info icone={<CloudSun size={18} />} className="animate-in fade-in duration-300">
      <strong className="font-semibold">
        {nome[0].toUpperCase() + nome.slice(1)} em {cidade.nome}:
      </strong>{' '}
      máximas de ≈{data.maximaMedia}°, mínimas de ≈{data.minimaMedia}° e chuva em uns {data.diasDeChuva} dias.
    </Info>
  );
}

function FeriadosInfo({ paradas, inicio, fim }: { paradas: Cidade[]; inicio: string; fim: string }) {
  const paises = [
    ...new Map(paradas.filter((p) => p.codigoPais).map((p) => [p.codigoPais!.toUpperCase(), p.pais])).entries(),
  ].slice(0, 3);
  return (
    <>
      {paises.map(([codigo, nome]) => (
        <FeriadosDoPais key={codigo} codigo={codigo} nome={nome ?? codigo} inicio={inicio} fim={fim} />
      ))}
    </>
  );
}

function FeriadosDoPais({ codigo, nome, inicio, fim }: { codigo: string; nome: string; inicio: string; fim: string }) {
  const { data, isLoading } = useFeriados(codigo, inicio, fim);
  if (isLoading) return <div className="h-[58px] animate-pulse rounded-xl bg-muted" />;
  if (!data || data.length === 0) return null;
  return (
    <Info icone={<CalendarHeart size={18} />} className="animate-in fade-in duration-300">
      <strong className="font-semibold">
        {data.length === 1 ? 'Feriado' : 'Feriados'} {codigo === 'BR' ? 'no Brasil' : `em ${nome}`}:
      </strong>{' '}
      {data.map((f) => `${f.nome} (${dataCurta(f.data)})`).join(', ')}. Algumas lojas e atrações podem fechar.
    </Info>
  );
}

function somarDias(iso: string, dias: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().slice(0, 10);
}
