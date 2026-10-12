import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

/** Custom domain for the `1000-observations` worker. */
export const PRODUCTION_ORIGIN = 'https://1000o.froq.me'

export const OG_IMAGE_URL = `${PRODUCTION_ORIGIN}/og.png`

export function productionUrl(path: string): string {
  const trimmed = path.replace(/\/+$/, '')
  return `${PRODUCTION_ORIGIN}${trimmed || '/'}`
}

export function useShareMeta(options: {
  title?: MaybeRefOrGetter<string | null | undefined>
  description?: MaybeRefOrGetter<string | null | undefined>
  type?: MaybeRefOrGetter<'website' | 'article'>
} = {}): void {
  const { t } = useI18n()
  const route = useRoute()

  const title = computed(() => {
    const value = toValue(options.title)?.trim()
    return value || t('site.title')
  })
  const description = computed(() => {
    const value = toValue(options.description)?.trim()
    return value || t('obs.indexLede')
  })
  const type = computed(() => toValue(options.type) ?? 'website')

  if (options.title !== undefined) {
    useHead({
      title: () => toValue(options.title)?.trim() || undefined,
    })
  }

  useSeoMeta({
    description: () => description.value,
    ogType: () => type.value,
    ogSiteName: '1000o.',
    ogTitle: () => title.value,
    ogDescription: () => description.value,
    ogUrl: () => productionUrl(route.path),
    ogImage: OG_IMAGE_URL,
    ogImageSecureUrl: OG_IMAGE_URL,
    ogImageType: 'image/png',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: '1000o.',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title.value,
    twitterDescription: () => description.value,
    twitterImage: OG_IMAGE_URL,
  })
}
