<template>
  <div
    class="relative flex flex-col h-[calc(100vh-var(--header-height)*1.9)] lg:items-center"
  >
    <div class="w-4/5">
      <div>
        <div class="flex-grow mt-3 mb-1 text-5xl" v-if="!chatMessages?.length">
          <n-gradient-text type="info" class="pr-3 pb-2 pt-2">
            你好，{{ userStore.user.name }}
          </n-gradient-text>
          <br />
          <div class="pr-3 mt-8 text-2xl">
            <n-text depth="3"> 有什么我可以帮您的吗？ </n-text>
          </div>
        </div>

        <div v-else>
            <MessageList :chat_messages="chatMessages" />
        </div>
      </div>

      <div class="fixed bottom-0 left-0 right-0 pb-10">
        <div
          ref="inputContainer"
          class="mx-auto w-2xl max-w-2xl outline-none input-color input-bg rounded-full flex pl-5 pr-5 bg-white shadow-lg items-center p-4 pb-4 transition-all"
          @keyup.enter="sendText"
        >
          <div class="overflow-x-hidden h-full w-full flex items-center">
            <n-scrollbar class="max-h-96">
              <div
                ref="inputText"
                :class="{ 'has-placeholder': isPlaceholderVisible }"
                contenteditable="true"
                placeholder="请输入文本..."
                class="input-text max-w-full outline-none text-lg text-pretty pl-2 min-h-6"
                @input="updateInputHeight"
              ></div>
            </n-scrollbar>
          </div>
          <div
            ref="actionContainer"
            class="flex [&>button]:ml-2 pr-4 justify-end"
          >
            <n-button tertiary circle size="large">
              <template #icon>
                <n-icon><DocumentAttachOutline /></n-icon>
              </template>
            </n-button>
            <n-button tertiary circle size="large">
              <template #icon>
                <n-icon><MicOutline /></n-icon>
              </template>
            </n-button>
            <n-button tertiary circle size="large" v-show="showSendBtn">
              <template #icon>
                <n-icon><SendOutline /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useUserStore } from "../../stores/user";
import { onMounted, ref } from "vue";
import {
  SendOutline,
  MicOutline,
  DocumentAttachOutline,
} from "@vicons/ionicons5";
import { EntityChatMessage } from "@/api";
import getApi from "@/plugins/api";

// 获取组件传入的 chatId
const chatId: Ref<string | number | undefined | null> = ref(null);

// const props = defineProps<{
//   chatId: string | number | undefined | null;
// }>();

// 定义 prop, chatId 是可选的
const props = defineProps({
  chatId: {
    type: [String, Number],
    required: false,
    default: null,
  },
});

onMounted(() => {
  chatId.value = props.chatId;
});

const userStore = useUserStore();
const compositionStart = ref(false);
const inputContainer: any = ref(null);
const inputText: any = ref(null);
const actionContainer: any = ref(null);
const isPlaceholderVisible = ref(true);
const triggerTimes = ref(0);
const showSendBtn = ref(false);
const content = ref("");
const chatMessages: Ref<EntityChatMessage[] | undefined> = ref([]);

function updateInputHeight() {
  if (!inputText?.value || !inputContainer.value || !actionContainer.value) {
    return;
  }

  const input = inputText.value;
  const container = inputContainer.value;
  const action = actionContainer.value;

  content.value = input.innerText;
  const trimContent = input.innerText.trim();

  const isEmpty = trimContent === "";
  isPlaceholderVisible.value = isEmpty;
  if (isEmpty || trimContent.length < 30) {
    triggerTimes.value = 0;
  }

  if (trimContent.length > 30) {
    triggerTimes.value = 10;
  }

  // 获取元素实际占用高度
  const height = input.scrollHeight;

  const lines = input.innerText.split("\n").length;

  if (lines > 3 || height > 50) {
    triggerTimes.value += 1;
  } else {
    triggerTimes.value -= 1;
  }

  if (triggerTimes.value > 8) {
    container.classList.add("rounded-lg");
    container.classList.remove("rounded-full");
    container.classList.remove("max-w-2xl");
    container.classList.remove("w-2xl");
    container.classList.add("flex-col");
    action.classList.add("w-full");
    action.classList.add("text-right");
    action.classList.add("pt-4");
    action.classList.add("pb-0");
    action.classList.add("mt-2");
    showSendBtn.value = true;
  } else {
    container.classList.remove("rounded-lg");
    container.classList.add("rounded-full");
    container.classList.remove("flex-col");
    container.classList.add("w-2xl");
    container.classList.add("max-w-2xl");

    action.classList.remove("w-full");
    action.classList.remove("text-right");
    action.classList.remove("pt-4");
    action.classList.remove("pt-0");
    action.classList.remove("mt-2");
    showSendBtn.value = false;
  }
}

function handleCompositionStart() {
  compositionStart.value = true;
}

function handleCompositionEnd() {
  compositionStart.value = false;
}

function sendText() {
  if (!inputText?.value) {
    return;
  }

  const input = inputText.value;
  const textContent = input.innerText.trim();

  if (textContent === "") {
    return;
  }

  // 发送文本到服务器
  sendMessage(textContent);

  // 清空输入框
  input.innerText = "";

  updateInputHeight();
  
  chatMessages.value?.push({
    content: textContent,
    role: "user",
  });
}

function sendMessage(text: string) {
  console.log("发送文本:", text);
  // 实际发送文本到服务器的逻辑
}

function onFocused() {
  if (!inputContainer.value) {
    return;
  }

  const container = inputContainer.value;
  container.classList.remove("max-w-2xl");
  container.classList.add("max-w-full");
}

function onBlurred() {
  if (!inputContainer.value) {
    return;
  }

  const container = inputContainer.value;
  container.classList.remove("max-w-full");
  container.classList.add("max-w-2xl");
}

async function getChatMessages() {
  // 获取当前聊天记录
  if (chatId.value) {
    const cm = await getApi().ChatMessage.apiV1ChatsIdMessagesGet(
      Number(chatId.value)
    );

    chatMessages.value = cm.data.data;
  }
}

onMounted(() => {
  updateInputHeight();
  getChatMessages();
});
</script>

<style scoped>
.input-color {
  color: #3a3a3a;
}
.input-bg {
  background-color: #eeeeee;
}
.input-text {
  flex-grow: 1;
  padding-right: 10px; /* 为按钮区域留出一些空间 */
}
.input-text {
  position: relative;
}

.input-text.has-placeholder::before {
  content: attr(placeholder);
  color: #999; /* 可以自定义颜色 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none; /* 确保用户点击时不会触发 placeholder */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px; /* 根据实际布局调整内边距 */
}

/* 如果是暗黑模式 */
@media (prefers-color-scheme: dark) {
  .input-color {
    color: #d4d4d4;
  }
  .input-bg {
    background-color: #1e1f20;
  }
}
</style>
