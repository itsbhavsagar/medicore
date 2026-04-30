import { create } from 'zustand'
import type { ToastItem, ToastTone } from '../types'

const TOAST_AUTO_DISMISS_MS = 4000

interface ToastStoreState {
  toasts: ToastItem[]
  dismiss: (toastId: string) => void
  show: (toast: Omit<ToastItem, 'id'> & { id?: string }) => void
}

export const useToastStore = create<ToastStoreState>((set) => ({
  toasts: [],
  dismiss: (toastId) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== toastId),
    })),
  show: ({ id, message, title, tone }) => {
    const toastId = id ?? `${tone}-${Date.now()}`

    set((state) => ({
      toasts: [
        {
          id: toastId,
          message,
          title,
          tone,
        },
        ...state.toasts.filter((toast) => toast.id !== toastId),
      ],
    }))

    window.setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== toastId),
      }))
    }, TOAST_AUTO_DISMISS_MS)
  },
}))

export const toastPresets: Record<
  ToastTone,
  { accentClass: string }
> = {
  success: { accentClass: 'bg-success' },
  error: { accentClass: 'bg-danger' },
  info: { accentClass: 'bg-accent' },
}
