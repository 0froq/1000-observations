import type { ObservationTag } from '#shared/observation-tags'
import { formatObservationId } from '#shared/observations'

export interface ObservationListItem {
  path: string
  number: number
  title: string
  description?: string | null
  date: string
  tags: ObservationTag[]
  siteName?: string
  siteUrl?: string
  body?: unknown
}

export type ObservationSort = 'number' | 'newest'

export function useObservationsLoader() {
  const { data: observations, refresh } = useAsyncData('observations-all', () =>
    queryCollection('observations')
      .select('path', 'number', 'title', 'description', 'date', 'tags', 'siteName', 'siteUrl', 'body')
      .order('number', 'ASC')
      .all())
  return { observations, refresh }
}

export function sortObservations(items: ObservationListItem[], sort: ObservationSort): ObservationListItem[] {
  const copy = [...items]
  if (sort === 'newest') {
    copy.sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number)
    return copy
  }
  copy.sort((a, b) => a.number - b.number)
  return copy
}

export function filterObservations(
  items: ObservationListItem[],
  query: { q: string, tags: ObservationTag[] },
): ObservationListItem[] {
  const q = query.q.trim().toLowerCase()
  const tagSet = new Set(query.tags)
  return items.filter((item) => {
    if (tagSet.size && !item.tags.some(t => tagSet.has(t)))
      return false
    if (!q)
      return true
    const hay = [
      formatObservationId(item.number),
      item.title,
      item.description ?? '',
      item.siteName ?? '',
    ].join(' ').toLowerCase()
    return hay.includes(q)
  })
}

export function relatedByTags(
  items: ObservationListItem[],
  current: ObservationListItem,
  limit = 4,
): ObservationListItem[] {
  const tags = new Set(current.tags)
  if (!tags.size)
    return []
  return items
    .filter(o => o.number !== current.number && o.tags.some(t => tags.has(t)))
    .sort((a, b) => {
      const score = (o: ObservationListItem) => o.tags.filter(t => tags.has(t)).length
      return score(b) - score(a) || a.number - b.number
    })
    .slice(0, limit)
}

export interface ObservedSite {
  name: string
  url: string
  count: number
  numbers: number[]
}

export function groupObservedSites(items: ObservationListItem[]): ObservedSite[] {
  const map = new Map<string, ObservedSite>()
  for (const item of items) {
    if (!item.siteName || !item.siteUrl)
      continue
    const key = item.siteUrl
    const existing = map.get(key)
    if (existing) {
      existing.count++
      existing.numbers.push(item.number)
    }
    else {
      map.set(key, {
        name: item.siteName,
        url: item.siteUrl,
        count: 1,
        numbers: [item.number],
      })
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
