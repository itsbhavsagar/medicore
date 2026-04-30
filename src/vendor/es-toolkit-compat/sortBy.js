import { getIteratee } from './shared.js'

export default function sortBy(collection, iteratee) {
  const iteratees = Array.isArray(iteratee) ? iteratee : [iteratee]
  const resolvers = iteratees.map((item) => getIteratee(item))

  return [...(collection ?? [])].sort((left, right) => {
    for (const resolve of resolvers) {
      const leftValue = resolve(left)
      const rightValue = resolve(right)

      if (leftValue === rightValue) {
        continue
      }

      return leftValue > rightValue ? 1 : -1
    }

    return 0
  })
}
