export const OBSERVATION_GOAL = 1000

export const OBSERVATION_PAGE_SIZE = 24

/** Stable display id: 1 → `0001`. */
export function formatObservationId(n: number): string {
  return String(n).padStart(4, '0')
}

export function parseObservationId(id: string): number | null {
  const n = Number.parseInt(id, 10)
  if (!Number.isFinite(n) || n < 1 || n > OBSERVATION_GOAL)
    return null
  return n
}

export function observationPath(id: string | number): string {
  const num = typeof id === 'number' ? id : parseObservationId(id)
  if (num == null)
    return '/'
  return `/o/${formatObservationId(num)}`
}
