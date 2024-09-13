<template>
  <div class="flex items-center align-center justify-center h-screen">
    <div class="text-center">
      <div class="mt-5 !ml-2">
        <n-h1> 满身星光，不负众望 </n-h1>
        <n-p> </n-p>
      </div>
      <br />
      <n-button v-if="!userStore.logined" type="primary" @click="login">
        登录
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import { useUserStore } from "../../stores/user";
const userStore = useUserStore();

const login = () => {
  router.push("/auth/login");
};
</script>