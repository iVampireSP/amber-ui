<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useUserStore } from "../stores/user";
const message = useMessage();
const userStore = useUserStore();

const options = [
  {
    label: "滨海湾金沙，新加坡",
    key: "marina bay sands",
    disabled: true,
  },
  {
    label: "布朗酒店，伦敦",
    key: "brown's hotel, london",
  },
  {
    label: "亚特兰蒂斯巴哈马，拿骚",
    key: "atlantis nahamas, nassau",
  },
  {
    label: "比佛利山庄酒店，洛杉矶",
    key: "the beverly hills hotel, los angeles",
  },
];
function handleSelect(key: string | number) {
  message.info(String(key));
}

function logout() {
  userStore.logout();

}

</script>

<template>
  <router-link to="auth/login">go</router-link>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-button>找个地方休息111</n-button>
  </n-dropdown>

  <n-button @click="logout()">退出登录</n-button>
</template>

<style scoped></style>
