<template>
  <n-layout class="select-none">
    <n-layout-header bordered class="layout-header header-height">
      <n-grid cols="2" class="header-height">
        <n-grid-item class="flex items-center justify-start mr-1.5">
          <!-- 左侧 -->
           <p>你好, {{ userStore.user.name }}。</p>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <n-avatar round size="medium" :src="userStore.user.avatar" />
        </n-grid-item>
      </n-grid>
    </n-layout-header>
  </n-layout>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";

const userStore = useUserStore();
</script>

