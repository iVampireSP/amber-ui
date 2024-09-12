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
    <n-list-item v-for="c in chatStore.chats" :key="c.id">
      <n-thing> {{ c.name }} </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { NMenu } from "naive-ui";
import { useRoute } from "vue-router";
import { leftMenuOptions } from "../plugins/menus/left";
import { ChatboxOutline } from "@vicons/ionicons5";
import getApi from "../plugins/api";
import { useChatStore } from "../stores/chat";

const route = useRoute();

const currentRoute: any = computed(() => route.name);

const collapsed = ref(false);

const chatStore = useChatStore();

async function getChats() {
  chatStore.chats = (await getApi().Chat.apiV1ChatsGet()).data.data;
}

getChats();
</script>
