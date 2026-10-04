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
    <div class="obs-tags-page">
      <Block
        v-for="tag in OBSERVATION_TAGS"
        :key="tag"
        :label="tag"
        entry
      >
        <NuxtLink
          class="l-entry"
          :to="link(`/tags/${tag}`)"
        >
          <h2 class="l-entry-title">
            {{ tagLabel(tag) }}
          </h2>
          <p class="obs-entry-meta">
            {{ t('obs.sitesCount', { n: counts.get(tag) ?? 0 }) }}
          </p>
        </NuxtLink>
      </Block>
    </div>
  </Sheet>
</template>
