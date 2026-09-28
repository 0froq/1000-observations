<script setup lang="ts">
import { filterObservations, sortObservations, useObservationsLoader } from '~/composables/useObservations'

const { t } = useI18n()
const copy = useCopy()
const { observations } = useObservationsLoader()
const { q, tags, sort } = useObservationFilters()

const filtered = computed(() => {
  const list = (observations.value ?? []) as import('~/composables/useObservations').ObservationListItem[]
  return sortObservations(filterObservations(list, { q: q.value, tags: tags.value }), sort.value)
})

const count = computed(() => (observations.value ?? []).length)

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
