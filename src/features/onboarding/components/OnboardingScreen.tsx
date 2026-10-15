'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { BoardingPassCard } from '@/shared/components/brand/BoardingPass';
import { Button } from '@/shared/components/ui/Button';
import { mensagemDeErro } from '@/shared/api/client';
import { encerrarSessao } from '@/shared/auth/session';
import { useAuthStore } from '@/shared/store/use-auth-store';
import { ME_KEY, useMeQuery } from '@/features/auth/api/hooks';
import { atualizarViagemService, criarViagemService } from '@/features/viagens/api/services';
import type { SalvarViagemDto, ViagemResumo } from '@/features/viagens/api/types';
import { metaFinal, totaisDoRascunho, useRascunho, type Rascunho } from '../hooks/use-rascunho';
import { MapaDoRoteiro } from './MapaDoRoteiro';
import { EtapaEntrada } from './etapas/EtapaEntrada';
import { EtapaDestinos } from './etapas/EtapaDestinos';
import { EtapaDatas } from './etapas/EtapaDatas';
import { EtapaPessoas } from './etapas/EtapaPessoas';
import { EtapaMeta } from './etapas/EtapaMeta';
import { EtapaRevisao } from './etapas/EtapaRevisao';
import { EtapaConvidar } from './etapas/EtapaConvidar';

type Etapa = 'entrada' | 'destinos' | 'datas' | 'pessoas' | 'meta' | 'revisao';
const PASSOS: Etapa[] = ['destinos', 'datas', 'pessoas', 'meta', 'revisao'];
const TITULOS: Record<Etapa, string> = {
  entrada: 'Começo',
  destinos: 'Destino',
  datas: 'Datas',
  pessoas: 'Quem vai',
  meta: 'Meta',
  revisao: 'Revisão',
};

function etapaValida(etapa: Etapa, r: Rascunho) {
  switch (etapa) {
    case 'destinos':
      return r.paradas.length > 0;
    case 'datas':
      return /^\d{4}-\d{2}-\d{2}$/.test(r.dataIda) && r.dataIda >= '2000-01-01' && r.dataVolta >= r.dataIda;
    case 'pessoas':
      return r.pessoas >= 1;
    case 'meta':
      return metaFinal(r) > 0;
    default:
      return true;
  }
}

function paraDto(r: Rascunho): SalvarViagemDto {
  const semNulos = <T extends object>(o: T) =>
    Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined)) as T;
  const { itens } = totaisDoRascunho(r);

  return {
    paradas: r.paradas.map(({ contexto: _contexto, tipo: _tipo, ...p }) => semNulos(p)) as SalvarViagemDto['paradas'],
    ...(r.origem && { origem: semNulos({ nome: r.origem.nome, lat: r.origem.lat, lng: r.origem.lng, aeroporto: r.origem.aeroporto }) as SalvarViagemDto['origem'] }),
    dataIda: r.dataIda,
    dataVolta: r.dataVolta,
    metaCentavos: metaFinal(r),
    pessoas: r.pessoas,
    // Só os itens preenchidos viram custos de verdade
    custos: itens.map((i) => ({
      nome: i.nome.trim() || 'Item da viagem',
      categoria: i.categoria,
      valorUnitarioCentavos: i.valorUnitarioCentavos,
      base: i.base,
      situacao: i.situacao,
      ...(i.situacao === 'PARCELADO' && { parcelas: i.parcelas, parcelasPagas: i.parcelasPagas }),
    })),
    estimativa: { companhia: r.companhia, pessoas: r.pessoas },
  };
}

/** Viagem migrada ou criada sem destino: reaproveita o que já existe */
function rascunhoDaViagem(v?: ViagemResumo): Partial<Rascunho> | undefined {
  if (!v) return undefined;
  return {
    ...(v.metaCentavos > 0 && { metaCentavos: v.metaCentavos, metaEditada: true }),
    ...(v.dataIda && { dataIda: v.dataIda }),
    ...(v.dataVolta && { dataVolta: v.dataVolta }),
  };
}

export function OnboardingScreen({ viagemId }: { viagemId: string | null }) {
  const router = useRouter();
  const qc = useQueryClient();
  const reduce = useReducedMotion() ?? false;
  const user = useAuthStore((s) => s.user);
  const setViagemAtiva = useAuthStore((s) => s.setViagemAtiva);
  const { data: me } = useMeQuery();
  const viagemExistente = me?.viagens.find((v) => v.id === viagemId);

  const chave = `bplanner-onboarding:${user?.id ?? 'anonimo'}:${viagemId ?? 'nova'}`;
  const { rascunho, atualizar, limpar, carregado } = useRascunho(chave, rascunhoDaViagem(viagemExistente));

  // Os dados da viagem existente chegam depois do primeiro render: pré-preenche a meta e as datas uma vez
  useEffect(() => {
    if (!carregado || !viagemExistente) return;
    if (rascunho.metaCentavos === 0 && !rascunho.dataIda) atualizar(rascunhoDaViagem(viagemExistente) ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carregado, viagemExistente?.id]);

  const [etapa, setEtapa] = useState<Etapa>(viagemId ? 'destinos' : 'entrada');
  const [modoEntrada, setModoEntrada] = useState<'nova' | 'convite'>('nova');
  const [direcao, setDirecao] = useState(1);
  const [criada, setCriada] = useState<string | null>(null);

  const indice = PASSOS.indexOf(etapa);
  const valida = useMemo(() => etapaValida(etapa, rascunho), [etapa, rascunho]);

  const salvar = useMutation({
    mutationFn: () => (viagemId ? atualizarViagemService(viagemId, paraDto(rascunho)) : criarViagemService(paraDto(rascunho))),
    onSuccess: async (viagem) => {
      limpar();
      setViagemAtiva(viagem.id);
      await qc.invalidateQueries({ queryKey: ME_KEY });
      if (rascunho.companhia === 'grupo') {
        setDirecao(1);
        setCriada(viagem.id);
      } else {
        toast.success('Viagem criada! Boa jornada.');
        router.replace('/dashboard');
      }
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível salvar a viagem.')),
  });

  const ir = (proxima: Etapa, dir: number) => {
    setDirecao(dir);
    setEtapa(proxima);
  };
  const avancar = () => {
    if (etapa === 'entrada') return ir('destinos', 1);
    if (etapa === 'revisao') return salvar.mutate();
    ir(PASSOS[indice + 1], 1);
  };
  const voltar = () => {
    if (indice <= 0) return viagemId ? undefined : ir('entrada', -1);
    ir(PASSOS[indice - 1], -1);
  };

  const sair = () => {
    encerrarSessao();
    qc.clear();
    router.replace('/login');
  };

  const conteudo = criada ? (
    <EtapaConvidar viagemId={criada} onConcluir={() => router.replace('/dashboard')} />
  ) : etapa === 'entrada' ? (
    <EtapaEntrada modo={modoEntrada} onModo={setModoEntrada} nome={me?.nome ?? user?.nome} />
  ) : etapa === 'destinos' ? (
    <EtapaDestinos rascunho={rascunho} atualizar={atualizar} />
  ) : etapa === 'datas' ? (
    <EtapaDatas rascunho={rascunho} atualizar={atualizar} />
  ) : etapa === 'pessoas' ? (
    <EtapaPessoas rascunho={rascunho} atualizar={atualizar} />
  ) : etapa === 'meta' ? (
    <EtapaMeta rascunho={rascunho} atualizar={atualizar} />
  ) : (
    <EtapaRevisao rascunho={rascunho} />
  );

  const mostrarRodape = !criada && !(etapa === 'entrada' && modoEntrada === 'convite');

  return (
    <BoardingPassCard
      stub={<MapaDoRoteiro rascunho={rascunho} />}
      className="max-w-[1000px] lg:h-[min(640px,calc(100dvh-2rem))]"
      contentClassName="max-w-md min-h-0 justify-start lg:h-full"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Progresso */}
        <div className="mb-5 flex items-center justify-between gap-4">
          {indice >= 0 && !criada ? (
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                Passo {indice + 1} de {PASSOS.length} · {TITULOS[etapa]}
              </p>
              <div className="mt-2 flex gap-1.5" aria-hidden="true">
                {PASSOS.map((p, i) => (
                  <span key={p} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                    <motion.span
                      className="block h-full rounded-full bg-primary"
                      initial={false}
                      animate={{ width: i <= indice ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <span />
          )}
          <button type="button" onClick={sair} className="text-xs font-semibold text-muted-foreground hover:text-foreground">
            Sair
          </button>
        </div>

        {/* Etapa atual (rola por dentro quando o conteúdo é maior que o cartão) */}
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1 pb-2">
          {carregado && (
            <AnimatePresence mode="wait" custom={direcao} initial={false}>
              <motion.div
                key={criada ? 'convidar' : etapa}
                custom={direcao}
                initial={reduce ? false : { opacity: 0, x: 16 * direcao }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 * direcao }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                {conteudo}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {mostrarRodape && (
          <footer className="mt-3 flex items-center justify-between gap-3 border-t border-dashed border-border pt-4">
            {etapa !== 'entrada' && !(viagemId && indice === 0) ? (
              <Button variant="ghost" onClick={voltar} leftIcon={<ArrowLeft size={16} />}>
                Voltar
              </Button>
            ) : (
              <span />
            )}
            <Button
              size="lg"
              onClick={avancar}
              disabled={!valida}
              isLoading={salvar.isPending}
              className="min-w-36"
            >
              {etapa === 'revisao' ? (viagemId ? 'Salvar viagem' : 'Criar viagem') : 'Continuar'}
            </Button>
          </footer>
        )}
      </div>
    </BoardingPassCard>
  );
}
