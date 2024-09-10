<script setup lang="ts">
import Container from "../components/Container.vue";
import { NLayout, NLayoutContent, NLayoutSider } from "naive-ui";
import { useIsMobile } from "../utils/composables.js";
import Menu from "../components/Menu.vue";
import { useUserStore } from "../stores/user";
import Guest from "../pages/guest/index.vue";
import router from "../plugins/router";
const currentRoute = computed(() => router.currentRoute.value.name);

const userStore = useUserStore();

// import Header from './Header.vue'
const isMobile = useIsMobile();
// const isTablet = useIsTablet()
const menuCollapsed = ref({
  left: false,
});
</script>

<template>
  <n-layout :position="isMobile ? 'static' : 'absolute'" :has-sider="true">
    <n-layout-sider
      v-if="userStore.logined"
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
      <Menu></Menu>
    </n-layout-sider>
    <n-layout-content>
      <!-- <Guest v-if="!userStore.logined && currentRoute != '/auth/login'" />
        <Container v-else /> -->
      <Guest v-if="!userStore.logined && !currentRoute?.startsWith('/auth')" />
      <Container v-else />
    </n-layout-content>
  </n-layout>
</template>
