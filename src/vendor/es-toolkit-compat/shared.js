const identity = (value) => value

const isFunction = (value) => typeof value === 'function'

const normalizePath = (path) =>
  String(path)
    .replace(/\[(\w+)\]/g, '.$1')
    .split('.')
    .filter(Boolean)

export const getIteratee = (iteratee) => {
  if (isFunction(iteratee)) {
    return iteratee
  }

  if (iteratee == null) {
    return identity
  }

  return (item) => get(item, iteratee)
}

export const get = (object, path, defaultValue) => {
  if (object == null) {
    return defaultValue
  }

  const result = normalizePath(path).reduce(
    (current, segment) => (current == null ? undefined : current[segment]),
    object,
  )

  return result === undefined ? defaultValue : result
}
