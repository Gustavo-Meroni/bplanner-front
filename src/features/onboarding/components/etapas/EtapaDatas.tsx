'use client';

import { CalendarHeart, CloudSun } from 'lucide-react';
import { Input } from '@/shared/components/ui/Input';
import { useClima, useFeriados } from '@/features/destinos/api/hooks';
import { dataCurta, diasEntre, duracao, hojeIso, nomeDoMes } from '@/shared/utils/datas';
import type { Cidade } from '@/features/viagens/api/types';
import type { Rascunho } from '../../hooks/use-rascunho';
import { Info, TituloEtapa } from './comum';

/** Enquanto digita o ano o campo passa por "0002-12-27"; só vale data com ano completo */
const completa = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= '2000-01-01';

export function EtapaDatas({ rascunho, atualizar }: { rascunho: Rascunho; atualizar: (p: Partial<Rascunho>) => void }) {
  const { dataIda, dataVolta, paradas } = rascunho;
  const hoje = hojeIso();
  const voltaAntes = completa(dataIda) && completa(dataVolta) && dataVolta < dataIda;
  const valido = completa(dataIda) && completa(dataVolta) && !voltaAntes;
  const { dias, noites } = valido ? duracao(dataIda, dataVolta) : { dias: 0, noites: 0 };
  const faltam = dataIda ? diasEntre(hoje, dataIda) : 0;

  return (
    <div>
      <TituloEtapa titulo="Quando?" subtitulo="As datas definem a contagem regressiva e quantas noites entram na conta." />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Ida"
          type="date"
          min={hoje}
          value={dataIda}
          onChange={(e) => {
            const ida = e.target.value;
            atualizar({ dataIda: ida, ...(completa(ida) && completa(dataVolta) && dataVolta < ida ? { dataVolta: '' } : {}) });
          }}
        />
        <Input
          label="Volta"
          type="date"
          min={dataIda || hoje}
          value={dataVolta}
          onChange={(e) => atualizar({ dataVolta: e.target.value })}
          error={voltaAntes ? 'A volta precisa ser depois da ida' : undefined}
        />
      </div>

      {valido && (
        <p className="mt-3 text-sm text-foreground animate-in fade-in duration-200">
          <strong className="font-semibold">
            {dias} {dias === 1 ? 'dia' : 'dias'}
          </strong>
          {noites > 0 && ` e ${noites} ${noites === 1 ? 'noite' : 'noites'}`}
          {faltam > 0 && <span className="text-muted-foreground"> · embarque em {faltam} dias</span>}
        </p>
      )}

      {valido && paradas.length > 0 && (
        <div className="mt-5 space-y-2.5">
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
  return (
    <Info icone={<CloudSun size={18} />} className="animate-in fade-in duration-300">
      <strong className="font-semibold">
        {nomeDoMes(mes)[0].toUpperCase() + nomeDoMes(mes).slice(1)} em {cidade.nome}:
      </strong>{' '}
      máximas de {data.maximaMedia}°, mínimas de {data.minimaMedia}° e chuva em uns {data.diasDeChuva} dias do mês.
      <span className="block text-[11px] text-muted-foreground">Média dos últimos anos · Open-Meteo</span>
    </Info>
  );
}

function FeriadosInfo({ paradas, inicio, fim }: { paradas: Cidade[]; inicio: string; fim: string }) {
  const paises = [...new Map(paradas.filter((p) => p.codigoPais).map((p) => [p.codigoPais!.toUpperCase(), p.pais])).entries()].slice(0, 3);
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
  if (!data) return null;
  return (
    <Info icone={<CalendarHeart size={18} />} className="animate-in fade-in duration-300">
      {data.length === 0 ? (
        <>Nenhum feriado nacional {codigo === 'BR' ? 'no Brasil' : `em ${nome}`} durante a viagem.</>
      ) : (
        <>
          <strong className="font-semibold">
            {data.length === 1 ? 'Feriado' : 'Feriados'} {codigo === 'BR' ? 'no Brasil' : `em ${nome}`}:
          </strong>{' '}
          {data.map((f) => `${f.nome} (${dataCurta(f.data)})`).join(', ')}. Algumas lojas e atrações podem fechar.
        </>
      )}
    </Info>
  );
}
