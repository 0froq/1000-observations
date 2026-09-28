import type { ProductConfig } from './types'

export default defineAppConfig({
  product: {
    name: '1000',
    mark: 'o',
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
    signature: { paper: true, line: true, hand: true, bloom: true, pointer: { dwell: 'wash', click: 'wash', dwellAfter: 1.2 } },
    install: { href: '/about' },
    nav: [
      { label: 'nav.observations', to: '/' },
      { label: 'nav.tags', to: '/tags' },
      { label: 'nav.sites', to: '/sites' },
      { label: 'nav.about', to: '/about' },
    ],
  } satisfies ProductConfig,
})
