<script setup lang="ts">
import { formatObservationId, observationPath } from '#shared/observations'
import { groupObservedSites, useObservationsLoader } from '~/composables/useObservations'

const { t } = useI18n()
const copy = useCopy()
const link = useKitLink()
const { observations } = useObservationsLoader()

const sites = computed(() => groupObservedSites((observations.value ?? []) as import('~/composables/useObservations').ObservationListItem[]))

useHead({ title: () => t('obs.sitesTitle') })
</script>

<template>
  <Sheet line>
    <PageHead
      :kicker="copy('obs.kicker')"
      kicker-name="obs.kicker"
      :title="copy('obs.sitesTitle')"
      title-name="obs.sitesTitle"
      :lede="copy('obs.sitesLede')"
      lede-name="obs.sitesLede"
      compact
    >
      <template #meta>
        {{ t('obs.sitesCount', { n: sites.length }) }}
      </template>
    </PageHead>
    <ul class="obs-sites l-body">
      <li
        v-for="site in sites"
        :key="site.url"
      >
        <div class="obs-site-row">
          <a
            :href="site.url"
            target="_blank"
            rel="noopener noreferrer"
            class="obs-site-name"
          >{{ site.name }}</a>
          <span class="obs-site-count">{{ t('obs.entryCount', { n: site.count }) }}</span>
        </div>
        <p class="obs-site-refs">
          <NuxtLink
            v-for="num in site.numbers"
            :key="num"
            :to="link(observationPath(num))"
          >
            #{{ formatObservationId(num) }}
          </NuxtLink>
        </p>
      </li>
    </ul>
  </Sheet>
</template>
