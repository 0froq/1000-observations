<script setup lang="ts">
import { formatObservationId, parseObservationId } from '#shared/observations'
import { useSiteTree } from '~/composables/useSites'

definePageMeta({
  key: route => `/s/${String(route.params.id)}`,
})

const route = useRoute()
const number = computed(() => parseObservationId(String(route.params.id)))

if (number.value == null)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const id = computed(() => formatObservationId(number.value!))
const { site, groups, foldable } = await useSiteTree(id)

if (!site.value)
  throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
</script>

<template>
  <Sheet>
    <div class="site-docs ui">
      <aside class="site-docs-nav">
        <DocSidebar
          :groups="groups"
          :foldable="foldable"
        />
      </aside>
      <div class="site-docs-main">
        <NuxtPage :transition="false" />
      </div>
    </div>
  </Sheet>
</template>
