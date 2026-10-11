<script setup lang="ts">
import type { ObservationTag } from '#shared/observation-tags'
import type { SiteSort } from '~/composables/useSites'
import { ToggleGroup } from '@froq/ui'
import { OBSERVATION_TAG_LABELS, OBSERVATION_TAGS } from '#shared/observation-tags'

const { locale, t } = useI18n()
const { q, tags, sort, setSearch, setTags, clearTags, setSort } = useObservationFilters()

const searchDraft = ref(q.value)
watch(q, (v) => {
  searchDraft.value = v
})

let searchTimer: ReturnType<typeof setTimeout> | undefined
function onSearchInput() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(setSearch, 220, searchDraft.value)
}

function tagLabel(tag: typeof OBSERVATION_TAGS[number]): string {
  const labels = OBSERVATION_TAG_LABELS[tag]
  return locale.value === 'zh' ? labels.zh : labels.en
}

const tagOptions = computed(() => OBSERVATION_TAGS.map(tag => ({
  value: tag,
  label: tagLabel(tag),
})))

const selected = computed<ObservationTag[]>({
  get: () => tags.value,
  set: next => setTags(next),
})

function onSortChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as SiteSort
  setSort(value)
}
</script>

<template>
  <div class="obs-toolbar l-body">
    <label class="obs-search">
      <span class="u-sr-only">{{ t('obs.search') }}</span>
      <input
        v-model="searchDraft"
        type="search"
        name="q"
        autocomplete="off"
        :placeholder="t('obs.searchPlaceholder')"
        @input="onSearchInput"
      >
    </label>
    <div class="obs-sort">
      <label for="obs-sort">{{ t('obs.sort') }}</label>
      <select
        id="obs-sort"
        :value="sort"
        @change="onSortChange"
      >
        <option value="number">
          {{ t('obs.sortNumber') }}
        </option>
        <option value="newest">
          {{ t('obs.sortNewest') }}
        </option>
      </select>
    </div>
    <div class="obs-tags">
      <ToggleGroup
        v-model="selected"
        class="ui"
        type="multiple"
        :label="t('obs.filterTags')"
        :options="tagOptions"
      />
      <button
        v-if="tags.length"
        type="button"
        class="obs-clear"
        @click="clearTags"
      >
        {{ t('obs.clearTags') }}
      </button>
    </div>
  </div>
</template>
