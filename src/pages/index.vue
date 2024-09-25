<template>
  <Chat v-if="userStore.logined" />
  <Guest v-else />
</template>

<script setup lang="ts">
import Guest from "@/pages/Guest.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>
