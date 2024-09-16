<template>
  <n-result
    description="我们知道你很急，但是我们确实找不到。"
    status="404"
    title="资源不存在"
  >
    <template #icon>
      <Lottie :height="250" :data="ThinkingFace" />
    </template>

    <template v-if="show_footer" #footer>
      <n-button @click="goTo('/')">回到首页</n-button>
    </template>
  </n-result>
</template>

<script setup lang="ts">
import { NButton, NResult } from "naive-ui";

import router from "@/router";
import Lottie from "@/components/Lottie.vue";
import ThinkingFace from "@/assets/lottie/Thinking-face.json";

// import { defineProps } from 'vue'

defineProps({
  show_footer: {
    type: Boolean,
    default: true,
  },
});

function goTo(path: any) {
  router.push({ name: path });
}
</script>
