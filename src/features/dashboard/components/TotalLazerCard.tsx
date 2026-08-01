import { Sparkles } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format-currency';

interface TotalLazerCardProps {
  valor: number;
  isGoalReached?: boolean;
}

export function TotalLazerCard({ valor, isGoalReached = false }: TotalLazerCardProps) {
  return (
    <div
      className={`relative p-6 rounded-[2rem] shadow-sm border flex flex-col justify-center items-start min-h-[120px] transition-all duration-700 overflow-hidden ${isGoalReached
          ? 'bg-primary/10 border-primary/50'
          : 'bg-card border-border/50'
        }`}
    >
      {/* Efeito de brilho de fundo quando a meta é batida */}
      {isGoalReached && (
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      )}

      <div className="flex items-center justify-between w-full relative z-10">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${isGoalReached ? 'text-primary' : 'text-muted-foreground'
          }`}>
          Total em Caixa (Lazer)
        </span>

        {/* Badge Dinâmico de Novo Foco */}
        {isGoalReached && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/20 border border-primary/30 rounded-full animate-in fade-in zoom-in duration-500">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider">
              Novo Foco
            </span>
          </div>
        )}
      </div>

      <span
        className={`text-2xl font-bold mt-2 tracking-tight relative z-10 ${isGoalReached ? 'text-foreground' : 'text-primary'
          }`}
      >
        {formatCurrency(valor)}
      </span>

      {/* Mensagem motivacional que aparece só quando a meta é batida */}
      {isGoalReached && (
        <span className="text-xs font-medium text-muted-foreground mt-1 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          Todo novo aporte virá para cá! 🍹
        </span>
      )}
    </div>
  );
}