import { Sparkles } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';
import { InfoTooltip } from '@/shared/components/ui/InfoTooltip';

interface TotalLazerCardProps {
  valor: number;
  isGoalReached?: boolean;
  variant?: 'featured' | 'compact'; // 💡 Nova Prop!
}

export function TotalLazerCard({ valor, isGoalReached = false, variant = 'featured' }: TotalLazerCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`relative p-6 rounded-[2rem] shadow-sm border flex flex-col justify-center items-start transition-all duration-700 ${isGoalReached ? 'bg-primary/10 border-primary/50' : 'bg-card border-border/50'
        } ${isCompact ? 'min-h-[140px]' : 'sm:p-8 min-h-[160px]'}`}
    >
      {isGoalReached && (
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full gap-3 relative z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isGoalReached ? 'text-primary' : 'text-muted-foreground'
            }`}>
            Total em Caixa (Lazer)
          </span>
          <InfoTooltip text="Tudo que ultrapassar a Meta Essencial. Dinheiro livre para passeios e compras!" />
        </div>

        {isGoalReached && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-full animate-in fade-in zoom-in duration-500 self-start">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
              Novo Foco
            </span>
          </div>
        )}
      </div>

      {/* 💡 Fonte Inteligente adaptada ao container */}
      <span
        className={`${isCompact ? 'text-3xl' : 'text-4xl sm:text-5xl'} font-black mt-4 tracking-tight relative z-10 ${isGoalReached ? 'text-foreground' : 'text-primary'
          }`}
      >
        {formatCurrency(valor)}
      </span>

      {isGoalReached && (
        <span className={`font-medium text-muted-foreground mt-2 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
          Todo novo aporte virá para cá! 🍹
        </span>
      )}
    </div>
  );
}