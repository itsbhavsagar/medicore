import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')

export function Avatar({ className, name, ...props }: AvatarProps) {
  return (
    <div
      aria-label={name}
      className={cn(
        'inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/15 bg-[linear-gradient(135deg,var(--app-primary),var(--app-accent))] text-sm font-semibold text-white shadow-[0_16px_30px_rgba(99,102,241,0.24)]',
        className,
      )}
      role="img"
      {...props}
    >
      {getInitials(name)}
    </div>
  )
}
