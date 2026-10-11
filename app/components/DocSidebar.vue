<script setup lang="ts">
import type { SidebarGroup, SidebarItem, SidebarLinkProps } from '@froq/ui'
import type { NavGroup, NavItem } from '#shared/site-nav'
import { Sidebar } from '@froq/ui'

const props = defineProps<{
  groups: NavGroup[]
  foldable?: boolean
}>()

const route = useRoute()
const link = useKitLink()
const { t } = useI18n()

function items(entries: NavItem[]): SidebarItem[] {
  return entries.map(item => ({
    value: item.to,
    label: item.label,
    href: link(item.to),
    children: item.children ? items(item.children) : undefined,
  }))
}

const groups = computed<SidebarGroup[]>(() => props.groups.map(group => ({
  label: group.label,
  items: items(group.items),
})))

function findCurrent(entries: NavItem[]): NavItem | undefined {
  for (const item of entries) {
    const child = item.children && findCurrent(item.children)
    if (child)
      return child
    if (route.path.replace(/\/$/, '') === link(item.to).replace(/\/$/, ''))
      return item
  }
}

const currentItem = computed(() => {
  for (const group of props.groups) {
    const item = findCurrent(group.items)
    if (item)
      return item
  }
  return undefined
})

const active = computed(() => currentItem.value?.to ?? '')
const currentLabel = computed(() => currentItem.value?.label || t('obs.contents'))
const open = ref(false)
const frame = ref<HTMLElement>()

function close(): void {
  open.value = false
}

function onKey(event: KeyboardEvent): void {
  if (event.key === 'Escape')
    close()
}

function onPointer(event: PointerEvent): void {
  const target = event.target
  if (target instanceof Node && frame.value?.contains(target))
    return
  close()
}

function setDismiss(active: boolean): void {
  if (!import.meta.client)
    return
  if (active) {
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
  }
  else {
    document.removeEventListener('keydown', onKey)
    document.removeEventListener('pointerdown', onPointer)
  }
}

watch(() => route.path, close)
watch(open, setDismiss)
onBeforeUnmount(() => setDismiss(false))

function routerLinkProps({ href: _href, onClick: _onClick, ...attrs }: SidebarLinkProps) {
  return attrs
}
</script>

<template>
  <div
    ref="frame"
    class="site-sidebar-frame"
    :class="{ 'is-open': open }"
  >
    <button
      type="button"
      class="site-sidebar-toggle"
      :aria-expanded="open"
      aria-controls="site-sidebar-panel"
      @click="open = !open"
    >
      <span class="site-sidebar-toggle-kicker">{{ t('obs.contents') }}</span>
      <span class="site-sidebar-toggle-name">{{ currentLabel }}</span>
      <span
        class="site-sidebar-toggle-mark"
        aria-hidden="true"
      />
    </button>
    <div
      id="site-sidebar-panel"
      class="site-sidebar-panel"
    >
      <Sidebar
        class="site-sidebar"
        :groups="groups"
        :model-value="active"
        :foldable="foldable"
      >
        <template #link="{ item, props: linkProps }">
          <NuxtLink
            v-bind="routerLinkProps(linkProps)"
            :to="item.href!"
            @click="close"
          >
            {{ item.label }}
          </NuxtLink>
        </template>
      </Sidebar>
    </div>
  </div>
</template>

<style scoped>
.site-sidebar-toggle {
  display: none;
}

@media (max-width: 860px) {
  .site-sidebar-frame {
    position: relative;
  }

  .site-sidebar-toggle {
    position: relative;
    z-index: 2;
    display: inline-flex;
    gap: 10px;
    align-items: center;
    max-width: 100%;
    padding: 0 2px 6px 0;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: transparent;
    color: var(--fg);
    font: inherit;
    cursor: pointer;
  }

  .site-sidebar-toggle-kicker {
    font-family: var(--font-meta);
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .site-sidebar-toggle-name {
    overflow: hidden;
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .site-sidebar-toggle-mark {
    display: inline-block;
    flex: none;
    width: 5px;
    height: 5px;
    margin-inline-start: 2px;
    border-inline-end: 1px solid currentColor;
    border-block-end: 1px solid currentColor;
    transform: translateY(-1px) rotate(-45deg);
  }

  .site-sidebar-toggle[aria-expanded='true'] .site-sidebar-toggle-mark {
    transform: translateY(1px) rotate(45deg);
  }

  .site-sidebar-toggle:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 3px;
  }

  .site-sidebar-panel {
    display: none;
  }

  .site-sidebar-frame.is-open .site-sidebar-panel {
    position: absolute;
    z-index: 2;
    top: calc(100% + 10px);
    left: 0;
    display: block;
    width: min(18.5rem, calc(100vw - var(--pad) * 2));
    max-height: min(70dvh, 28rem);
    padding: 22px 16px 14px;
    overflow: auto;
    overscroll-behavior: contain;
    background: var(--bg);
    border: 1px solid var(--line);
  }
}
</style>
