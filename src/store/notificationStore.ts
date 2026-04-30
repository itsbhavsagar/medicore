import { create } from 'zustand'
import type { NotificationItem } from '../types'

interface NotificationStoreState {
  notifications: NotificationItem[]
  add: (notification: Omit<NotificationItem, 'createdAt' | 'read'>) => void
  dismiss: (notificationId: string) => void
  markAllRead: () => void
}

export const useNotificationStore = create<NotificationStoreState>((set) => ({
  notifications: [],
  add: ({ id, title, message }) =>
    set((state) => ({
      notifications: [
        {
          id,
          title,
          message,
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
    })),
  dismiss: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== notificationId,
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
}))
