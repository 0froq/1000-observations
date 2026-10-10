/** Controlled tag vocabulary — edit here when froQ settles the list. */
export const OBSERVATION_TAGS = [
  'layout',
  'typography',
  'interaction',
  'copy',
  'navigation',
  'detail',
  'performance',
] as const

export type ObservationTag = typeof OBSERVATION_TAGS[number]

export const OBSERVATION_TAG_LABELS: Record<ObservationTag, { zh: string, en: string }> = {
  layout: { zh: '版式', en: 'Layout' },
  typography: { zh: '字体', en: 'Typography' },
  interaction: { zh: '交互', en: 'Interaction' },
  copy: { zh: '文案', en: 'Copy' },
  navigation: { zh: '导航', en: 'Navigation' },
  detail: { zh: '细节', en: 'Detail' },
  performance: { zh: '性能', en: 'Performance' },
}

export function isObservationTag(value: string): value is ObservationTag {
  return (OBSERVATION_TAGS as readonly string[]).includes(value)
}
