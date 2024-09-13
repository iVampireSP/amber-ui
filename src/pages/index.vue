<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useUserStore } from "../stores/user";
import chat from "../components/chat/Chat.vue";
const message = useMessage();
const userStore = useUserStore();

</script>

<template>
  <!-- <router-link to="auth/login">go</router-link> -->
  <!-- <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-button>找个地方休息111</n-button>
  </n-dropdown>

  <n-button @click="logout()">退出登录</n-button> -->

  <Chat />
</template>

<style scoped></style>
