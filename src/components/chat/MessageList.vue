<template>
  <!-- flex 布局 -->
  <n-flex> </n-flex>

  <n-divider> <small>这是聊天的开头</small> </n-divider>

  <div v-for="(message, index) in chat_messages" :key="index">
    <div v-if="message.role === 'user'">
      <!-- 用户消息 -->
      <n-flex justify="end">
        <div class="align-middle">
          <v-md-preview :text="message.content" height="500px"></v-md-preview>
        </div>
        <n-avatar round size="large" :src="userStore.user.avatar" />
      </n-flex>
    </div>
    <div v-else-if="message.role === 'assistant'">
      <!-- 助理消息 -->
      <n-flex justify="start">
        <n-avatar round size="large" :src="leaflowPng" />

        <div class="align-middle">
          <v-md-preview :text="message.content" height="500px"></v-md-preview>
        </div>
      </n-flex>
    </div>
  </div>

  <!-- 这里要加上输入框占的部分，但是那个占了很多，所以设置大一点 -->
  <div style="margin-bottom: 10rem;"></div>
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import { EntityChatMessage } from "@/api";
import { useUserStore } from "@/stores/user";
import VMdPreview from "@kangc/v-md-editor/lib/preview";
import "@kangc/v-md-editor/lib/style/preview.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import leaflowPng from "@/assets/images/leaflow.png";

// highlightjs
import hljs from "highlight.js";

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const userStore = useUserStore();

const props = defineProps({
  chat_messages: {
    required: true,
    type: Array as () => EntityChatMessage[],
  },
});

const chat_messages = toRef(props, "chat_messages") as Ref<EntityChatMessage[]>;
</script>
