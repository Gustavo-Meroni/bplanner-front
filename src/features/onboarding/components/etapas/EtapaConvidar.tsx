'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Copy, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/Button';
import { conviteDaViagemService } from '@/features/viagens/api/services';
import { TituloEtapa } from './comum';

/** Depois de criar a viagem em grupo: link para chamar quem vai junto */
export function EtapaConvidar({ viagemId, onConcluir }: { viagemId: string; onConcluir: () => void }) {
  const { data: convite, isLoading } = useQuery({
    queryKey: ['convite-da-viagem', viagemId],
    queryFn: () => conviteDaViagemService(viagemId),
  });
  const [copiado, setCopiado] = useState(false);
  const link = convite && typeof window !== 'undefined' ? `${window.location.origin}${convite.caminho}` : '';
  const podeCompartilhar = typeof navigator !== 'undefined' && 'share' in navigator;

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiado(true);
      toast.success('Link copiado');
      window.setTimeout(() => setCopiado(false), 2000);
    } catch {
      toast.error('Não deu para copiar. Selecione o link e copie à mão.');
    }
  };

  return (
    <div>
      <TituloEtapa
        titulo="Viagem criada! Agora chame quem vai junto"
        subtitulo="Quem abrir o link cria a conta (ou entra) e já cai dentro da viagem."
      />

      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-1.5 pl-3.5">
        {isLoading ? (
          <span className="h-4 flex-1 animate-pulse rounded bg-muted" />
        ) : (
          <input
            readOnly
            value={link}
            aria-label="Link de convite"
            onFocus={(e) => e.currentTarget.select()}
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none"
          />
        )}
        <Button size="md" variant="outline" onClick={copiar} disabled={!link} leftIcon={copiado ? <Check size={16} /> : <Copy size={16} />}>
          {copiado ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
      {convite && (
        <p className="mt-2 text-xs text-muted-foreground">
          Código: <strong className="font-semibold tracking-wider text-foreground">{convite.codigo}</strong>
        </p>
      )}

      <div className="mt-6 space-y-2.5">
        {podeCompartilhar && link && (
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            leftIcon={<Share2 size={16} />}
            onClick={() => navigator.share({ title: 'Bora viajar?', text: 'Entra na nossa viagem no BPlanner:', url: link }).catch(() => {})}
          >
            Compartilhar
          </Button>
        )}
        <Button size="lg" className="w-full" onClick={onConcluir}>
          Ir para o painel
        </Button>
      </div>
    </div>
  );
}
