export default function throttle(callback, wait = 0) {
  let timeoutId = null
  let pendingArgs = null
  let lastCallTime = 0

  const invoke = (context, args) => {
    lastCallTime = Date.now()
    callback.apply(context, args)
  }

  return function throttled(...args) {
    const now = Date.now()
    const remaining = wait - (now - lastCallTime)

    if (remaining <= 0) {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
        timeoutId = null
      }

      invoke(this, args)

      return
    }

    pendingArgs = args

    if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        timeoutId = null

        if (pendingArgs) {
          invoke(this, pendingArgs)
          pendingArgs = null
        }
      }, remaining)
    }
  }
}
