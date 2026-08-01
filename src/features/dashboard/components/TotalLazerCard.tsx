import { formatCurrency } from '@/shared/utils/format-currency';

export function TotalLazerCard({ valor }: { valor: number }) {
  return (
    <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border/50 flex flex-col justify-center items-start min-h-[120px]">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
        Total em Caixa (Lazer)
      </span>
      <span className="text-2xl font-bold text-primary mt-2 tracking-tight">{formatCurrency(valor)}</span>
    </div>
  );
}