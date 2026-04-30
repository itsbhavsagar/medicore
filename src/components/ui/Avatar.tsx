import type { HTMLAttributes } from 'react'
import type { PatientStatus } from '../../types'
import { cn } from '../../utils/cn'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  status?: PatientStatus
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

const statusClasses: Record<PatientStatus, string> = {
  Critical:
    'border-[color:var(--status-critical-text)]/12 bg-[var(--status-critical-bg)] text-[var(--status-critical-text)]',
  Stable:
    'border-[color:var(--status-stable-text)]/12 bg-[var(--status-stable-bg)] text-[var(--status-stable-text)]',
  Recovering:
    'border-[color:var(--status-recovering-text)]/12 bg-[var(--status-recovering-bg)] text-[var(--status-recovering-text)]',
  Discharged:
    'border-[color:var(--status-discharged-text)]/12 bg-[var(--status-discharged-bg)] text-[var(--status-discharged-text)]',
}

export function Avatar({ className, name, status, ...props }: AvatarProps) {
  return (
    <div
      aria-label={name}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-medium',
        status
          ? statusClasses[status]
          : 'border-primary/15 bg-primary-soft text-primary',
        className,
      )}
      role="img"
      {...props}
    >
      {getInitials(name)}
    </div>
  )
}
