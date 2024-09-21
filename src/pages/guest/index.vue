<template>
  <div class="flex items-center align-center justify-center h-screen">
    <div class="text-center">
      <div class="mt-5 !ml-2">
        <n-image :src="leaflowpng" width="200" />
        <n-h1> 满身星光，不负众望 </n-h1>
      </div>
      <br />
      <n-button v-if="!userStore.logined" type="primary" @click="login">
        登录
      </n-button>

      <n-modal v-model:show="showModal" :mask-closable="false" preset="dialog" transform-origin="center">
        <template #header>
          <div>公告</div>
        </template>
        <div class="text-center">
          <n-h6>
            Leaflow Amber 目前仍然处于测试阶段，
            <br />
            不代表最终品质。
          </n-h6>
          <n-image :src="grouppng" width="300" />
        </div>
        <template #action>
          <n-button type="primary" @click="showModal = false">确定</n-button>
        </template>
      </n-modal>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "../../router";
import { useUserStore } from "../../stores/user";
import leaflowpng from "@/assets/images/leaflow.png"
import grouppng from "@/assets/images/group.png"

const userStore = useUserStore();

const login = () => {
  router.push("/auth/login");
};

const showModal = ref(true);
</script>
