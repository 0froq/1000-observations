import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { defineOgImageSchema } from 'nuxt-og-image/content'
import { OBSERVATION_TAGS } from './shared/observation-tags'

const tagSchema = z.enum(OBSERVATION_TAGS)

// Optional frontmatter `cover`: a `public/` path or an absolute https URL. It wins over `ogImage.url`.
// `ogImage: false` turns the card off. `words` is filled at parse time for the card; it is not frontmatter.
const card = {
  cover: z.string().optional(),
  ogImage: defineOgImageSchema({ z }),
  words: z.number().optional(),
  evergreen: z.boolean().optional(),
  kind: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
  last_modified: z.string().optional(),
}

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
        ...card,
      }),
    }),
  },
})
