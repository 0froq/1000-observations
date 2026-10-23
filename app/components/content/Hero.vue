<script setup lang="ts">
// The wordmark, the handwritten line and the first call to action. The pen starts on its rule.
withDefaults(
  defineProps<{
    tagline?: string | null
    lede?: string | null
    cta?: boolean
  }>(),
  { tagline: null, lede: null, cta: true },
)

const { product } = useAppConfig()

// Long names shrink so the word always fits the width
const length = computed(() => Math.max(3, [...(product.name || 'name')].length))
</script>

<template>
  <section class="l-hero">
    <h1
      class="l-word"
      :style="{ '--len': length }"
      :aria-label="product.name ? `${product.name}${product.mark}` : undefined"
    >
      <span data-anchor="word"
        ><Fill
          :value="product.name"
          name="product.name"
          :size="4" /></span
      ><span
        class="l-mark"
        data-anchor="mark"
        >{{ product.mark }}</span
      >
    </h1>
    <div
      class="l-hero-foot"
      data-anchor="rule"
    >
      <p
        class="l-tagline"
        data-anchor="tagline"
        lang="en"
      >
        <Fill
          :value="tagline"
          name="hero.tagline"
          :size="10"
        />
      </p>
      <p class="l-lede">
        <Fill
          :value="lede"
          name="hero.lede"
          :size="40"
        />
      </p>
      <InstallLink
        v-if="cta"
        class="l-cta"
      />
    </div>
  </section>
</template>
