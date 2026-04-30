export default function omit(object, keys) {
  const entries = Object.entries(object ?? {})
  const excludedKeys = new Set(Array.isArray(keys) ? keys : [keys])

  return Object.fromEntries(entries.filter(([key]) => !excludedKeys.has(key)))
}
