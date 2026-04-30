import type { HTMLAttributes } from 'react'
import type { PatientStatus } from '../../types'
import { cn } from '../../utils/cn'

type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: PatientStatus
  tone?: BadgeTone
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-primary-soft text-foreground',
  info: 'bg-accent-soft text-accent',
  success: 'bg-[var(--status-stable-bg)] text-[var(--status-stable-text)]',
  warning:
    'bg-[var(--status-recovering-bg)] text-[var(--status-recovering-text)]',
  danger: 'bg-[var(--status-critical-bg)] text-[var(--status-critical-text)]',
}

const statusClasses: Record<PatientStatus, string> = {
  Critical: 'bg-[var(--status-critical-bg)] text-[var(--status-critical-text)]',
  Stable: 'bg-[var(--status-stable-bg)] text-[var(--status-stable-text)]',
  Recovering:
    'bg-[var(--status-recovering-bg)] text-[var(--status-recovering-text)]',
  Discharged:
    'bg-[var(--status-discharged-bg)] text-[var(--status-discharged-text)]',
}

export function Badge({
  children,
  className,
  status,
  tone = 'neutral',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.01em]',
        status ? statusClasses[status] : toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children ?? status}
    </span>
  )
}
