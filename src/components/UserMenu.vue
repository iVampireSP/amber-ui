<template>
  <n-menu
    :value="currentRoute"
    :collapsed="collapsed"
    :collapsed-width="64"
    :collapsed-icon-size="22"
    :options="userMenuOptions"
  />
</template>

<script setup lang="ts">
import { NMenu } from "naive-ui";
import { useRoute } from "vue-router";
import { userMenuOptions } from "../plugins/menus/user";

const route = useRoute();
const currentRoute: any = computed(() => route.name);
const collapsed = ref(false);
</script>
