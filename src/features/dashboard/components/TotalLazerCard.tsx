import { formatCurrency } from '@/shared/utils/format-currency';

interface TotalLazerCardProps {
  valor: number;
}

export function TotalLazerCard({ valor }: TotalLazerCardProps) {
  return (
    <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border flex flex-col justify-center items-start min-h-[120px]">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Total em Caixa (Lazer)
      </span>
      <span className="text-2xl font-bold text-secondary mt-1">{formatCurrency(valor)}</span>
    </div>
  );
}
