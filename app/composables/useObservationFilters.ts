import type { ObservationTag } from '#shared/observation-tags'
import type { SiteSort } from './useSites'
import { isObservationTag, OBSERVATION_TAGS } from '#shared/observation-tags'

function parseTags(raw: unknown): ObservationTag[] {
  if (typeof raw !== 'string' || !raw.trim())
    return []
  return raw.split(',').map(s => s.trim()).filter(isObservationTag)
}

function parseSort(raw: unknown): SiteSort {
  return raw === 'newest' ? 'newest' : 'number'
}

/** Tag multi-filter, search, and sort — synced to URL query on the index and tag pages. */
export function useObservationFilters() {
  const route = useRoute()
  const router = useRouter()

  const q = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
  const tags = computed(() => parseTags(route.query.tags))
  const sort = computed(() => parseSort(route.query.sort))

  function pushQuery(patch: Record<string, string | undefined>) {
    const next = { ...route.query }
    for (const [key, value] of Object.entries(patch)) {
      if (value == null || value === '')
        delete next[key]
      else
        next[key] = value
    }
    router.replace({ query: next })
  }

  function setSearch(value: string) {
    pushQuery({ q: value || undefined })
  }

  function setTags(next: readonly string[]) {
    const ordered = OBSERVATION_TAGS.filter(tag => next.includes(tag))
    pushQuery({ tags: ordered.length ? ordered.join(',') : undefined })
  }

  function toggleTag(tag: ObservationTag) {
    const set = new Set(tags.value)
    if (set.has(tag))
      set.delete(tag)
    else
      set.add(tag)
    setTags([...set])
  }

  function clearTags() {
    setTags([])
  }

  function setSort(value: SiteSort) {
    pushQuery({ sort: value === 'number' ? undefined : value })
  }

  return { q, tags, sort, setSearch, setTags, toggleTag, clearTags, setSort }
}
