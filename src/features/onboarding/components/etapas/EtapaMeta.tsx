'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowRightLeft, Plus, Trash2 } from 'lucide-react';
import { MoneyInput } from '@/shared/components/ui/MoneyInput';
import { ValorAnimado } from '@/shared/components/ui/ValorAnimado';
import { useCambio, usePais } from '@/features/destinos/api/hooks';
import { formatarCentavos, formatarMoeda } from '@/shared/utils/dinheiro';
import { mesesAte } from '@/shared/utils/datas';
import { cn } from '@/lib/utils';
import type { BaseDoCusto, SituacaoDoCusto } from '@/features/viagens/api/types';
import {
  aPagarDoItem,
  metaFinal,
  novoId,
  quantidadeDaBase,
  totaisDoRascunho,
  totalDoItem,
  type ItemCusto,
  type Rascunho,
} from '../../hooks/use-rascunho';
import { Info, TituloEtapa } from './comum';

const BASES: Array<{ valor: BaseDoCusto; rotulo: string }> = [
  { valor: 'FIXO', rotulo: 'no total' },
  { valor: 'POR_PESSOA', rotulo: 'por pessoa' },
  { valor: 'POR_NOITE', rotulo: 'por noite' },
  { valor: 'POR_DIA', rotulo: 'por dia' },
  { valor: 'POR_PESSOA_DIA', rotulo: 'por pessoa/dia' },
];

const SITUACOES: Array<{ valor: SituacaoDoCusto; rotulo: string }> = [
  { valor: 'A_PAGAR', rotulo: 'a pagar' },
  { valor: 'PAGO', rotulo: 'já paguei' },
  { valor: 'PARCELADO', rotulo: 'parcelado' },
];

export function EtapaMeta({ rascunho, atualizar }: { rascunho: Rascunho; atualizar: (p: Partial<Rascunho>) => void }) {
  const { itens } = rascunho;
  const { total, aPagar, jaPago } = totaisDoRascunho(rascunho);
  const meta = metaFinal(rascunho);
  const meses = rascunho.dataIda ? mesesAte(rascunho.dataIda) : null;

  const mudarItem = (id: string, parcial: Partial<ItemCusto>) =>
    atualizar({ itens: itens.map((i) => (i.id === id ? { ...i, ...parcial } : i)) });

  const removerItem = (id: string) => atualizar({ itens: itens.filter((i) => i.id !== id) });

  const adicionarItem = () =>
    atualizar({
      itens: [
        ...itens,
        {
          id: novoId(),
          nome: '',
          categoria: 'OUTROS',
          valorUnitarioCentavos: 0,
          base: 'FIXO',
          situacao: 'A_PAGAR',
          parcelas: 2,
          parcelasPagas: 0,
        },
      ],
    });

  return (
    <div>
      <TituloEtapa
        titulo="Quanto vai custar?"
        subtitulo="Some o que já dá para prever. O que você já pagou fica fora da meta."
      />

      <ul className="space-y-2.5">
        <AnimatePresence initial={false}>
          {itens.map((item) => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LinhaDoItem
                item={item}
                rascunho={rascunho}
                onMudar={(p) => mudarItem(item.id, p)}
                onRemover={() => removerItem(item.id)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <button
        type="button"
        onClick={adicionarItem}
        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 py-2.5 text-[13px] font-semibold text-primary transition-colors hover:bg-primary/[0.06]"
      >
        <Plus size={15} /> adicionar item
      </button>

      <div className="mt-5 space-y-1.5 border-t border-border pt-4 text-[13px]">
        <div className="flex justify-between text-muted-foreground">
          <span>Total do plano</span>
          <span className="tabular-nums">{formatarCentavos(total)}</span>
        </div>
        {jaPago > 0 && (
          <div className="flex justify-between text-muted-foreground animate-in fade-in duration-200">
            <span>Já pago · fora da meta</span>
            <span className="tabular-nums text-success">− {formatarCentavos(jaPago)}</span>
          </div>
        )}
      </div>

      <div className="mt-3 rounded-xl border border-primary/30 bg-primary/[0.07] px-3.5 py-3">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-semibold text-foreground">Meta: quanto falta guardar</p>
          <ValorAnimado centavos={meta} className="font-display text-2xl text-primary" />
        </div>

        {meses && meta > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            ≈ {formatarCentavos(Math.ceil(meta / meses))} por mês até o embarque.
          </p>
        )}

        <details className="group mt-2.5">
          <summary className="cursor-pointer list-none text-xs font-semibold text-primary transition-colors hover:text-primary/80">
            quero guardar outro valor
          </summary>
          <div className="mt-2.5">
            <MoneyInput
              label="Meta da viagem"
              value={rascunho.metaEditada ? rascunho.metaCentavos : aPagar}
              onChange={(v) => atualizar({ metaCentavos: v, metaEditada: true })}
            />
            {rascunho.metaEditada && (
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  {rascunho.metaCentavos > aPagar
                    ? `${formatarCentavos(rascunho.metaCentavos - aPagar)} a mais que o plano.`
                    : rascunho.metaCentavos < aPagar
                      ? `${formatarCentavos(aPagar - rascunho.metaCentavos)} a menos que o plano.`
                      : 'Igual ao plano.'}
                </p>
                <button
                  type="button"
                  onClick={() => atualizar({ metaEditada: false, metaCentavos: 0 })}
                  className="shrink-0 text-xs font-semibold text-primary"
                >
                  usar o do plano
                </button>
              </div>
            )}
          </div>
        </details>
      </div>

      <CambioInfo rascunho={rascunho} />
    </div>
  );
}

function LinhaDoItem({
  item,
  rascunho,
  onMudar,
  onRemover,
}: {
  item: ItemCusto;
  rascunho: Rascunho;
  onMudar: (p: Partial<ItemCusto>) => void;
  onRemover: () => void;
}) {
  const quantidade = quantidadeDaBase(item.base, rascunho);
  const total = totalDoItem(item, rascunho);
  const falta = aPagarDoItem(item, rascunho);
  const temValor = item.valorUnitarioCentavos > 0;

  return (
    <div
      className={cn(
        'rounded-xl border px-3 py-2.5 transition-colors',
        temValor ? 'border-border bg-card' : 'border-border/60 bg-muted/20'
      )}
    >
      <div className="flex items-center gap-2">
        <input
          value={item.nome}
          onChange={(e) => onMudar({ nome: e.target.value })}
          placeholder="Nome do item"
          aria-label="Nome do item"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/70 focus-visible:outline-none"
        />
        {temValor && (
          <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
            {formatarCentavos(total)}
          </span>
        )}
        <button
          type="button"
          onClick={onRemover}
          aria-label={`Remover ${item.nome || 'item'}`}
          className="shrink-0 rounded-md p-1 text-muted-foreground/60 transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <MoneyInput
          value={item.valorUnitarioCentavos}
          onChange={(v) => onMudar({ valorUnitarioCentavos: v })}
          aria-label={`Valor de ${item.nome || 'item'}`}
          containerClassName="w-[9.5rem] shrink-0"
          className="h-9 text-[13px]"
        />
        <select
          value={item.base}
          onChange={(e) => onMudar({ base: e.target.value as BaseDoCusto })}
          aria-label="Como multiplicar o valor"
          className="h-9 min-w-0 flex-1 rounded-xl border border-border bg-background px-2 text-[13px] text-foreground outline-none transition-colors hover:border-foreground/25 focus:border-ring"
        >
          {BASES.map((b) => (
            <option key={b.valor} value={b.valor}>
              {b.rotulo}
            </option>
          ))}
        </select>
      </div>

      {temValor && quantidade > 1 && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {formatarCentavos(item.valorUnitarioCentavos)} × {quantidade}
          {item.situacao !== 'A_PAGAR' && falta > 0 && ` · faltam ${formatarCentavos(falta)}`}
          {item.situacao === 'PAGO' && ' · nada a guardar'}
        </p>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {SITUACOES.map((s) => (
          <button
            key={s.valor}
            type="button"
            onClick={() => onMudar({ situacao: s.valor })}
            aria-pressed={item.situacao === s.valor}
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
              item.situacao === s.valor
                ? s.valor === 'PAGO'
                  ? 'bg-success/15 text-success'
                  : s.valor === 'PARCELADO'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-foreground/10 text-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {s.rotulo}
          </button>
        ))}

        {item.situacao === 'PARCELADO' && (
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground animate-in fade-in slide-in-from-left-1 duration-200">
            <NumeroPequeno
              valor={item.parcelas}
              min={2}
              max={48}
              aria-label="Quantas parcelas"
              onChange={(v) => onMudar({ parcelas: v, parcelasPagas: Math.min(item.parcelasPagas, v) })}
            />
            <span>vezes ·</span>
            <NumeroPequeno
              valor={item.parcelasPagas}
              min={0}
              max={item.parcelas}
              aria-label="Parcelas já pagas"
              onChange={(v) => onMudar({ parcelasPagas: v })}
            />
            <span>pagas</span>
          </div>
        )}
      </div>
    </div>
  );
}

function NumeroPequeno({
  valor,
  min,
  max,
  onChange,
  ...props
}: {
  valor: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  'aria-label': string;
}) {
  return (
    <input
      {...props}
      type="number"
      inputMode="numeric"
      min={min}
      max={max}
      value={valor}
      onChange={(e) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) onChange(Math.min(Math.max(Math.round(n), min), max));
      }}
      className="h-7 w-11 rounded-md border border-border bg-background px-1.5 text-center text-[11px] font-semibold tabular-nums text-foreground outline-none focus:border-ring"
    />
  );
}

/** Quanto a meta representa na moeda do destino */
function CambioInfo({ rascunho }: { rascunho: Rascunho }) {
  const destino = rascunho.paradas[0];
  const { data: pais } = usePais(destino?.codigoPais);
  const moeda = pais?.moedas[0]?.codigo ?? null;
  const { data: cambio } = useCambio(moeda);
  const meta = metaFinal(rascunho);

  if (!cambio || !moeda || moeda === 'BRL' || meta <= 0) return null;

  return (
    <Info icone={<ArrowRightLeft size={18} />} className="mt-3 animate-in fade-in duration-300">
      {formatarCentavos(meta)} ≈ <strong className="font-semibold">{formatarMoeda((meta / 100) * cambio.taxa, moeda)}</strong>
      {pais?.nome ? ` em ${pais.nome}.` : '.'}
    </Info>
  );
}
