<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const copy = useCopy()
const link = useKitLink()
const { t } = useI18n()
const { product } = useAppConfig()

useHead({
  style: [{ key: 'theme', innerHTML: () => themeStyle(product.theme) }],
})

const files = useRuntimeConfig().public.publicFiles
const override = computed(() => explicitContentCover({
  collection: 'pages',
  path: '/en/__not-found__',
}, path => hasShareFile(files, path)))
if (!override.value) {
  defineOgImage('Paper', {
    title: () => copy('notFound.title'),
    description: () => copy('notFound.lede') || t('obs.indexLede'),
    words: 0,
  }, {
    alt: () => copy('notFound.title'),
  })
}
useShareMeta({
  title: () => copy('notFound.title'),
  description: () => copy('notFound.lede'),
  image: () => override.value ?? false,
})
</script>

<template>
  <NuxtLayout>
    <Sheet>
      <PageHead
        :kicker="String(props.error.statusCode ?? 404)"
        :title="copy('notFound.title')"
        title-name="notFound.title"
        :lede="copy('notFound.lede')"
        lede-name="notFound.lede"
        long
      >
        <template #meta>
          <NuxtLink
            class="l-cta"
            :to="link('/')"
            @click.prevent="clearError({ redirect: link('/') })"
          >
            {{ copy('notFound.back') }}
          </NuxtLink>
        </template>
      </PageHead>
    </Sheet>
  </NuxtLayout>
</template>
