<script setup lang="ts">
import type { ObservationTag } from '#shared/observation-tags'
import { OBSERVATION_TAG_LABELS } from '#shared/observation-tags'
import { formatObservationId, parseObservationId, sitePath } from '#shared/observations'
import { documentHref } from '#shared/site-nav'
import { useSiteTree } from '~/composables/useSites'

const route = useRoute()
const { t, locale } = useI18n()
const link = useKitLink()
const number = computed(() => parseObservationId(String(route.params.id)))

if (number.value == null)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const id = computed(() => formatObservationId(number.value!))
const slug = computed(() => {
  const raw = route.params.slug
  if (!raw)
    return ''
  return (Array.isArray(raw) ? raw : [raw]).join('/')
})
const contentPath = computed(() => slug.value ? `/sites/${id.value}/${slug.value}` : `/sites/${id.value}`)

const { site, docs, pages } = await useSiteTree(id)
const doc = computed(() => docs.value.find(item => item.path === contentPath.value) ?? null)

if (!doc.value || !site.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const index = computed(() => pages.value.findIndex(item => item.to === documentHref(doc.value!.path)))
const prev = computed(() => index.value > 0 ? pages.value[index.value - 1] : undefined)
const next = computed(() => pages.value[index.value + 1])

function tagLabel(tag: ObservationTag): string {
  const labels = OBSERVATION_TAG_LABELS[tag]
  return locale.value === 'zh' ? labels.zh : labels.en
}

useHead({ title: () => doc.value ? `${doc.value.title} — ${site.value?.title ?? ''}` : '' })
useSeoMeta({ description: () => doc.value?.description })
</script>

<template>
  <article
    v-if="doc && site"
    class="site-doc"
  >
    <header class="site-doc-head">
      <p class="l-kicker">
        <NuxtLink :to="link('/')">
          {{ t('obs.kicker') }}
        </NuxtLink>
        ·
        <NuxtLink :to="link(sitePath(id))">
          #{{ id }}
        </NuxtLink>
        <template v-if="doc.path !== site.path">
          · {{ site.title }}
        </template>
      </p>
      <h1>{{ doc.title }}</h1>
      <p
        v-if="doc.description"
        class="l-lede"
      >
        {{ doc.description }}
      </p>
      <p
        v-if="doc.url"
        class="site-doc-url"
      >
        <a
          :href="doc.url"
          target="_blank"
          rel="noopener noreferrer"
        >{{ doc.url }}</a>
      </p>
    </header>
    <div class="l-prose l-md">
      <ContentRenderer :value="doc" />
    </div>
    <ul
      v-if="doc.tags?.length && doc.path === site.path"
      class="obs-tag-row"
    >
      <li
        v-for="tag in doc.tags"
        :key="tag"
      >
        <NuxtLink :to="link(`/tags/${tag}`)">
          {{ tagLabel(tag) }}
        </NuxtLink>
      </li>
    </ul>
    <nav
      v-if="prev || next"
      class="site-doc-pager"
    >
      <NuxtLink
        v-if="prev"
        :to="link(prev.to)"
      >
        ← {{ prev.label }}
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="next"
        :to="link(next.to)"
      >
        {{ next.label }} →
      </NuxtLink>
    </nav>
  </article>
</template>
