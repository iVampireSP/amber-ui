<template>
  <div class="text-base">
    <n-divider> <small class="select-none">这是聊天的开头</small> </n-divider>

    <div v-for="(message, index) in chat_messages" :key="index">
      <div class="mt-10 mb-10"></div>
      <div v-if="message.role === 'file'">
        <!-- 文件类型 -->
        <n-flex justify="end">
          <div class="flex items-center flex-nowrap">
            <!-- 如果是 user file -->
            <n-image
              v-if="message.user_file"
              width="100"
              :src="fileBaseUrl + '/' + message.user_file.id + '/download'"
            />
            <n-image
              v-if="message.file"
              width="100"
              :src="fileBaseUrl + '/' + message.file.id + '/download'"
            />
          </div>
        </n-flex>
      </div>
      <div v-else-if="message.role === 'user' && message.content">
        <!-- 用户消息 -->
        <n-flex justify="end">
          <div class="flex items-center flex-nowrap">
            <!-- <vue-markdown-it
            :source="message.content"
            :options="markdownOptions"
            :plugins="markdownPlugins"
          /> -->
            <!-- <v-md-preview :text="message.content" height="500px"></v-md-preview> -->
            <div v-html="mdIt.render(message.content)"></div>
            <n-avatar round size="large" :src="userStore.user.avatar" />
          </div>
        </n-flex>
      </div>
      <div v-else-if="message.role === 'assistant' && message.content">
        <!-- 助理消息 -->
        <n-flex justify="start" class="!flex-nowrap">
          <n-avatar round size="large" :src="leaflowPng" class="min-w-10 min-h-10"/>

          <div class="flex items-center flex-nowrap">
            <!-- <vue-markdown-it
            :source="message.content"
            :options="markdownOptions"
            :plugins="[markdownPlugins]"
          /> -->

            <!-- <div v-html="mdIt.render('# Math Rulez! \n  $\\sqrt{3x-1}+(1+x)^2$')"></div> -->

            <div v-html="mdIt.render(message.content)"></div>

            <!-- <v-md-preview :text="message.content" height="500px"></v-md-preview> -->
          </div>
        </n-flex>
      </div>
    </div>
  </div>
  <!-- 这里要加上输入框占的部分，但是那个占了很多，所以设置大一点 -->
  <div style="margin-bottom: 10rem"></div>
</template>

<script lang="ts" setup>
import { Ref } from "vue";
import { EntityChatMessage } from "@/api";
import { useUserStore } from "@/stores/user";
import leaflowPng from "@/assets/images/leaflow.png";
import markdownKatex from "@traptitech/markdown-it-katex";
import markdownIt from "markdown-it";
// highlightjs
import hljs from "highlight.js";
import config from "@/config/config";

const mdIt = markdownIt();

// set options
mdIt.options.highlight = function (str: string, lang: string) {
  if (!lang) {
    return "";
  }
  return hljs.highlight(str, { language: lang }).value;
};

mdIt.use(markdownKatex, {
  throwOnError: false,
  errorColor: "#cc0000",
  output: "html",
});

const userStore = useUserStore();

const props = defineProps({
  chat_messages: {
    required: true,
    type: Array as () => EntityChatMessage[],
  },
});

const chat_messages = toRef(props, "chat_messages") as Ref<EntityChatMessage[]>;
const fileBaseUrl = config.backend + "/api/v1/files";
</script>
