import { getIteratee } from './shared.js'

export default function sumBy(collection, iteratee) {
  const resolve = getIteratee(iteratee)

  return [...(collection ?? [])].reduce((total, item) => total + Number(resolve(item) ?? 0), 0)
}
