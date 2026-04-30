import { useNotificationStore } from '../store/notificationStore'

export const useNotifications = () => {
  const notifications = useNotificationStore((state) => state.notifications)
  const add = useNotificationStore((state) => state.add)
  const dismiss = useNotificationStore((state) => state.dismiss)

  return {
    notifications,
    add,
    dismiss,
  }
}
