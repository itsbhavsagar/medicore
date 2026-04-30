import { useToastStore } from '../store/toastStore'

export const useToasts = () => {
  const toasts = useToastStore((state) => state.toasts)
  const show = useToastStore((state) => state.show)
  const dismiss = useToastStore((state) => state.dismiss)

  return {
    dismiss,
    show,
    toasts,
  }
}
