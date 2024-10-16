<script setup lang="ts">
import { NLayout } from "naive-ui";
import { useUserStore } from "../stores/user";
// import Guest from "../pages/guest/index.vue";
// import router from "../router";
import Header from "./Header.vue";
import element from "@/config/element";
import { useIsMobile } from "@/utils/composables";
import { useAppStore } from "@/stores/app";
import ChatLayout from "@/components/chat/Layout.vue";
// const currentRoute = computed(() => router.currentRoute.value.name);

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
    style="
      min-height: var(--header-height);
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
    "
  ></Header>

  <!-- <n-layout
    :native-scrollbar="isMobile"
    position="absolute"
    :style="userStore.logined ? 'margin-top: var(--header-height)' : ''"
    ref="mainContainer"
    :on-scroll="onScroll"
  ></n-layout> -->
  <n-layout
    :native-scrollbar="isMobile"
    position="absolute"
    style="margin-top: var(--header-height)"
    ref="mainContainer"
    :on-scroll="onScroll"
    :content-style="
      !isMobile
        ? {
            'padding-left': '32px',
            'padding-right': '32px',
          }
        : {
            'padding-left': '16px',
            'padding-right': '16px',
          }
    "
  >
    <!-- <n-back-top v-if="!isMobile" :right="100" /> -->

    <n-layout :native-scrollbar="isMobile">
      <div class="!pt-2">
        <div v-if="userStore.logined">
          <ChatLayout>
            <router-view :key="route.path"> </router-view>
          </ChatLayout>
        </div>
        <div v-else>
          <router-view :key="route.path"> </router-view>
        </div>
      </div>

      <!-- <Guest v-if="!userStore.logined && currentRoute != '/auth/login'" />
        <Container v-else /> -->
      <!-- <Guest v-if="!userStore.logined && !currentRoute?.startsWith('/auth')" />
      <div v-else :class="userStore.logined ? 'pt-2' : ''">
        <router-view :key="route.path"> </router-view>
      </div> -->
    </n-layout>
  </n-layout>
</template>
