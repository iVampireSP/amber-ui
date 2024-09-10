<script setup lang="ts">
// import router from '../plugins/router';
import Header from "../layouts/Header.vue";
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
// const currentRoute = computed(() => router.currentRoute.value.name)
</script>

<template>
  <Header v-show="userStore.logined" style="min-height: var(--header-height)"></Header>

  <router-view v-slot="{ Component }">
    <transition mode="out-in" name="fade">
      <div>
        <component :is="Component" />
      </div>
    </transition>
  </router-view>

  <!-- <router-view></router-view> -->
</template>

<style scoped></style>
