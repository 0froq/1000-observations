<script setup lang="ts">
import { OBSERVATION_TAG_LABELS, OBSERVATION_TAGS } from '#shared/observation-tags'
import { useSitesLoader } from '~/composables/useSites'

const { t, locale } = useI18n()
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

const entries = computed(() => OBSERVATION_TAGS.map((tag) => {
  const labels = OBSERVATION_TAG_LABELS[tag]
  return {
    tag,
    label: locale.value === 'zh' ? labels.zh : labels.en,
    count: counts.value.get(tag) ?? 0,
  }
}))

useHead({ title: () => t('obs.tagsTitle') })
</script>

<template>
  <Sheet>
    <div class="tag-spread">
      <header class="tag-spread-head">
        <p class="l-kicker">
          {{ t('obs.tagsTitle') }}
        </p>
        <h1
          class="tag-spread-lede"
          :lang="locale === 'zh' ? 'zh' : 'en'"
        >
          {{ t('obs.tagsLede') }}
        </h1>
      </header>
      <ol class="tag-spread-list">
        <li
          v-for="entry in entries"
          :key="entry.tag"
        >
          <NuxtLink
            :to="link(`/tags/${entry.tag}`)"
            :aria-label="`${entry.label} ${t('obs.sitesCount', { n: entry.count })}`"
          >
            <span class="tag-spread-word">{{ entry.label }}</span>
            <span
              class="tag-spread-rule"
              aria-hidden="true"
            />
            <span
              class="tag-spread-count"
              :class="{ 'is-empty': entry.count === 0 }"
            >{{ entry.count }}</span>
          </NuxtLink>
        </li>
      </ol>
    </div>
  </Sheet>
</template>
