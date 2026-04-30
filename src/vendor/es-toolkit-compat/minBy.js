import { getIteratee } from './shared.js'

export default function minBy(collection, iteratee) {
  const resolve = getIteratee(iteratee)

  return [...(collection ?? [])].reduce((best, item) => {
    if (best === undefined) {
      return item
    }

    return resolve(item) < resolve(best) ? item : best
  }, undefined)
}
