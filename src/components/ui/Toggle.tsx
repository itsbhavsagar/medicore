import { MoonStar, SunMedium } from 'lucide-react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean
}

export function Toggle({ checked, className, ...props }: ToggleProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        'relative inline-flex h-11 w-20 items-center rounded-full border border-border bg-surface px-1.5 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        className,
      )}
      role="switch"
      type="button"
      {...props}
    >
      <span className="absolute inset-y-0 left-2 flex items-center text-subtle">
        <SunMedium className="h-4 w-4" />
      </span>
      <span className="absolute inset-y-0 right-2 flex items-center text-subtle">
        <MoonStar className="h-4 w-4" />
      </span>
      <span
        className={cn(
          'relative z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition duration-200',
          checked ? 'translate-x-9' : 'translate-x-0',
        )}
      >
        {checked ? (
          <MoonStar className="h-4 w-4" />
        ) : (
          <SunMedium className="h-4 w-4" />
        )}
      </span>
    </button>
  )
}
