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
              :src="fileBaseUrl + '/user/' + message.user_file.id + '/download'"
            />
            <n-image
              v-else-if="message.file"
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
            <div  class="flex items-end flex-col">
              <div>
                <n-divider class="!p-0 !m-0" title-placement="right">
                  {{ userStore.user.name }}
                </n-divider>
              </div>
              <div
                v-if="mdInited"
                class="markdown-body"
                v-html="mdIt.render(message.content)"
              ></div>
            </div>

            <div class="relative h-full">
              <n-avatar
                round
                size="large"
                :src="userStore.user.avatar"
                class="ml-3 min-w-10 absolute top-0"
              />
            </div>
          </div>
        </n-flex>
      </div>
      <div v-else-if="message.role === 'assistant' && message.content">
        <!-- 助理消息 -->
        <n-flex justify="start" class="!flex-nowrap">
          <div class="relative h-full">
            <n-avatar
              round
              size="large"
              :src="leaflowPng"
              class="min-w-10 min-h-10 p-1.5 absolute top-0 !bg-transparent dark:!bg-white"
            />
          </div>

          <div class="flex items-center flex-nowrap">
            <!-- <vue-markdown-it
            :source="message.content"
            :options="markdownOptions"
            :plugins="[markdownPlugins]"
          /> -->

            <!-- <div v-html="mdIt.render('# Math Rulez! \n  $\\sqrt{3x-1}+(1+x)^2$')"></div> -->

            <!-- 当 message.content 变化时，重新渲染  -->
            <div>
              <div
                v-if="message.assistant_id && message.assistant !== null && message.assistant?.name !== ''"
              >
                <n-divider class="!p-0 !m-0" title-placement="left">
                  {{ message.assistant?.name }}
                </n-divider>
              </div>
              <div
                v-if="mdInited"
                class="break-all break-words markdown-body"
                v-html="mdIt.render(message.content)"
              ></div>
            </div>
            <!-- <div v-html="mdIt.render(message.content)"></div> -->

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
// import hljs from "highlight.js";
import config from "@/config/config";
import Shiki from "@shikijs/markdown-it";

const mdIt = markdownIt();
const mdInited = ref(false);

// set options
// mdIt.options.highlight = function (str: string, lang: string) {
//   if (!lang) {
//     return "";
//   }
//   return hljs.highlight(str, { language: lang }).value;
// };

async function initMD() {
  mdIt.use(
    await Shiki({
      themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
      },
    })
  );

  mdIt.use(markdownKatex, {
    throwOnError: false,
    errorColor: "#cc0000",
    output: "html",
  });

  mdInited.value = true;
}
const userStore = useUserStore();

const props = defineProps({
  chat_messages: {
    required: true,
    type: Array as () => EntityChatMessage[],
  },
});

const chat_messages = toRef(props, "chat_messages") as Ref<EntityChatMessage[]>;
const fileBaseUrl = config.backend + "/api/v1/files";

onMounted(() => {
  initMD();
});
</script>
