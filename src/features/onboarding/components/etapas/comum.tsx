import { cn } from '@/lib/utils';

export function TituloEtapa({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <header className="mb-5">
      <h1 className="font-display text-2xl leading-tight text-foreground sm:text-[1.75rem]">{titulo}</h1>
      {subtitulo && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitulo}</p>}
    </header>
  );
}

/** Cartão de escolha (radio estilizado) */
export function Opcao({
  selecionada,
  onSelecionar,
  titulo,
  descricao,
  icone,
  name,
}: {
  selecionada: boolean;
  onSelecionar: () => void;
  titulo: string;
  descricao: string;
  icone?: React.ReactNode;
  name: string;
}) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors',
        'has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/15',
        selecionada ? 'border-primary bg-primary/[0.06]' : 'border-border hover:border-foreground/25'
      )}
    >
      <input type="radio" name={name} className="sr-only" checked={selecionada} onChange={onSelecionar} />
      {icone && (
        <span
          className={cn(
            'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors',
            selecionada ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          {icone}
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{titulo}</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">{descricao}</span>
      </span>
    </label>
  );
}

/** Bloco de informação discreto (clima, feriados, câmbio) */
export function Info({ icone, children, className }: { icone: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex gap-3 rounded-xl border border-border bg-muted/40 px-3.5 py-3', className)}>
      <span className="mt-0.5 shrink-0 text-primary">{icone}</span>
      <div className="min-w-0 text-[13px] leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}
