<template>
  <n-menu
    :value="currentRoute"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="menuOptions"
  />
</template>

<script setup lang="ts">
import { NIcon, NMenu } from 'naive-ui'
import { Home as HomeIcon } from '@vicons/ionicons5'
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute: any = computed(() => route.name)

const collapsed = ref(false)
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/'
          }
        },
        { default: () => 'Amber' }
      ),
    key: '/',
    icon: renderIcon(HomeIcon)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: '/auth/login'
          }
        },
        { default: () => 'Login' }
      ),
    key: '/auth/login',
    icon: renderIcon(HomeIcon)
  }
]

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}
</script>
