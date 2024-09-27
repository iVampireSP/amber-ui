<template>
  <n-scrollbar style="max-height: 400px">
    <n-grid cols="1 s:2 l:3" responsive="screen">
      <n-gi v-for="p in prompts" class="mt-3rounded-lg p-4">
        <n-card :title="p.act" hoverable class="overflow-hidden">
          <n-ellipsis style="max-width: 280px">
            {{ p.prompt }}
          </n-ellipsis>
        </n-card>
      </n-gi>
    </n-grid>
  </n-scrollbar>
</template>

<script setup lang="ts">
import awesomeChatGPTPrompts from "@/plugins/prompts/awesome-chatgpt-prompts-zh.json";

type Prompt = {
  act: string;
  prompt: string;
};

const prompts: Ref<Prompt[]> = ref([]);

prompts.value = awesomeChatGPTPrompts;
</script>
