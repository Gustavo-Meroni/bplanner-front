'use client';

import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

export function AuthVisualSide() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 flex-col justify-between p-10 overflow-hidden">
      {/* Imagem de Fundo Unsplash */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070&auto=format&fit=crop')",
        }}
      />
      {/* Degradê Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/80" />

      {/* Topo Esquerdo: Logo */}
      <div className="relative z-10 flex items-center gap-3">
        <div className="p-2.5 bg-primary/20 backdrop-blur-sm rounded-xl text-primary border border-primary/30">
          <Target size={24} strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          B<span className="text-primary">Planner</span>
        </h1>
      </div>

      {/* Base Esquerda: Cards Glassmorphism */}
      <div className="relative z-10 space-y-4">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="backdrop-blur-md bg-black/40 border border-white/10 p-5 rounded-2xl"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-medium flex items-center gap-2">✈️ Meta Europa</span>
            <span className="text-primary font-bold text-sm">83%</span>
          </div>
          <div className="flex justify-between text-xs text-white/70 mb-2">
            <span>R$ 15.000</span>
            <span>R$ 18.000</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
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
          className="backdrop-blur-md bg-black/40 border border-white/10 p-5 rounded-2xl flex items-center justify-between"
        >
          <div>
            <p className="text-white/70 text-sm font-medium mb-1 flex items-center gap-2">
              💍 Poupança do Casal
            </p>
            <p className="text-xl font-bold text-white">+R$ 2.400</p>
          </div>
          <div className="px-3 py-1 bg-secondary/20 text-secondary border border-secondary/30 rounded-full text-xs font-bold">
            +12.5% este mês
          </div>
        </motion.div>
      </div>
    </div>
  );
}
