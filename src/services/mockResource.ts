interface MockResourceOptions {
  maxDelayMs: number
  minDelayMs: number
}

const getDelay = ({ maxDelayMs, minDelayMs }: MockResourceOptions) =>
  Math.floor(Math.random() * (maxDelayMs - minDelayMs + 1)) + minDelayMs

export function createMockResource<T>(
  loader: () => T,
  options: MockResourceOptions,
) {
  let cached: T | null = null
  let pending: Promise<T> | null = null

  return async () => {
    if (cached) {
      return cached
    }

    if (!pending) {
      pending = new Promise<T>((resolve) => {
        window.setTimeout(() => {
          const response = loader()

          cached = response
          pending = null
          resolve(response)
        }, getDelay(options))
      })
    }

    return pending
  }
}
