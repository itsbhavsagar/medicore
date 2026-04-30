import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToasts } from '../../hooks/useToasts'
import type { ToastTone } from '../../types'
import { cn } from '../../utils/cn'

const toastIcons: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
}

const toneClasses: Record<ToastTone, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-accent',
}

export function ToastViewport() {
  const { dismiss, toasts } = useToasts()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = toastIcons[toast.tone]

          return (
            <motion.div
              animate={{ opacity: 1, x: 0, y: 0 }}
              className="pointer-events-auto overflow-hidden rounded-xl border border-border bg-surface shadow-[var(--app-shadow)]"
              exit={{ opacity: 0, x: 24, y: -8 }}
              initial={{ opacity: 0, x: 24, y: -8 }}
              key={toast.id}
              transition={{ duration: 0.22 }}
            >
              <div className="flex items-start gap-3 p-4">
                <div
                  className={cn(
                    'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-elevated',
                    toneClasses[toast.tone],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {toast.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    {toast.message}
                  </p>
                </div>
                <button
                  className="cursor-pointer text-subtle transition hover:text-foreground"
                  onClick={() => dismiss(toast.id)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
