import type { ProductConfig } from './types'

export default defineAppConfig({
  ogCovers: {
    /** Bottom-right watermark on the paper card (EB Garamond italic). */
    mark: '1000o.',
    colors: {
      title: '#1a1917',
      paper: '#f4f2ec',
      border: 'rgba(26, 25, 23, 0.12)',
      mark: 'rgba(26, 25, 23, 0.11)',
      meta: '#85837c',
      evergreen: 'rgba(22, 163, 74, 0.8)',
    },
  },
  product: {
    name: '1000o',
    mark: '.',
    theme: {
      light: {
        bg: '#f4f2ec',
        fg: '#1a1917',
        muted: '#85837c',
        faint: '#cfccc3',
        line: 'rgba(26, 25, 23, 0.12)',
        accent: '#e8431f',
      },
      dark: {
        bg: '#111113',
        fg: '#f2f0ea',
        muted: '#918f88',
        faint: '#32312d',
        line: 'rgba(242, 240, 234, 0.1)',
        accent: '#ff6242',
      },
    },
    signature: { paper: false, line: true, hand: true, bloom: false, pointer: { dwell: false, click: false, dwellAfter: 1.2 } },
    install: { href: '/about' },
    nav: [
      { label: 'nav.observations', to: '/' },
      { label: 'nav.tags', to: '/tags' },
      { label: 'nav.about', to: '/about' },
    ],
  } satisfies ProductConfig,
})
