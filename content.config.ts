import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { OBSERVATION_TAGS } from './shared/observation-tags'

const tagSchema = z.enum(OBSERVATION_TAGS)

/** One file per observation (`content/observations/0042.md`) — scales cleanly to 1000. */
export default defineContentConfig({
  collections: {
    observations: defineCollection({
      type: 'page',
      source: 'observations/*.md',
      schema: z.object({
        number: z.number().int().min(1).max(1000),
        date: z.string(),
        tags: z.array(tagSchema).default([]),
        siteName: z.string().optional(),
        siteUrl: z.string().url().optional(),
        screenshot: z.string().optional(),
      }),
    }),
  },
})
