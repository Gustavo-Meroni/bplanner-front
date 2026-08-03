import { HelpCircle } from 'lucide-react';

interface InfoTooltipProps {
    text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
    return (
        <div className="relative flex items-center group cursor-help">
            <HelpCircle
                size={14}
                className="text-muted-foreground/50 hover:text-primary transition-colors"
            />

            {/* Balão de Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-foreground text-background text-xs font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center shadow-xl">
                {text}
                {/* Seta do balão apontando para baixo */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
            </div>
        </div>
    );
}