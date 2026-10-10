import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { OBSERVATION_TAGS } from './shared/observation-tags'

const tagSchema = z.enum(OBSERVATION_TAGS)

/**
 * One directory per site (`content/sites/0042/`).
 * `index.md` is the site. Every other markdown file is a note in that folder.
 * `nav` is a sidebar group label, not a page. `order` sorts items inside a group.
 */
export default defineContentConfig({
  collections: {
    documents: defineCollection({
      type: 'page',
      source: 'sites/**/*.md',
      schema: z.object({
        number: z.number().int().min(1).max(1000).optional(),
        date: z.string().optional(),
        tags: z.array(tagSchema).default([]),
        url: z.string().url().optional(),
        label: z.string().optional(),
        nav: z.string().optional(),
        order: z.number().default(0),
      }),
    }),
  },
})
