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

function current(entries: NavItem[]): string | undefined {
  for (const item of entries) {
    const child = item.children && current(item.children)
    if (child)
      return child
    if (route.path.replace(/\/$/, '') === link(item.to).replace(/\/$/, ''))
      return item.to
  }
}

const active = computed(() => {
  for (const group of props.groups) {
    const value = current(group.items)
    if (value)
      return value
  }
  return ''
})

function routerLinkProps({ href: _href, onClick: _onClick, ...attrs }: SidebarLinkProps) {
  return attrs
}
</script>

<template>
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
      >
        {{ item.label }}
      </NuxtLink>
    </template>
  </Sidebar>
</template>

<style scoped>
@media (max-width: 860px) {
  .site-sidebar {
    max-height: 40dvh;
    padding: 0 12px 12px 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    scrollbar-width: thin;
    border-bottom: 1px solid var(--ui-line);
  }
}
</style>
