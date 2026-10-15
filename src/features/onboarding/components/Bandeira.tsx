/* eslint-disable @next/next/no-img-element */
import { urlBandeira } from '@/shared/utils/bandeira';
import { cn } from '@/lib/utils';

/** Bandeira do país (imagem, porque emoji de bandeira não aparece no Windows) */
export function Bandeira({ codigo, className }: { codigo: string | null | undefined; className?: string }) {
  const url = urlBandeira(codigo, 40);
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      width={20}
      height={14}
      loading="lazy"
      className={cn('h-3.5 w-5 shrink-0 rounded-[3px] object-cover ring-1 ring-foreground/10', className)}
    />
  );
}
