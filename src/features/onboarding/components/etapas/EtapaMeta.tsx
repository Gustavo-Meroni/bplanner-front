'use client';

import { ArrowRightLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { MoneyInput } from '@/shared/components/ui/MoneyInput';
import { ValorAnimado } from '@/shared/components/ui/ValorAnimado';
import { useCambio, usePais } from '@/features/destinos/api/hooks';
import { formatarCentavos, formatarMoeda } from '@/shared/utils/dinheiro';
import { mesesAte } from '@/shared/utils/datas';
import { cn } from '@/lib/utils';
import { metaFinal, totalEstimado, type Rascunho } from '../../hooks/use-rascunho';
import { Info, TituloEtapa } from './comum';

export function EtapaMeta({ rascunho, atualizar }: { rascunho: Rascunho; atualizar: (p: Partial<Rascunho>) => void }) {
  const { metaModo, estimativa, pessoas } = rascunho;
  const conta = totalEstimado(rascunho);
  const meta = metaFinal(rascunho);
  const meses = rascunho.dataIda ? mesesAte(rascunho.dataIda) : null;
  const porPessoa = pessoas > 1 ? ' por pessoa' : '';

  const setEstimativa = (parcial: Partial<typeof estimativa>) => atualizar({ estimativa: { ...estimativa, ...parcial } });

  return (
    <div>
      <TituloEtapa titulo="Quanto vai custar?" subtitulo="Essa é a meta que o painel acompanha até o embarque." />

      <div role="tablist" aria-label="Como definir a meta" className="mb-5 flex rounded-full bg-muted p-1">
        {(
          [
            ['estimativa', 'Estimar pra mim'],
            ['valor', 'Já sei o valor'],
          ] as const
        ).map(([modo, rotulo]) => (
          <button
            key={modo}
            type="button"
            role="tab"
            aria-selected={metaModo === modo}
            onClick={() => atualizar({ metaModo: modo })}
            className={cn(
              'relative flex-1 rounded-full py-2 text-sm font-semibold transition-colors',
              metaModo === modo ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {metaModo === modo && (
              <motion.span
                layoutId="meta-modo-pill"
                className="absolute inset-0 rounded-full border border-border bg-card shadow-sm"
                transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
              />
            )}
            <span className="relative">{rotulo}</span>
          </button>
        ))}
      </div>

      {metaModo === 'valor' ? (
        <MoneyInput
          label="Meta da viagem"
          hint="O total que você quer ter guardado até a ida."
          value={rascunho.metaCentavos}
          onChange={(v) => atualizar({ metaCentavos: v })}
          autoFocus
        />
      ) : (
        <div className="space-y-3">
          <MoneyInput
            label={`Passagem ida e volta${porPessoa}`}
            value={estimativa.passagemPorPessoaCentavos}
            onChange={(v) => setEstimativa({ passagemPorPessoaCentavos: v })}
          />
          <MoneyInput
            label="Hospedagem por noite"
            hint={conta.noites ? `${conta.noites} ${conta.noites === 1 ? 'noite' : 'noites'} de viagem` : undefined}
            value={estimativa.hospedagemPorNoiteCentavos}
            onChange={(v) => setEstimativa({ hospedagemPorNoiteCentavos: v })}
          />
          <MoneyInput
            label={`Gasto por dia${porPessoa}`}
            hint="Comida, passeios e transporte no destino."
            value={estimativa.gastoDiarioPorPessoaCentavos}
            onChange={(v) => setEstimativa({ gastoDiarioPorPessoaCentavos: v })}
          />
          <CambioDoDia rascunho={rascunho} />
        </div>
      )}

      <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/[0.06] px-4 py-3.5">
        <p className="text-xs font-medium text-muted-foreground">Meta da viagem</p>
        <ValorAnimado centavos={meta} className="block font-display text-3xl leading-tight text-foreground tabular-nums" />
        {metaModo === 'estimativa' && meta > 0 && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {formatarCentavos(conta.passagens, { semCentavos: true })} em passagens +{' '}
            {formatarCentavos(conta.hospedagem, { semCentavos: true })} de hospedagem +{' '}
            {formatarCentavos(conta.diarias, { semCentavos: true })} no dia a dia
          </p>
        )}
        {meses && meta > 0 && (
          <p className="mt-2 text-[13px] text-foreground">
            Guardando <strong className="font-semibold">{formatarCentavos(Math.ceil(meta / meses), { semCentavos: true })}</strong>{' '}
            por mês, a meta fecha até a ida.
          </p>
        )}
      </div>
    </div>
  );
}

/** Mostra o gasto diário convertido para a moeda do destino (só em viagem internacional) */
function CambioDoDia({ rascunho }: { rascunho: Rascunho }) {
  const estrangeira = rascunho.paradas.find((p) => p.codigoPais && p.codigoPais.toUpperCase() !== 'BR');
  const { data: pais } = usePais(estrangeira?.codigoPais?.toUpperCase());
  const moeda = pais?.moedas[0]?.codigo;
  const { data: cambio } = useCambio(moeda);
  const diario = rascunho.estimativa.gastoDiarioPorPessoaCentavos;

  if (!estrangeira || !cambio || !moeda) return null;

  return (
    <Info icone={<ArrowRightLeft size={16} />} className="animate-in fade-in duration-300">
      {diario > 0 ? (
        <>
          {formatarCentavos(diario, { semCentavos: true })} por dia ≈{' '}
          <strong className="font-semibold">{formatarMoeda((diario / 100) * cambio.taxa, moeda)}</strong> em {pais?.nome}.
        </>
      ) : (
        <>
          Hoje, R$ 1 ≈ <strong className="font-semibold">{formatarMoeda(cambio.taxa, moeda)}</strong> em {pais?.nome}.
        </>
      )}
      <a
        href={cambio.fonte.url}
        target="_blank"
        rel="noreferrer"
        className="block text-[11px] text-muted-foreground underline-offset-2 hover:underline"
      >
        Cotação do dia por {cambio.fonte.nome}
      </a>
    </Info>
  );
}
