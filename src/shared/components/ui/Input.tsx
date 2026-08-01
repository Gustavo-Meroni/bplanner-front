import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftAddon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-muted-foreground text-sm select-none">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 bg-card border rounded-xl outline-none text-sm text-foreground transition-all placeholder:text-muted-foreground',
              leftAddon ? 'pl-8' : '',
              error
                ? 'border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20' // <-- Trocado de red para destructive
                : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/10',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs font-medium text-destructive">{error}</span> // <-- Trocado de red para destructive
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';