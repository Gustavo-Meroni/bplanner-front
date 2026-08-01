'use client';

import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthVisualSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-muted flex-col justify-between p-10 overflow-hidden">
      {/* Imagem de Fundo Unsplash */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      {/* Degradê Overlay (Usa background dinâmico ao invés de black) */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

      {/* Topo Esquerdo: Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="p-2.5 bg-primary/20 backdrop-blur-sm rounded-xl text-primary border border-primary/30">
          <Target size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          B<span className="text-primary">Planner</span>
        </h1>
      </div>

      {/* Base Esquerda: Cards Glassmorphism Inteligente */}
      <div className="relative z-10 space-y-4">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-background/40 border border-border/50 p-5 rounded-2xl shadow-lg"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-foreground font-medium flex items-center gap-2">✈️ Meta Europa</span>
            <span className="text-primary font-bold text-sm">83%</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>R$ 15.000</span>
            <span>R$ 18.000</span>
          </div>
          <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '83%' }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-primary rounded-full"
            />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-md bg-background/40 border border-border/50 p-5 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div>
            <p className="text-muted-foreground text-sm font-medium mb-1 flex items-center gap-2">
              💍 Poupança do Casal
            </p>
            <p className="text-xl font-bold text-foreground">+R$ 2.400</p>
          </div>
          <div className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
            +12.5% este mês
          </div>
        </motion.div>
      </div>
    </div>
  );
}