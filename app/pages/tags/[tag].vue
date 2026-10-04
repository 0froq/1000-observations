<script setup lang="ts">
import type { ObservationTag } from '#shared/observation-tags'
import type { ObservationListItem } from '~/composables/useObservations'
import { isObservationTag, OBSERVATION_TAG_LABELS } from '#shared/observation-tags'
import { filterObservations, sortObservations, useObservationsLoader } from '~/composables/useObservations'

const route = useRoute()
const { t, locale } = useI18n()
const copy = useCopy()
const link = useKitLink()
const tagParam = computed(() => String(route.params.tag))

if (!isObservationTag(tagParam.value))
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const { observations } = useObservationsLoader()
const { q, tags, sort } = useObservationFilters()

const routeTag = computed(() => tagParam.value as ObservationTag)

const filtered = computed(() => {
  const list = (observations.value ?? []) as ObservationListItem[]
  const extra = tags.value.filter(t => t !== routeTag.value)
  const withTag = filterObservations(list, { q: q.value, tags: [routeTag.value, ...extra] })
  return sortObservations(withTag, sort.value)
})

const tagLabel = computed(() => {
  const labels = OBSERVATION_TAG_LABELS[tagParam.value as keyof typeof OBSERVATION_TAG_LABELS]
  return locale.value === 'zh' ? labels.zh : labels.en
})

useHead({ title: () => tagLabel.value })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('obs.kicker')"
      kicker-name="obs.kicker"
      :title="tagLabel"
      title-name="obs.tag"
      :lede="t('obs.tagLede', { tag: tagLabel })"
      compact
    >
      <template #meta>
        <NuxtLink :to="link('/tags')">
          {{ t('obs.allTags') }}
        </NuxtLink>
      </template>
    </PageHead>
    <section class="l-section">
      <ObsToolbar />
    </section>
    <ObsEntryList :items="filtered" />
  </Sheet>
</template>
