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
        'rounded-[28px] border border-border bg-surface p-6 shadow-[var(--app-shadow)] backdrop-blur-sm transition duration-200',
        interactive &&
          'cursor-pointer hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface-elevated',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
