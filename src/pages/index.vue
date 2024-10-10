<template>
  <Chat v-if="userStore.logined" />
  <Home v-else />
</template>

<script setup lang="ts">
import Home from "@/pages/home/index.vue";
import { useUserStore } from "@/stores/user";
import Chat from "@/pages/chat/Chat.vue";

const userStore = useUserStore();
</script>
