<template>
  <n-layout class="select-none">
    <n-layout-header bordered class="layout-header header-height">
      <n-grid cols="2" class="header-height">
        <n-grid-item class="flex items-center justify-start mr-1.5">
          <!-- 左侧 -->
          <!-- <n-popover
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
          </n-popover> -->

          <n-drawer
            v-model:show="showDrawer"
            resizable
            :default-width="width"
            placement="left"
          >
            <n-drawer-content>
              <LeftSettings></LeftSettings>
            </n-drawer-content>
          </n-drawer>
          <n-icon
            size="20"
            style="margin-left: 12px"
            @click="showDrawer = true"
          >
            <menu-outline />
          </n-icon>

          <!-- 更新状态 -->
          <div v-show="appStore.updating">正在更新数据</div>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <!-- 右侧 -->
          <!-- 助理选择 -->
          <n-popover
            :placement="userPlacement"
            class="w-full"
            trigger="click"
            style="padding: 0"
          >
            <template #trigger>
              <n-icon class="text-2xl mr-4">
                <PersonOutline />
              </n-icon>
            </template>
            <AssistantMenu class="select-none" />
          </n-popover>
          <!-- 用户弹出 -->
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
import AssistantMenu from "../components/AssistantMenu.vue";
import { useAppStore } from "../stores/app";
import { useUserStore } from "../stores/user";
import { useIsMobile, useIsTablet } from "../utils/composables";
import { MenuOutline, PersonOutline } from "@vicons/ionicons5";
const userStore = useUserStore();
const isMobile = useIsMobile();
const isTablet = useIsTablet();
const appStore = useAppStore();
const showDrawer = ref(false);
const width = ref(200);

// 如果是手机，则 width 为全屏
if (isMobile.value) {
  // 获取屏幕宽度
  width.value = window.innerWidth - 100;
} else {
  // 获取当前屏幕宽度 40% 的宽度
  width.value = window.innerWidth * 0.4
}

const userPlacement = ref("bottom");
if (isMobile.value) {
  userPlacement.value = "bottom";
}
</script>
