'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Map as MapIcon, Ticket } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { mensagemDeErro } from '@/shared/api/client';
import { ME_KEY, rotaInicial } from '@/features/auth/api/hooks';
import { meService } from '@/features/auth/api/services';
import { useConvitePreviaQuery } from '@/features/convites/api/hooks';
import { aceitarConviteService } from '@/features/convites/api/services';
import { dataCurta } from '@/shared/utils/datas';
import { Opcao, TituloEtapa } from './comum';

/** Aceita o link inteiro (…/convite/ABC123XY) ou só o código */
function extrairCodigo(texto: string) {
  const t = texto.trim();
  const doLink = t.match(/convite\/([A-Za-z0-9]+)/);
  return (doLink ? doLink[1] : t).toUpperCase().replace(/[^A-Z0-9]/g, '');
}

export function EtapaEntrada({
  modo,
  onModo,
  nome,
}: {
  modo: 'nova' | 'convite';
  onModo: (m: 'nova' | 'convite') => void;
  nome?: string;
}) {
  return (
    <div>
      <TituloEtapa
        titulo={nome ? `Bora, ${nome}!` : 'Bora planejar?'}
        subtitulo="Comece uma viagem nova ou entre numa que alguém já criou."
      />
      <div className="space-y-2.5" role="radiogroup" aria-label="Como você quer começar">
        <Opcao
          name="entrada"
          selecionada={modo === 'nova'}
          onSelecionar={() => onModo('nova')}
          icone={<MapIcon size={18} />}
          titulo="Planejar uma viagem nova"
          descricao="Destino, datas, quem vai e quanto vai custar. Leva uns 2 minutos."
        />
        <Opcao
          name="entrada"
          selecionada={modo === 'convite'}
          onSelecionar={() => onModo('convite')}
          icone={<Ticket size={18} />}
          titulo="Tenho um convite"
          descricao="Alguém já criou a viagem e te mandou o link ou o código."
        />
      </div>

      {modo === 'convite' && <EntrarComConvite />}
    </div>
  );
}

function EntrarComConvite() {
  const router = useRouter();
  const qc = useQueryClient();
  const [texto, setTexto] = useState('');
  const codigo = extrairCodigo(texto);
  const { data: previa, isFetching, isError } = useConvitePreviaQuery(codigo.length >= 6 ? codigo : null);

  const aceitar = useMutation({
    mutationFn: () => aceitarConviteService(codigo),
    onSuccess: async ({ viagemId }) => {
      toast.success('Você entrou na viagem!');
      const me = await qc.fetchQuery({ queryKey: ME_KEY, queryFn: meService, staleTime: 0 });
      router.replace(rotaInicial(me, viagemId));
    },
    onError: (erro) => toast.error(mensagemDeErro(erro, 'Não foi possível entrar na viagem.')),
  });

  const paradas = previa?.viagem.paradas ?? [];

  return (
    <div className="mt-5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      <Input
        label="Link ou código do convite"
        placeholder="Cole o link ou digite o código"
        value={texto}
        autoFocus
        onChange={(e) => setTexto(e.target.value)}
        error={isError && codigo.length >= 6 ? 'Convite não encontrado. Confira com quem te convidou.' : undefined}
        hint={isFetching ? 'Procurando a viagem…' : undefined}
      />

      {previa && (
        <div className="rounded-xl border border-primary/25 bg-primary/[0.06] p-3.5 animate-in fade-in zoom-in-95 duration-200">
          <p className="text-xs text-muted-foreground">
            {previa.convidadoPor ? `${previa.convidadoPor} te convidou para` : 'Convite para'}
          </p>
          <p className="mt-0.5 font-display text-xl text-foreground">
            {paradas.length ? paradas.map((p) => p.nome).join(' → ') : previa.viagem.nome}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {previa.viagem.dataIda && `${dataCurta(previa.viagem.dataIda)} · `}
            {previa.participantes.join(', ')}
          </p>
          <Button className="mt-3 w-full" isLoading={aceitar.isPending || aceitar.isSuccess} onClick={() => aceitar.mutate()}>
            Entrar na viagem
          </Button>
        </div>
      )}
    </div>
  );
}
