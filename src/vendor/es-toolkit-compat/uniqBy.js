import { getIteratee } from './shared.js'

export default function uniqBy(collection, iteratee) {
  const resolve = getIteratee(iteratee)
  const seen = new Set()

  return [...(collection ?? [])].filter((item) => {
    const key = resolve(item)

    if (seen.has(key)) {
      return false
    }

    seen.add(key)

    return true
  })
}
