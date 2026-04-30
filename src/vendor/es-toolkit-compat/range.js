export default function range(start, end, step = 1) {
  const actualStart = end === undefined ? 0 : start
  const actualEnd = end === undefined ? start : end
  const size = Math.max(Math.ceil((actualEnd - actualStart) / step), 0)

  return Array.from({ length: size }, (_, index) => actualStart + index * step)
}
