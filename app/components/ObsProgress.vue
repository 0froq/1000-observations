<script setup lang="ts">
import { OBSERVATION_GOAL } from '#shared/observations'

const props = defineProps<{
  count: number
}>()

const ratio = computed(() => Math.min(1, props.count / OBSERVATION_GOAL))
const label = computed(() => `${props.count} / ${OBSERVATION_GOAL}`)
</script>

<template>
  <div
    class="obs-progress"
    role="img"
    :aria-label="label"
  >
    <p class="obs-progress-label">
      <span class="obs-progress-count">{{ count }}</span>
      <span class="obs-progress-sep">/</span>
      <span>{{ OBSERVATION_GOAL }}</span>
    </p>
    <svg
      class="obs-progress-pen"
      viewBox="0 0 200 12"
      aria-hidden="true"
    >
      <line
        class="obs-progress-track"
        x1="2"
        y1="6"
        x2="198"
        y2="6"
      />
      <line
        class="obs-progress-fill"
        data-anchor="rule"
        x1="2"
        y1="6"
        x2="198"
        y2="6"
        :style="{ strokeDashoffset: `${200 * (1 - ratio)}` }"
      />
    </svg>
  </div>
</template>
