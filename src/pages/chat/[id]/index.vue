<template>
  <div>
    <Chat :chat-id="chatId" />
  </div>
</template>

<script lang="ts" setup>
import { useChatStore } from "@/stores/chat";

const chatStore = useChatStore();
// @ts-ignore
const chatId = useRoute().params.id as number;
chatStore.currentChat = {
  id: chatId
};
</script>
