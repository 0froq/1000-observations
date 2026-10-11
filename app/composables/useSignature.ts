import type { LayerColors, PenLayer } from '@froq/ui/core'
import type { Ref } from 'vue'
import type { PaperLayer } from '~/kit/types'
import { createPenStroke } from '@froq/ui/core'
import { createPaper } from '~/kit/paper'
import { settled } from '~/kit/settle'

export interface SignatureOptions {
  /** The page leaves a margin for the pen; it still needs a `[data-anchor="rule"]`. */
  line?: boolean
}

function readColors(): LayerColors {
  const html = document.documentElement
  const css = getComputedStyle(html)
  const get = (name: string): string => css.getPropertyValue(name).trim()
  return { paper: get('--bg'), ink: get('--fg'), accent: get('--accent'), dark: html.dataset.theme === 'dark' }
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
  if (!el)
    return ''
  const clone = el.cloneNode(true) as HTMLElement
  clone.querySelectorAll('.l-fill').forEach(node => node.remove())
  return (clone.textContent ?? '').trim()
}

function clearPenClasses(): void {
  document.documentElement.classList.remove('has-hand', 'has-stroke')
}

/**
 * Lays one sheet of paper under a page and, if it has a margin, draws the pen through it.
 * Layers are rebuilt per page: a new page is a new sheet.
 */
export function useSignature(root: Ref<HTMLElement | undefined>, options: SignatureOptions): void {
  const { product } = useAppConfig()
  const { theme } = useTheme()
  let paper: PaperLayer | null = null
  let pen: PenLayer | null = null
  const timers: ReturnType<typeof setTimeout>[] = []
  let alive = true

  onMounted(async () => {
    const el = root.value
    if (!el)
      return
    await Promise.all([document.fonts.ready, settled(el)])
    if (!alive)
      return
    const sig = product.signature
    const find = (anchor: string): HTMLElement | null => el.querySelector<HTMLElement>(`[data-anchor="${anchor}"]`)
    const mark = find('mark')
    const finalMark = find('final-mark')
    // A page with a line holds its last stop back for the pen; one without lets it bloom when seen
    const line = sig.line && !!options.line && !!find('rule')

    if (sig.paper) {
      const marks = sig.bloom ? [mark, line ? null : finalMark].filter((m): m is HTMLElement => !!m) : []
      paper = createPaper({
        colors: readColors(),
        marks,
        washes: sig.bloom,
        dwellAfter: sig.pointer.dwell === 'wash' ? sig.pointer.dwellAfter : 0,
        click: sig.pointer.click === 'wash',
      })
    }
    const washes = !!paper && sig.bloom
    if (washes)
      timers.push(setTimeout(() => paper?.bloom(), 250))
    if (line) {
      timers.push(setTimeout(() => {
        const html = document.documentElement
        pen = createPenStroke({
          root: el,
          anchors: () => {
            const hand = sig.hand ? find('tagline') : null
            const sections = [...el.querySelectorAll<HTMLElement>('.l-section')].flatMap((section) => {
              const label = section.querySelector<HTMLElement>('[data-anchor="label"]')
              if (!label)
                return []
              return [{ element: section, label, price: section.querySelector<HTMLElement>('[data-anchor="price"]') }]
            })
            const stop = find('final-mark')
            return {
              hand,
              handText: handCopy(hand),
              rule: find('rule'),
              sections,
              finalMark: stop,
              finalSection: stop?.closest('section') ?? null,
              margin: find('label'),
            }
          },
          mixColors: mixHex,
          onReady: (wroteHand) => {
            html.classList.toggle('has-hand', wroteHand)
            html.classList.toggle('has-stroke', !wroteHand)
          },
          colors: readColors(),
          wet: (x, y) => paper?.wet(x, y) ?? 0,
          flowing: () => paper?.flowing() ?? false,
          onArrive: washes && finalMark ? () => paper?.soak(finalMark) : undefined,
          // This page keeps the stroke on its path, and a tagline is the whole stroke.
          tremor: false,
          roundJoins: false,
          fadeRoute: false,
          continuePastHand: false,
          labels: 'line',
        })
        if (!pen)
          clearPenClasses()
      }, 900))
    }
  })

  watch(theme, async () => {
    await nextTick()
    const colors = readColors()
    paper?.setColors(colors)
    pen?.setColors(colors)
  })

  onBeforeUnmount(() => {
    alive = false
    timers.forEach(clearTimeout)
    paper?.destroy()
    pen?.destroy()
    clearPenClasses()
  })
}
