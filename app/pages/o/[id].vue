<script setup lang="ts">
import type { ObservationListItem } from '~/composables/useObservations'
import { OBSERVATION_TAG_LABELS } from '#shared/observation-tags'
import { formatObservationId, observationPath, parseObservationId } from '#shared/observations'
import { relatedByTags, useObservationsLoader } from '~/composables/useObservations'

const route = useRoute()
const { t, locale } = useI18n()
const link = useKitLink()
const idParam = computed(() => String(route.params.id))
const number = computed(() => parseObservationId(idParam.value))

if (number.value == null)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const { observations } = useObservationsLoader()

const { data: entry } = await useAsyncData(
  () => `obs-${idParam.value}`,
  () => queryCollection('observations').where('number', '=', number.value!).first(),
)

if (!entry.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const list = computed(() => (observations.value ?? []) as ObservationListItem[])
const prev = computed(() => list.value.find(o => o.number === number.value! - 1))
const next = computed(() => list.value.find(o => o.number === number.value! + 1))
const related = computed(() => relatedByTags(list.value, entry.value as ObservationListItem))

function tagLabel(tag: ObservationListItem['tags'][number]): string {
  const labels = OBSERVATION_TAG_LABELS[tag]
  return locale.value === 'zh' ? labels.zh : labels.en
}

useHead({ title: () => entry.value?.title })
useSeoMeta({ description: () => entry.value?.description })
</script>

<template>
  <Sheet
    v-if="entry"
    line
  >
    <PageHead
      :title="entry.title"
      title-name="obs.title"
      long
    >
      <template #kicker>
        <NuxtLink :to="link('/')">
          {{ t('obs.kicker') }}
        </NuxtLink>
        · #{{ formatObservationId(entry.number) }}
      </template>
      <template #meta>
        {{ entry.date }}
      </template>
    </PageHead>
    <section class="l-section is-prose">
      <div class="l-body l-prose">
        <p
          v-if="entry.siteName && entry.siteUrl"
          class="obs-observed-site"
        >
          <span class="l-kicker">{{ t('obs.observedSite') }}</span>
          <a
            :href="entry.siteUrl"
            target="_blank"
            rel="noopener noreferrer"
          >{{ entry.siteName }}</a>
        </p>
        <ContentRenderer
          :value="entry"
          class="l-md"
        />
      </div>
    </section>
    <section
      v-if="entry.tags?.length"
      class="l-section"
    >
      <p class="l-label">
        {{ t('obs.tags') }}
      </p>
      <ul class="obs-tag-row l-body">
        <li
          v-for="tag in entry.tags"
          :key="tag"
        >
          <NuxtLink :to="link(`/tags/${tag}`)">
            {{ tagLabel(tag) }}
          </NuxtLink>
        </li>
      </ul>
    </section>
    <section
      v-if="related.length"
      class="l-section is-entry"
    >
      <p class="l-label">
        {{ t('obs.related') }}
      </p>
      <ul class="obs-related l-body">
        <li
          v-for="item in related"
          :key="item.path"
        >
          <NuxtLink :to="link(observationPath(item.number))">
            #{{ formatObservationId(item.number) }} · {{ item.title }}
          </NuxtLink>
        </li>
      </ul>
    </section>
    <nav class="l-section is-pager">
      <p class="l-label">
        <NuxtLink :to="link('/')">
          ← {{ t('obs.back') }}
        </NuxtLink>
      </p>
      <div class="l-body obs-pager-links">
        <NuxtLink
          v-if="prev"
          class="l-entry"
          :to="link(observationPath(prev.number))"
        >
          <span class="l-kicker">{{ t('obs.prev') }}</span>
          <span class="l-entry-title">#{{ formatObservationId(prev.number) }}</span>
        </NuxtLink>
        <NuxtLink
          v-if="next"
          class="l-entry"
          :to="link(observationPath(next.number))"
        >
          <span class="l-kicker">{{ t('obs.next') }}</span>
          <span class="l-entry-title">#{{ formatObservationId(next.number) }}</span>
        </NuxtLink>
      </div>
    </nav>
  </Sheet>
</template>
