import { LoaderCircle } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-[color-mix(in_srgb,var(--app-primary)_88%,white)]',
  secondary:
    'border border-border bg-surface text-foreground hover:bg-surface-elevated',
  ghost:
    'bg-transparent text-muted hover:bg-primary-soft hover:text-foreground',
  danger:
    'bg-danger text-white hover:bg-[color-mix(in_srgb,var(--app-danger)_88%,white)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-xl px-3 text-sm',
  md: 'h-11 rounded-xl px-4 text-sm',
  lg: 'h-12 rounded-xl px-5 text-base',
}

export function Button({
  children,
  className,
  disabled,
  iconLeft,
  iconRight,
  loading = false,
  size = 'md',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!loading ? iconRight : null}
    </button>
  )
}
