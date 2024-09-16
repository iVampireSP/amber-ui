<script setup lang="ts">
import { NLayout } from "naive-ui";
import { useUserStore } from "../stores/user";
import Guest from "../pages/guest/index.vue";
import router from "../router";
import Header from "./Header.vue";
import element from "@/config/element";
import { useIsMobile } from "@/utils/composables";
import { useAppStore } from "@/stores/app";
const currentRoute = computed(() => router.currentRoute.value.name);

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();

const isMobile = useIsMobile();

const mainContainer = ref();

onMounted(() => {
  element.mainContainer = mainContainer.value;
});

const onScroll = (e: Event) => {
  // 获取滚动的目标元素的高度和滚动的高度
  const target = e.target as HTMLElement;
  const scrollTop = target.scrollTop;
  const scrollHeight = target.scrollHeight;
  const clientHeight = target.clientHeight;

  appStore.contentScrollHeight = scrollHeight;
  appStore.contentScrollOnBottom = scrollTop + clientHeight >= scrollHeight;
  // 当前位置
  appStore.contentScrollPosition = scrollTop;

  // 检测是否能滚动（如果内容的高度还没有超过可视区域的高度）
  if (scrollHeight > clientHeight) {
    appStore.contentScrollable = true;
  } else {
    appStore.contentScrollable = false;
  }
};
</script>

<template>
  <Header
    v-if="userStore.logined"
    style="
      min-height: var(--header-height);
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
    "
  ></Header>

  <n-layout
    :native-scrollbar="isMobile"
    position="absolute"
    :style="userStore.logined ? 'margin-top: var(--header-height)' : ''"
    ref="mainContainer"
    :on-scroll="onScroll"
  >
    <!-- <n-layout-sider
      v-if="userStore.logined && !isMobile"
      :collapsed-width="0"
      :native-scrollbar="false"
      :show-collapsed-content="false"
      :width="240"
      bordered
      collapse-mode="width"
      show-trigger="arrow-circle"
      class="select-none"
      @collapse="menuCollapsed.left = true"
      @expand="menuCollapsed.left = false"
    >
      <Menu v-show="!isMobile"></Menu>
    </n-layout-sider> -->
    <n-back-top v-if="!isMobile" :right="100" />

    <n-layout :native-scrollbar="isMobile">
      <!-- <Guest v-if="!userStore.logined && currentRoute != '/auth/login'" />
        <Container v-else /> -->
      <Guest v-if="!userStore.logined && !currentRoute?.startsWith('/auth')" />
      <div v-else :class="userStore.logined ? 'pt-2' : ''">
        <!-- <div style="height: calc(var(--header-height)*2)"></div> -->

        <router-view :key="route.path"> </router-view>

        <!-- <Container  /> -->
        <!-- <div class="p-4 pt-0 pb-0 mb-0 h-screen">
          <router-view v-slot="{ Component }" :key="route.path">
            <transition mode="out-in" name="fade">
                <component :is="Component" />
            </transition>
          </router-view>
        </div> -->
      </div>
    </n-layout>
  </n-layout>
</template>
