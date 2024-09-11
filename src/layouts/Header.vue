<template>
  <n-layout class="select-none">
    <n-layout-header bordered class="layout-header header-height">
      <n-grid cols="2" class="header-height">
        <n-grid-item class="flex items-center justify-start mr-1.5">
          <!-- 左侧 -->
          <n-popover
            placement="bottom"
            trigger="click"
            style="padding: 0; width: 288px"
            v-if="isMobile"
          >
            <template #trigger>
              <n-icon size="20" style="margin-left: 12px">
                <menu-outline />
              </n-icon>
            </template>
            <Menu></Menu>
          </n-popover>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <!-- 右侧 -->
          <n-popover
            :placement="userPlacement"
            class="w-full"
            trigger="click"
            style="padding: 0"
          >
            <template #trigger>
              <n-avatar
                round
                size="medium"
                :src="userStore.user.avatar"
                class="mr-2"
              />
            </template>
            <UserMenu class="select-none" />
          </n-popover>
        </n-grid-item>
      </n-grid>
    </n-layout-header>
  </n-layout>
</template>

<script setup lang="ts">
import UserMenu from "../components/UserMenu.vue";
import { useUserStore } from "../stores/user";
import { useIsMobile, useIsTablet } from "../utils/composables";
import { MenuOutline } from "@vicons/ionicons5";
const userStore = useUserStore();
const isMobile = useIsMobile();
const isTablet = useIsTablet();

const userPlacement = ref("bottom");
if (isMobile.value) {
  userPlacement.value = "bottom";
}

</script>
