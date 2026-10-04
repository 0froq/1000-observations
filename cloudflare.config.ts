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
      htmlHandling: 'auto-trailing-slash',
      notFoundHandling: '404-page',
    },
  },
})
