import type { LayerColors } from '@froq/ui/core'
import type { Ref } from 'vue'
import { usePaperSignature } from '@froq/ui/vue'

export interface SignatureOptions {
  /** The page leaves a margin for the pen; it still needs a `[data-anchor="rule"]`. */
  line?: boolean
}

function readColors(): LayerColors {
  const html = document.documentElement
  const css = getComputedStyle(html)
  const get = (name: string): string => css.getPropertyValue(name).trim()
  return {
    paper: get('--bg'),
    ink: get('--fg'),
    accent: get('--accent'),
    dark: html.dataset.theme === 'dark',
  }
}

function mixHex(first: string, weight: number, second: string): string {
  const channel = (hex: string): number[] => {
    const h = hex.replace('#', '')
    return [0, 2, 4].map(index => Number.parseInt(h.slice(index, index + 2), 16))
  }
  const a = channel(first)
  const b = channel(second)
  const mixed = a.map((value, index) => Math.round(value * weight + (b[index] ?? 0) * (1 - weight)))
  return `#${mixed.map(value => value.toString(16).padStart(2, '0')).join('')}`
}

/** Tagline text the pen writes. A placeholder block is not copy. */
function handCopy(el: HTMLElement | null): string {
  if (!el) return ''
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.l-fill').forEach(node => node.remove())
  return (clone.textContent ?? '').trim()
}

function paintSignatureClasses(hand: boolean, stroke: boolean, bloom: boolean): void {
  const html = document.documentElement
  // A handwritten tagline is the whole stroke, so the rule and the last stop stay as type.
  html.classList.toggle('has-hand', hand)
  html.classList.toggle('has-stroke', stroke && !hand)
  html.classList.toggle('has-bloom', bloom)
}

/**
 * Lays one sheet of paper under a page and, if it has a margin, draws the pen through it.
 * Layers are rebuilt per page: a new page is a new sheet.
 */
export function useSignature(root: Ref<HTMLElement | undefined>, options: SignatureOptions): void {
  const { product } = useAppConfig()
  const { theme } = useTheme()

  function find(anchor: string): HTMLElement | null {
    return root.value?.querySelector<HTMLElement>(`[data-anchor="${anchor}"]`) ?? null
  }

  const signature = usePaperSignature(root, {
    settings: () => {
      const sig = product.signature
      return {
        paper: sig.paper,
        bloom: sig.bloom,
        line: sig.line && !!options.line,
        hand: sig.hand,
        dwellAfter: sig.pointer.dwell === 'wash' ? sig.pointer.dwellAfter : 0,
        click: sig.pointer.click === 'wash',
      }
    },
    anchors: () => {
      const hand = find('tagline')
      const sections = [...(root.value?.querySelectorAll<HTMLElement>('.l-section') ?? [])].flatMap(
        section => {
          const label = section.querySelector<HTMLElement>('[data-anchor="label"]')
          if (!label) return []
          return [
            {
              element: section,
              label,
              price: section.querySelector<HTMLElement>('[data-anchor="price"]'),
            },
          ]
        },
      )
      const stop = find('final-mark')
      return {
        mark: find('mark'),
        hand,
        handText: handCopy(hand),
        rule: find('rule'),
        sections,
        finalMark: stop,
        finalSection: stop?.closest('section') ?? null,
        margin: find('label'),
      }
    },
    colors: readColors,
    mixColors: mixHex,
    // The stroke stays on its path, and a tagline is the whole stroke.
    // Connecting routes fade toward the paper; the marks stay full ink.
    tremor: false,
    roundJoins: false,
    continuePastHand: false,
    labels: 'line',
  })

  // The pen measures the tagline inside `onReady`. These classes have to land first.
  watch(
    () => [signature.state.hand, signature.state.stroke, signature.state.bloom] as const,
    ([hand, stroke, bloom]) => paintSignatureClasses(hand, stroke, bloom),
    { flush: 'sync' },
  )

  watch(theme, async () => {
    await nextTick()
    signature.setColors()
  })

  onBeforeUnmount(() => {
    document.documentElement.classList.remove('has-hand', 'has-stroke', 'has-bloom')
  })
}
