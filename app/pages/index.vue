<script setup lang="ts">
import type { SiteListItem } from '~/composables/useSites'
import { filterSites, sortSites, useSitesLoader } from '~/composables/useSites'

const { t } = useI18n()
const copy = useCopy()
const { sites } = useSitesLoader()
const { q, tags, sort } = useObservationFilters()

const filtered = computed(() => {
  const list = (sites.value ?? []) as SiteListItem[]
  return sortSites(filterSites(list, { q: q.value, tags: tags.value }), sort.value)
})

const count = computed(() => (sites.value ?? []).length)

useHead({ title: () => t('obs.indexTitle') })
useSeoMeta({ description: () => t('obs.indexLede') })
</script>

<template>
  <Sheet line>
    <PageHead
      class="is-screen"
      :kicker="copy('obs.kicker')"
      kicker-name="obs.kicker"
      :title="copy('obs.indexTitle')"
      title-name="obs.indexTitle"
      :lede="copy('obs.indexLede')"
      lede-name="obs.indexLede"
      :hand="copy('obs.hand')"
    >
      <template #meta>
        <ObsProgress :count="count" />
      </template>
    </PageHead>
    <section class="l-section">
      <ObsToolbar />
    </section>
    <ObsEntryList :items="filtered" />
  </Sheet>
</template>
