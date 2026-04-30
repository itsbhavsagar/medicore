import type { HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-[linear-gradient(110deg,var(--app-border),color-mix(in_srgb,var(--app-border)_72%,white),var(--app-border))] bg-[length:200%_100%]',
        className,
      )}
      {...props}
    />
  )
}
