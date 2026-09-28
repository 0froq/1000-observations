import type { ObservationTag } from '#shared/observation-tags'
import type { ObservationSort } from './useObservations'
import { isObservationTag } from '#shared/observation-tags'

function parseTags(raw: unknown): ObservationTag[] {
  if (typeof raw !== 'string' || !raw.trim())
    return []
  return raw.split(',').map(s => s.trim()).filter(isObservationTag)
}

function parseSort(raw: unknown): ObservationSort {
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

  function toggleTag(tag: ObservationTag) {
    const set = new Set(tags.value)
    if (set.has(tag))
      set.delete(tag)
    else
      set.add(tag)
    const joined = [...set].join(',')
    pushQuery({ tags: joined || undefined })
  }

  function clearTags() {
    pushQuery({ tags: undefined })
  }

  function setSort(value: ObservationSort) {
    pushQuery({ sort: value === 'number' ? undefined : value })
  }

  return { q, tags, sort, setSearch, toggleTag, clearTags, setSort }
}
