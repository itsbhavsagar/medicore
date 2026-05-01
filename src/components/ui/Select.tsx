import { ChevronDown } from 'lucide-react'
import type { ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode
}

export function Select({ children, className, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'h-10 w-full appearance-none rounded-xl border border-border bg-surface-elevated px-3 pr-10 text-sm text-foreground outline-none transition focus:border-primary',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-subtle">
        <ChevronDown className="h-4 w-4" />
      </span>
    </div>
  )
}
