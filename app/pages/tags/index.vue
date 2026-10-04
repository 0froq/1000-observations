<script setup lang="ts">
import { OBSERVATION_TAG_LABELS, OBSERVATION_TAGS } from '#shared/observation-tags'
import { useSitesLoader } from '~/composables/useSites'

const { t, locale } = useI18n()
const copy = useCopy()
const link = useKitLink()
const { sites } = useSitesLoader()

const counts = computed(() => {
  const map = new Map<string, number>()
  for (const tag of OBSERVATION_TAGS)
    map.set(tag, 0)
  for (const obs of sites.value ?? []) {
    for (const tag of obs.tags ?? [])
      map.set(tag, (map.get(tag) ?? 0) + 1)
  }
  return map
})

function tagLabel(tag: typeof OBSERVATION_TAGS[number]): string {
  const labels = OBSERVATION_TAG_LABELS[tag]
  return locale.value === 'zh' ? labels.zh : labels.en
}

useHead({ title: () => t('obs.tagsTitle') })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('obs.kicker')"
      kicker-name="obs.kicker"
      :title="copy('obs.tagsTitle')"
      title-name="obs.tagsTitle"
      :lede="copy('obs.tagsLede')"
      lede-name="obs.tagsLede"
      compact
    />
    <ul class="obs-tag-index l-body">
      <li
        v-for="tag in OBSERVATION_TAGS"
        :key="tag"
      >
        <NuxtLink :to="link(`/tags/${tag}`)">
          <span class="obs-tag-index-label">{{ tagLabel(tag) }}</span>
          <span class="obs-tag-index-count">{{ counts.get(tag) ?? 0 }}</span>
        </NuxtLink>
      </li>
    </ul>
  </Sheet>
</template>
