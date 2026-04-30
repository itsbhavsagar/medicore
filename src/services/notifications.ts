const DEFAULT_NOTIFICATION_URL = '/'

export async function registerAppServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return null
  }

  return navigator.serviceWorker.register('/sw.js')
}

export async function showAppNotification(title: string, body: string) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) {
    return
  }

  let permission = Notification.permission

  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }

  if (permission !== 'granted') {
    return
  }

  const registration = await navigator.serviceWorker.ready

  await registration.showNotification(title, {
    body,
    data: { url: DEFAULT_NOTIFICATION_URL },
    tag: title,
  })
}
