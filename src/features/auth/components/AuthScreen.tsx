'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { AuthVisualSide } from './AuthVisualSide';
import { AuthSegmentedTabs } from './AuthSegmentedTabs';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthScreenProps {
  initialTab?: 'login' | 'register';
}

export const AuthScreen = ({ initialTab = 'login' }: AuthScreenProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* CARD PRINCIPAL (SPLIT) */}
      <div className="w-full max-w-5xl bg-card rounded-[2.5rem] shadow-2xl border border-border/50 overflow-hidden flex flex-col lg:flex-row relative">
        {/* Lado Visual (Esquerda) */}
        <AuthVisualSide />

        {/* Lado Formulário (Direita) */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col relative z-20">
          {/* Topo Direito: Theme Toggle */}
          <div className="absolute top-6 right-6">
            <ThemeToggle />
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full mt-8 lg:mt-0">
            {/* Header Form */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {activeTab === 'login' ? 'Bem-vindo de volta' : 'Sua jornada a dois'}
              </h2>
              <p className="text-sm text-muted-foreground">
                Gerencie finanças, metas e o futuro do casal em um só lugar.
              </p>
            </div>

            {/* Segmented Control (Tabs) */}
            <AuthSegmentedTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Area do Form animada */}
            <div className="relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <LoginForm />
                  </motion.div>
                ) : (
                  <motion.div
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RegisterForm />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
