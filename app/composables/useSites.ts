import type { MaybeRefOrGetter } from 'vue'
import type { ObservationTag } from '#shared/observation-tags'
import type { NavGroup, NavItem } from '#shared/site-nav'
import { computed, toValue } from 'vue'
import { formatObservationId } from '#shared/observations'
import { flattenNav, navHasChildren, sidebarGroups } from '#shared/site-nav'

export interface SiteListItem {
  path: string
  number: number
  title: string
  description?: string | null
  date: string
  tags: ObservationTag[]
  url?: string | null
  docs: number
}

export type SiteSort = 'number' | 'newest'

export function useSitesLoader() {
  const { data: sites, refresh } = useAsyncData('sites-all', async () => {
    const all = await queryCollection('documents')
      .select('path', 'number', 'title', 'description', 'date', 'tags', 'url')
      .all()
    return all
      .filter((item): item is typeof item & { number: number, date: string } => item.number != null && item.date != null)
      .map(site => ({
        path: site.path,
        number: site.number,
        title: site.title,
        description: site.description,
        date: site.date,
        tags: site.tags ?? [],
        url: site.url,
        docs: all.filter(item => item.path === site.path || item.path.startsWith(`${site.path}/`)).length,
      }))
      .sort((a, b) => a.number - b.number)
  })
  return { sites, refresh }
}

export function sortSites(items: SiteListItem[], sort: SiteSort): SiteListItem[] {
  const copy = [...items]
  if (sort === 'newest') {
    copy.sort((a, b) => b.date.localeCompare(a.date) || b.number - a.number)
    return copy
  }
  copy.sort((a, b) => a.number - b.number)
  return copy
}

export function filterSites(
  items: SiteListItem[],
  query: { q: string, tags: ObservationTag[] },
): SiteListItem[] {
  const q = query.q.trim().toLowerCase()
  const tagSet = new Set(query.tags)
  return items.filter((item) => {
    if (tagSet.size && !item.tags.some(tag => tagSet.has(tag)))
      return false
    if (!q)
      return true
    const hay = [
      formatObservationId(item.number),
      item.title,
      item.description ?? '',
      item.url ?? '',
    ].join(' ').toLowerCase()
    return hay.includes(q)
  })
}

export async function useSiteTree(id: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(id))
  const { data } = await useAsyncData(
    () => `site-tree-${key.value}`,
    () => queryCollection('documents').where('path', 'LIKE', `/sites/${key.value}%`).all(),
    { watch: [key] },
  )
  const docs = computed(() => data.value ?? [])
  const site = computed(() => docs.value.find(item => item.path === `/sites/${key.value}`) ?? null)
  const groups = computed(() => sidebarGroups(docs.value))
  const pages = computed(() => flattenNav(groups.value))
  const foldable = computed(() => navHasChildren(groups.value))
  return { docs, site, groups, pages, foldable }
}

export type { NavGroup, NavItem }
