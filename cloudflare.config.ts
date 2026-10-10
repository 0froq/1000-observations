import { defineConfig } from 'cf/config'

export default defineConfig({
  worker: {
    name: '1000-observations',
    compatibilityDate: '2026-10-04',
    observability: {
      enabled: true,
      traces: {
        enabled: true,
      },
    },
    assets: {
      // Nuxt routes have no trailing slash. auto-trailing-slash redirects
      // `/s/0001/homepage` to `/s/0001/homepage/`, and that empty segment 404s.
      htmlHandling: 'drop-trailing-slash',
      notFoundHandling: '404-page',
    },
  },
})
