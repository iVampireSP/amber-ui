<template>
  <div
    class="relative flex flex-col h-[calc(100vh-var(--header-height)*1.9)]"
  >
    <div class="flex-grow mt-3 mb-1 text-5xl">
      <n-gradient-text type="info" class="pr-3">
        你好，{{ userStore.user.name }}
      </n-gradient-text>
      <br />
      <div class="pr-3 mt-8 text-2xl">
        <n-text depth="3"> 有什么我可以帮您的吗？ </n-text>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 pb-5">
      <div
        ref="inputContainer"
        class="mx-auto w-2xl max-w-2xl outline-none input-color input-bg rounded-full flex pl-5 pr-5 bg-white shadow-lg items-center p-4 pb-4"
      >
        <div class="overflow-x-hidden h-full w-full flex items-center">
          <n-scrollbar class="max-h-96">
            <div
              ref="inputText"
              :class="{ 'has-placeholder': isPlaceholderVisible }"
              contenteditable="true"
              placeholder="请输入文本..."
              class="input-text max-w-full outline-none text-lg text-pretty pl-2"
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
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useUserStore } from "../../stores/user";
import { InputHTMLAttributes, onMounted, ref } from "vue";
import {
  SendOutline,
  MicOutline,
  DocumentAttachOutline,
} from "@vicons/ionicons5";

const message = useMessage();
const userStore = useUserStore();

const inputMessage = ref("");
const inputContainer: any = ref(null);
const inputText: InputHTMLAttributes | null = ref(null);
const actionContainer: any = ref(null);
const isPlaceholderVisible = ref(true);
const triggerTimes = ref(0);
const showSendBtn = ref(false);
const content = ref("");

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

onMounted(() => {
  updateInputHeight();
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
