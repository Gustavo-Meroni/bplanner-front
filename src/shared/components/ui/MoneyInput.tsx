'use client';

import React from 'react';
import { Input } from './Input';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  /** Valor em centavos */
  value: number;
  onChange: (centavos: number) => void;
}

const formato = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Campo de dinheiro em reais. Digita-se só números e o valor anda da direita
 * para a esquerda, como em app de banco: 1 → 0,01; 12345 → 123,45.
 */
export function MoneyInput({ value, onChange, ...props }: MoneyInputProps) {
  return (
    <Input
      {...props}
      inputMode="numeric"
      leftAddon="R$"
      value={value ? formato.format(value / 100) : ''}
      placeholder={props.placeholder ?? '0,00'}
      onChange={(e) => {
        const digitos = e.target.value.replace(/\D/g, '').slice(0, 11);
        onChange(digitos ? Number(digitos) : 0);
      }}
      className={`tabular-nums ${props.className ?? ''}`}
    />
  );
}
