import { formatCurrency } from '@/shared/utils/format-currency';

interface TotalLazerCardProps {
  valor: number;
}

export function TotalLazerCard({ valor }: TotalLazerCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col justify-center items-start min-h-[120px]">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Total em Caixa (Lazer)
      </span>
      <span className="text-2xl font-bold text-[#2E6F40] mt-1">{formatCurrency(valor)}</span>
    </div>
  );
}
