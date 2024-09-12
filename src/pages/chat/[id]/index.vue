<template>
  <div>聊天记录 {{ chatId }}</div>
</template>

<script lang="ts" setup>
// @ts-ignore
const chatId = useRoute().params.id as number;
// chatStore.currentChatId = chatId;
</script>
