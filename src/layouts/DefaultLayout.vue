<script setup lang="ts">
import Container from "../components/Container.vue";
import { NLayout, NLayoutContent, NLayoutSider } from "naive-ui";
import { useIsMobile } from "../utils/composables.js";
import Menu from "../components/Menu.vue";
import { useUserStore } from "../stores/user";
import Guest from "../pages/guest/index.vue";
import router from "../router";
import Header from "./Header.vue";
const currentRoute = computed(() => router.currentRoute.value.name);

const userStore = useUserStore();
const route = useRoute();
// import Header from './Header.vue'
const isMobile = useIsMobile();
// const isTablet = useIsTablet()
const menuCollapsed = ref({
  left: false,
});
</script>

<template>
  <Header
    v-show="userStore.logined"
    style="
      min-height: var(--header-height);
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
    "
  ></Header>

  <n-layout
    :native-scrollbar="false"
    position="absolute"
    style="margin-top: var(--header-height)"
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

    <n-layout :native-scrollbar="false">
      <!-- <Guest v-if="!userStore.logined && currentRoute != '/auth/login'" />
        <Container v-else /> -->
      <Guest v-if="!userStore.logined && !currentRoute?.startsWith('/auth')" />
      <div v-else>
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
