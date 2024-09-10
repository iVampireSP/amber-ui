<template>
  <n-layout class="select-none">
    <n-layout-header bordered class="layout-header header-height">
      <n-grid cols="2" class="header-height">
        <n-grid-item class="flex items-center justify-start mr-1.5">
          <!-- 左侧 -->
          <n-popover placement="bottom" trigger="click" style="padding: 0; width: 288px" v-if="isMobile">
            <template #trigger>
              <n-icon size="20" style="margin-left: 12px">
                <menu-outline />
              </n-icon>
            </template>
            <Menu></Menu>
          </n-popover>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <n-avatar round size="medium" :src="userStore.user.avatar" />
        </n-grid-item>
      </n-grid>
    </n-layout-header>
  </n-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { useIsMobile, useIsTablet } from "../utils/composables";
import {MenuOutline} from "@vicons/ionicons5"
const userStore = useUserStore();
const isMobile = useIsMobile();
const isTablet = useIsTablet();
</script>
