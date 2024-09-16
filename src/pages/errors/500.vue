<template>
  <n-result description="我们的锅" status="500" title="服务器错误">
    <template #icon>
      <Lottie :height="250" :data="ScrunchedMouth" />
    </template>
    <template #footer> </template>
  </n-result>
</template>

<script setup lang="ts">
import { NResult } from "naive-ui";
import Lottie from "@/components/Lottie.vue";
import ScrunchedMouth from "@/assets/lottie/Scrunched-mouth.json";
</script>
