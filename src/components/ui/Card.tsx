import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  interactive?: boolean
}

export function Card({
  children,
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface p-5 shadow-[var(--app-shadow)] transition duration-200',
        interactive &&
          'cursor-pointer hover:border-primary/20 hover:bg-surface-elevated',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
