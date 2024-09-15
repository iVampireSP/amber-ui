<script setup lang="ts">
import { NLayout } from "naive-ui";
import { useUserStore } from "../stores/user";
import Guest from "../pages/guest/index.vue";
import router from "../router";
import Header from "./Header.vue";
import element from "@/config/element";
import { useIsMobile } from "@/utils/composables";
const currentRoute = computed(() => router.currentRoute.value.name);

const userStore = useUserStore();
const route = useRoute();

const isMobile = useIsMobile();

const mainContainer = ref();

onMounted(() => {
  element.mainContainer = mainContainer.value;
});
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
