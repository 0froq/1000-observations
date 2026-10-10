export interface NavItem {
  label: string
  to: string
  children?: NavItem[]
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export interface SiteDocNav {
  path: string
  title?: string | null
  label?: string | null
  nav?: string | null
  order?: number | null
}

const SITE_ROOT = /^\/sites\/\d{4}$/

function parentPath(path: string): string | null {
  const slash = path.lastIndexOf('/')
  if (slash <= 0)
    return null
  return path.slice(0, slash)
}

function byOrder(a: SiteDocNav, b: SiteDocNav): number {
  return (a.order ?? 0) - (b.order ?? 0) || a.path.localeCompare(b.path)
}

function itemLabel(doc: SiteDocNav): string {
  return doc.label || doc.title || doc.path.split('/').pop() || doc.path
}

/** Public path for a document. `/sites/0001/type/scale` → `/s/0001/type/scale`. */
export function documentHref(contentPath: string): string {
  const match = contentPath.match(/^\/sites\/(\d{4})(?:\/(.*))?$/)
  if (!match)
    return '/'
  return match[2] ? `/s/${match[1]}/${match[2]}` : `/s/${match[1]}`
}

/**
 * Sidebar groups for one site directory.
 * Group labels are not pages. A file is a child only when its parent is another
 * document and that parent is not the site root, so the overview does not swallow the folder.
 */
export function sidebarGroups(docs: SiteDocNav[]): NavGroup[] {
  const byPath = new Map(docs.map(doc => [doc.path, doc]))
  const childPaths = new Set<string>()

  for (const doc of docs) {
    const parent = parentPath(doc.path)
    if (!parent || SITE_ROOT.test(parent) || !byPath.has(parent))
      continue
    childPaths.add(doc.path)
  }

  function toItem(doc: SiteDocNav): NavItem {
    const children = docs
      .filter(item => parentPath(item.path) === doc.path && childPaths.has(item.path))
      .sort(byOrder)
      .map(toItem)
    return {
      label: itemLabel(doc),
      to: documentHref(doc.path),
      children: children.length ? children : undefined,
    }
  }

  const groups = new Map<string, { order: number, items: NavItem[] }>()
  for (const doc of docs.filter(item => !childPaths.has(item.path)).sort(byOrder)) {
    const key = doc.nav ?? ''
    const group = groups.get(key) ?? { order: doc.order ?? 0, items: [] }
    group.order = Math.min(group.order, doc.order ?? 0)
    group.items.push(toItem(doc))
    groups.set(key, group)
  }

  return [...groups.entries()]
    .sort((a, b) => a[1].order - b[1].order || a[0].localeCompare(b[0]))
    .map(([label, group]) => ({
      label: label || undefined,
      items: group.items,
    }))
}

export function flattenNav(groups: NavGroup[]): NavItem[] {
  const pages: NavItem[] = []
  function walk(items: NavItem[]): void {
    for (const item of items) {
      pages.push(item)
      if (item.children?.length)
        walk(item.children)
    }
  }
  for (const group of groups)
    walk(group.items)
  return pages
}

export function navHasChildren(groups: NavGroup[]): boolean {
  return groups.some(group => group.items.some(item => item.children?.length))
}
