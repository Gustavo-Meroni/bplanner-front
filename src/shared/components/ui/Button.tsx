import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground shadow-[inset_0_1px_0_hsl(0_0%_100%/0.25),0_8px_20px_-10px_hsl(var(--primary)/0.8)] hover:brightness-105',
  ghost: 'text-muted-foreground hover:bg-primary/10 hover:text-primary',
  danger: 'text-destructive hover:bg-destructive/10',
  outline: 'border border-border bg-card text-foreground hover:bg-muted',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-11 px-6 text-sm rounded-xl gap-2',
};

/** Classes do botão, para reutilizar em <Link> */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string
) {
  return cn(
    'inline-flex items-center justify-center font-semibold transition-[filter,background-color,color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
    </button>
  );
}
