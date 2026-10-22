import process from 'node:process'
import { countCardWords } from '@froq/og-covers-layer/card-words'
import { IMAGE_ORIGIN } from './app/utils/site'
import { keepEmptyTitle } from './shared/empty-title'
import { listPublicShareImages } from './shared/public-files'

export default defineNuxtConfig({
  extends: ['@froq/og-covers-layer'],

  compatibilityDate: '2026-09-19',

  hooks: {
    // An explicit `title: ''` must stay empty: Content otherwise names the page after the file.
    'content:file:afterParse': ({ file, content }) => {
      keepEmptyTitle(content, file.body)
      if (typeof file.body === 'string')
        (content as { words?: number }).words = countCardWords(file.body)
    },
  },

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      publicFiles: listPublicShareImages(),
    },
  },

  build: { transpile: ['@froq/ui'] },

  modules: ['@nuxt/content', '@nuxtjs/i18n'],

  devtools: { enabled: true },

  // `og:image` is absolute on this origin. `og:url` stays on 1000o.froq.me via useShareMeta.
  site: {
    url: IMAGE_ORIGIN,
    name: '1000o',
  },

  css: [
    '@fontsource-variable/geist/index.css',
    '@fontsource-variable/geist-mono/index.css',
    '@fontsource/instrument-serif/400.css',
    '@fontsource/instrument-serif/400-italic.css',
    '~/assets/css/kit.css',
    '@froq/ui/style.css',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      link: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
      meta: [{ name: 'color-scheme', content: 'light dark' }],
      // Picks the theme before first paint so the paper never flashes the wrong stock
      script: [
        {
          tagPosition: 'head',
          innerHTML: `try{var t=localStorage.getItem('kit-theme');document.documentElement.dataset.theme=t||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}`,
        },
      ],
    },
  },

  content: {
    experimental: { sqliteConnector: 'native' },
    build: {
      markdown: {
        highlight: {
          theme: { default: 'vitesse-light', dark: 'vitesse-dark' },
          langs: ['ts', 'js', 'vue', 'bash', 'json', 'yaml', 'md'],
        },
      },
    },
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    baseUrl: IMAGE_ORIGIN,
  },

  nitro: {
    preset: 'static',
    output: {
      publicDir: 'dist',
    },
    prerender: {
      crawlLinks: true,
      routes: ['/', '/zh', '/feed.xml'],
    },
  },

  typescript: { strict: true },
})
