<template>
  <n-result :title="title" description="我们不能验证你的身份。">
    <template #icon>
      <Lottie :height="250" :data="DizzyFace" />
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { NResult } from "naive-ui";
import Lottie from "@/components/Lottie.vue";
import { computed } from "vue";
import { useUserStore } from "@/stores/user";
import DizzyFace from "@/assets/lottie/Dizzy-face.json";

const userStore = useUserStore();

const user = computed(() => {
  return userStore.user;
});

const title = computed(() => {
  if (user.value.name) {
    return "你不是 " + user.value.name;
  } else {
    return "这不是你的账号";
  }
});
</script>
