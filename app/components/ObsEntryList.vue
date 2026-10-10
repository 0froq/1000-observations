<script setup lang="ts">
import type { SiteListItem } from '~/composables/useSites'
import { OBSERVATION_TAG_LABELS } from '#shared/observation-tags'
import { formatObservationId, OBSERVATION_PAGE_SIZE, sitePath } from '#shared/observations'

const props = defineProps<{
  items: SiteListItem[]
}>()

const { t, locale } = useI18n()
const link = useKitLink()

const visible = ref(OBSERVATION_PAGE_SIZE)
const slice = computed(() => props.items.slice(0, visible.value))
const hasMore = computed(() => visible.value < props.items.length)

watch(() => props.items, () => {
  visible.value = OBSERVATION_PAGE_SIZE
})

function loadMore() {
  visible.value = Math.min(props.items.length, visible.value + OBSERVATION_PAGE_SIZE)
}

function tagLabel(tag: SiteListItem['tags'][number]): string {
  const labels = OBSERVATION_TAG_LABELS[tag]
  return locale.value === 'zh' ? labels.zh : labels.en
}
</script>

<template>
  <div class="obs-list">
    <p
      v-if="!items.length"
      class="obs-empty l-copy"
    >
      {{ t('obs.empty') }}
    </p>
    <Block
      v-for="item in slice"
      :key="item.path"
      :label="`#${formatObservationId(item.number)}`"
      label-name="obs.number"
      entry
    >
      <NuxtLink
        class="l-entry"
        :to="link(sitePath(item.number))"
      >
        <h2 class="l-entry-title">
          {{ item.title }}
        </h2>
        <p
          v-if="item.description"
          class="l-copy"
        >
          {{ item.description }}
        </p>
        <p class="obs-entry-meta">
          <span>{{ item.date }}</span>
          <span>{{ t('obs.docCount', { n: item.docs }) }}</span>
        </p>
        <ul
          v-if="item.tags.length"
          class="obs-tag-row"
        >
          <li
            v-for="tag in item.tags"
            :key="tag"
          >
            {{ tagLabel(tag) }}
          </li>
        </ul>
        <span class="l-more">{{ t('obs.read') }}</span>
      </NuxtLink>
    </Block>
    <div
      v-if="hasMore"
      class="obs-more"
    >
      <button
        type="button"
        class="obs-load-more"
        @click="loadMore"
      >
        {{ t('obs.loadMore', { n: items.length - visible }) }}
      </button>
    </div>
  </div>
</template>
