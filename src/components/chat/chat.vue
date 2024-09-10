<template>
  <div class="mt-3 mb-1 text-5xl">
    <n-gradient-text type="info" class="p-3">
      你好，{{ userStore.user.name }}
    </n-gradient-text>
    <br />
    <n-text depth="3"> 有什么我可以帮您的吗？ </n-text>
  </div>
  <div></div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useUserStore } from "../../stores/user";
const message = useMessage();
const userStore = useUserStore();
</script>
