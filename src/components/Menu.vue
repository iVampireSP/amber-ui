<template>
  <!-- <n-menu
    :value="currentRoute"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="leftMenuOptions"
  /> -->
  <n-list hoverable clickable>
    <template #header>
      <div class="text-xl">
        <n-icon :component="ChatboxOutline" class="align-middle" />
        <span class="font-xl ml-2">对话列表</span>
      </div>
    </template>
    <n-list-item v-for="i in 10" :key="i">
      <n-thing> 对话 </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { NMenu } from "naive-ui";
import { useRoute } from "vue-router";
import { leftMenuOptions } from "../plugins/menus/left";
import { ChatboxOutline } from "@vicons/ionicons5";

const route = useRoute();

const currentRoute: any = computed(() => route.name);

const collapsed = ref(false);
</script>
