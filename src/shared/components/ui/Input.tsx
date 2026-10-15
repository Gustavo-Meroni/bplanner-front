'use client';

import React, { useId, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: string;
  /** Elemento à direita, dentro do campo (ex.: botão de mostrar senha) */
  rightSlot?: React.ReactNode;
  /** Classes do wrapper externo */
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightSlot, className, containerClassName, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    const messageId = `${inputId}-message`;
    const message = error ?? hint;

    return (
      <div className={cn('flex w-full flex-col gap-1', containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-[13px] font-semibold text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="pointer-events-none absolute left-3.5 select-none text-sm font-semibold text-muted-foreground">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className={cn(
              'h-11 w-full rounded-xl border bg-background px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus-visible:outline-none',
              leftAddon && 'pl-10',
              rightSlot && 'pr-12',
              error
                ? 'border-destructive focus:ring-4 focus:ring-destructive/15'
                : 'border-border hover:border-foreground/25 focus:border-ring focus:ring-4 focus:ring-ring/15',
              className
            )}
            {...props}
          />
          {rightSlot && <div className="absolute right-1.5 flex items-center">{rightSlot}</div>}
        </div>
        {message && (
          <p
            id={messageId}
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium',
              error ? 'text-destructive animate-in fade-in slide-in-from-top-1 duration-200' : 'text-muted-foreground'
            )}
          >
            {error && <AlertCircle size={13} className="shrink-0" />}
            {message}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

/** Campo de senha com botão de mostrar/ocultar. */
export const PasswordInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'type' | 'rightSlot'>>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        rightSlot={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        }
        {...props}
      />
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
