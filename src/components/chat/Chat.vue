<template>
  <div class="relative flex flex-col items-center">
    <div class="w-4/5">
      <div>
        <div
          class="flex-grow mt-3 mb-1 text-5xl select-none"
          v-if="!chatMessages?.length"
        >
          <n-gradient-text type="success" class="pr-3 pb-2 pt-2">
            你好，{{ userStore.user.name }}
          </n-gradient-text>
          <br />
          <div class="pr-3 mt-8 text-2xl">
            <n-text depth="3"> 有什么我可以帮您的吗？ </n-text>
          </div>
        </div>

        <div v-else @click="assistantStore.selectMenu = false">
          <MessageList :chat_messages="chatMessages" />
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0"
        :class="
          !appStore.contentScrollOnBottom && appStore.contentScrollable
            ? 'hidden'
            : 'mb-6'
        "
      >
        <!-- <div
          class="mx-auto w-2xl max-w-2xl text-center mb-3 animate__animated animate__pulse text-lg"
          v-if="toolCalling"
        >
          <n-gradient-text type="info">
            {{ toolName }}
          </n-gradient-text>
        </div> -->

        <div
          class="mx-auto w-2xl max-w-2xl text-center mb-3 animate__animated animate__pulse text-lg"
          v-if="isMobile && chatStore.toolName != ''"
        >
          <n-gradient-text type="info">
            正在执行 {{ chatStore.toolName }}
          </n-gradient-text>
        </div>
        <div
          ref="inputContainer"
          class="mx-auto w-2xl max-w-xs lg:max-w-2xl outline-none input-color input-bg rounded-full flex pl-5 pr-5 bg-white shadow-lg items-center p-4 pb-4 transition-all"
        >
          <div class="overflow-x-hidden h-full w-full flex items-center">
            <n-scrollbar class="max-h-96">
              <n-dropdown
                :show="assistantStore.selectMenu"
                :options="assistantMenuOptions"
                placement="top-start"
                @select="handleSelect"
              >
                <div class="absolute left-0"></div>
              </n-dropdown>
              <div
                ref="inputText"
                :class="{ 'has-placeholder': isPlaceholderVisible }"
                contenteditable="true"
                placeholder="请输入文本..."
                class="input-text max-w-full outline-none text-lg text-pretty pl-2 min-h-6"
                @keydown="onKeydown"
                @input="updateInputHeight"
                @compositionstart="handleCompositionStart"
                @compositionend="handleCompositionEnd"
              ></div>
            </n-scrollbar>
          </div>
          <n-spin :show="processing">
            <div
              ref="actionContainer"
              class="flex [&>button]:ml-2 pr-4 justify-end"
            >
              <n-tooltip
                trigger="hover"
                v-if="chatId !== null && chatData.assistant_id !== null"
              >
                <template #trigger>
                  <n-button tertiary circle size="large">
                    <template #icon>
                      <n-icon><DocumentAttachOutline /></n-icon>
                    </template>
                  </n-button>
                </template>
                <span> 在做了在做了 </span>
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button tertiary circle size="large">
                    <template #icon>
                      <n-icon><MicOutline /></n-icon>
                    </template>
                  </n-button>
                </template>
                <span> 在做了在做了 </span>
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    tertiary
                    circle
                    size="large"
                    v-show="chatMessages?.length"
                    @click="clearChatHistory"
                  >
                    <template #icon>
                      <n-icon><TrashBinOutline /></n-icon>
                    </template>
                  </n-button>
                </template>
                <span> 清空历史 </span>
              </n-tooltip>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    tertiary
                    circle
                    size="large"
                    v-show="showSendBtn"
                    @click="sendText"
                  >
                    <template #icon>
                      <n-icon><SendOutline /></n-icon>
                    </template>
                  </n-button>
                </template>
                <span> 发送 </span>
              </n-tooltip>
            </div>
          </n-spin>
        </div>
        <n-text
          depth="3"
          class="text-center block mt-2 mb-2 text-sm select-none"
          v-show="appStore.contentScrollOnBottom"
        >
          AI 也有可能犯错误，请在使用之前核查信息。
        </n-text>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useUserStore } from "../../stores/user";
import { onMounted, onUnmounted, Ref, ref } from "vue";
import {
  SendOutline,
  MicOutline,
  DocumentAttachOutline,
  TrashBinOutline,
} from "@vicons/ionicons5";
import {
  EntityChatMessage,
  SchemaChatMessageAddRequestRoleEnum,
  EntityChat,
  SchemaChatMessageAddRequest,
} from "@/api";
import getApi from "@/plugins/api";
import MessageList from "./MessageList.vue";
import { useChatStore } from "@/stores/chat";
import router from "@/router";
import element from "@/config/element";
import { useIsMobile } from "@/utils/composables";
import { useAppStore } from "@/stores/app";
import { useDialog, useMessage } from "naive-ui";
import { useAssistantStore } from "@/stores/assistants";

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

const isMobile = useIsMobile();
const userStore = useUserStore();
const chatStore = useChatStore();
const compositionStart = ref(false);
const inputContainer: any = ref(null);
const inputText: any = ref(null);
const actionContainer: any = ref(null);
const isPlaceholderVisible = ref(true);
const triggerTimes = ref(0);
const showSendBtn = ref(false);
const content = ref("");
const inputExpanded = ref(false);
const chatMessages: Ref<EntityChatMessage[] | undefined> = ref([]);
const processing = ref(false);
const fileUpload = ref();
const uploading = ref(false);
const autoScroll = ref(true);
const appStore = useAppStore();
const dialog = useDialog();
const assistantStore = useAssistantStore();
const message = useMessage();

function onKeydown(e: KeyboardEvent) {
  // 如果是 Esc
  if (e.code === "Escape") {
    assistantStore.selectMenu = false;
  }

  // 如果第一个字是 @，则显示选择助理的菜单
  if (content.value === "" && e.key === "@") {
    showAssistantSelect();
    e.preventDefault();
  }

  // 带 shift 不触发
  if (e.shiftKey || inputExpanded.value) {
    return;
  }

  // 如果 content.value 是空的，但是同时按了 Shift 和 Enter，则阻止
  if (content.value.trim() === "" && e.code === "Enter") {
    e.preventDefault();
    return;
  }

  // 禁止换行起手
  if (!compositionStart.value && e.code === "Enter") {
    e.preventDefault();
    sendText();
  }
}

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

  if (lines > 1) {
    triggerTimes.value += 8;
  }
  if (height > 50) {
    triggerTimes.value += 1;
  } else {
    triggerTimes.value -= 1;
  }

  if (triggerTimes.value > 8) {
    container.classList.add("rounded-lg");
    container.classList.remove("rounded-full");
    // container.classList.remove("max-w-2xl");
    // container.classList.remove("w-2xl");
    container.classList.add("flex-col");
    // action.classList.add("w-full");
    action.classList.add("text-right");
    action.classList.add("pt-4");
    action.classList.add("pb-0");
    action.classList.add("mt-2");
    showSendBtn.value = true;
    inputExpanded.value = true;
  } else {
    container.classList.remove("rounded-lg");
    container.classList.add("rounded-full");
    container.classList.remove("flex-col");
    // container.classList.add("w-2xl");
    // container.classList.add("max-w-2xl");

    // action.classList.remove("w-full");
    action.classList.remove("text-right");
    action.classList.remove("pt-4");
    action.classList.remove("pt-0");
    action.classList.remove("mt-2");
    showSendBtn.value = false;
    inputExpanded.value = false;
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
  sendMessage("user", textContent);

  // 清空输入框
  input.innerText = "";

  updateInputHeight();

  // 滚动
  // @ts-ignore ignore
  element.mainContainer?.scrollTo({
    top: "999999",
    behavior: "smooth",
  });
}

async function sendMessage(
  role: SchemaChatMessageAddRequestRoleEnum,
  text: string,
  variables: any = {}
) {
  if (processing.value) {
    return;
  }
  if (role.trim() === "") {
    role = "user";
  }
  if (text.trim() === "") {
    return;
  }

  let redirect = false;

  if (!chatId.value) {
    await getApi()
      .Chat.apiV1ChatsPost({
        name: text.slice(0, 10),
      })
      .then(async (res) => {
        chatId.value = res.data.data?.id;
        chatStore.currentChat = res.data.data;

        if (chatId.value) {
          redirect = true;
        }
        await getChatMessages();
      });
  }

  let chatVariables = {
    "now": new Date().toLocaleString(),
  };

  // 合并
  chatVariables = {
    ...chatVariables,
    ...variables,
  };

  let payload: SchemaChatMessageAddRequest = {
    message: text,
    role: role,
    variables: chatVariables,
  };
  if (chatStore.currentAssistantId) {
    payload = {
      ...payload,
      assistant_id: chatStore.currentAssistantId,
    };
  }

  // toolError.value = false;
  getApi()
    .ChatMessage.apiV1ChatsIdMessagesPost(Number(chatId.value), payload)
    .then(async (res) => {
      // const newMessage = {
      //   content: text,
      //   role: role,
      // };

      // if (chatMessages.value) {
      //   chatMessages.value = [newMessage];
      // }

      // if (chatMessages.value && chatMessages.value.length) {
      //   chatMessages.value?.push(newMessage);
      // }

      const streamId = res.data.data?.stream_id;

      if (streamId) {
        await getChatMessages();
        streamChat(streamId, redirect);
      }
    })
    .catch(async (err) => {
      // if 409
      if (err.response?.status === 409) {
        const streamId = err.response.data.data?.stream_id;

        if (streamId) {
          await getChatMessages();
          streamChat(streamId, redirect);
        }
      }
    });
}

// function onFocused() {
//   if (!inputContainer.value) {
//     return;
//   }

//   const container = inputContainer.value;
//   container.classList.remove("max-w-2xl");
//   container.classList.add("max-w-full");
// }

// function onBlurred() {
//   if (!inputContainer.value) {
//     return;
//   }

//   const container = inputContainer.value;
//   container.classList.remove("max-w-full");
//   container.classList.add("max-w-2xl");
// }

// 监听 appStore.contentScrollPosition
watch(
  () => appStore.contentScrollPosition,
  () => {
    // 滚动则关闭菜单
    assistantStore.selectMenu = false;
  }
);

async function getChatMessages() {
  // 获取当前聊天记录
  if (chatId.value) {
    const cm = await getApi().ChatMessage.apiV1ChatsIdMessagesGet(
      Number(chatId.value)
    );

    chatMessages.value = cm.data.data;

    // 滚动
    setTimeout(() => {
      // @ts-ignore ignore
      element.mainContainer?.scrollTo({
        top: "999999",
        behavior: "smooth",
      });
    }, 400);
    // 完成
    return true;
  }

  return false;
}

function streamChat(streamId: String, redirect = false) {
  const url = getApi().conf.basePath + "/api/v1/stream/" + streamId;

  const evtSource = new EventSource(url);
  // 如果 error
  evtSource.onerror = (e) => {
    dialog.error({
      title: "推理失败",
      content: "目前无法完成推理，请稍后再试。",
      positiveText: "好",
    });
  };

  let messageAdded = false;

  let i = 0;
  processing.value = true;

  evtSource.addEventListener("data", (e) => {
    if (e.data === "[DONE]") {
      evtSource.close();
      processing.value = false;

      if (redirect && chatId.value != undefined) {
        // 改变 URL
        router.replace({
          name: "/chat/[id]/",
          params: {
            id: chatId.value,
          },
        });
      }

      return;
    }

    const data = JSON.parse(e.data);

    let append = true;

    switch (data.state) {
      case "failed":
        dialog.error({
          title: "推理失败",
          content: "目前无法完成推理，请稍后再试。",
          positiveText: "好",
        });
        break;
      case "tool_calling":
        // toolCalling.value = true;
        chatStore.toolName =
          data.tool_call_message.tool_name +
          " 中的 " +
          data.tool_call_message.function_name;
        // toolName.value =
        //   data.tool_call_message.tool_name +
        //   " 中的 " +
        //   data.tool_call_message.function_name;
        break;
      case "tool_response":
        setTimeout(() => {
          chatStore.toolName = "";
        }, 300);
        break;
      case "tool_failed":
        // toolName.value =
        //   data.tool_response_message.tool_name +
        //   " 中的 " +
        //   data.tool_response_message.function_name;

        chatStore.toolName =
          data.tool_call_message.tool_name +
          " 中的 " +
          data.tool_call_message.function_name;

        dialog.error({
          title: "工具调用失败",
          content:
            data.tool_call_message.tool_name +
            " 中的 " +
            data.tool_call_message.function_name,
          positiveText: "好",
        });

        // toolError.value = true;
        append = false;
        setTimeout(() => {
          // toolCalling.value = false;
          chatStore.toolName = "";
        }, 1000);
        break;
      case "chunk":
        if (!messageAdded) {
          const newMessage = {
            content: "",
            role: "assistant",
          };

          if (!chatMessages.value) {
            chatMessages.value = [newMessage];
          } else {
            chatMessages.value?.push(newMessage);
          }

          messageAdded = true;
          append = true;
          i = (chatMessages.value?.length ?? 1) - 1;
        }

        if (autoScroll.value) {
          // @ts-ignore ignore
          element.mainContainer?.scrollTo({
            top: "999999",
            behavior: "smooth",
          });
        }
    }

    if (append && messageAdded && chatMessages.value?.length) {
      chatMessages.value[i].content += data.content;
    }
  });

  // close
  evtSource.addEventListener("close", () => {
    evtSource.close();
  });
}

const clearChatHistory = async () => {
  processing.value = true;
  await getApi().ChatMessage.apiV1ChatsIdClearPost(
    chatStore.currentChat?.id ?? 0
  );
  chatMessages.value = [];
  processing.value = false;
};

const chatData: Ref<EntityChat> = ref({});
const getChat = async () => {
  chatData.value =
    (await getApi().Chat.apiV1ChatsIdGet(chatStore.currentChat?.id ?? 0)).data
      .data ?? {};

  chatStore.currentChat = chatData.value;
  if (chatData.value.assistant_id) {
    chatStore.currentAssistantId = chatData.value.assistant_id;
  }
};

onMounted(() => {
  chatId.value = props.chatId;
  chatStore.currentChat = {
    id: Number(chatId.value),
  };
  updateInputHeight();
  getChatMessages();

  if (chatId.value) {
    getChat();
  }
});

onUnmounted(() => {
  chatStore.currentChat = {
    id: 0,
  };
});

const assistantMenuOptions: any = ref([]);
const showAssistantSelect = async () => {
  //  const changeAssistant = (id: number | undefined) => {
  //   if (id) {
  //     chatStore.currentAssistantId = id;
  //   }
  // };

  assistantStore.selectMenu = true;
  assistantMenuOptions.value = [];
  assistantStore.assistants =
    (await getApi().Assistant.apiV1AssistantsGet()).data.data ?? [];

  for (const assistant of assistantStore.assistants) {
    assistantMenuOptions.value.push({
      label: assistant.name ?? "",
      key: assistant.id ?? "",
    });
  }
};

const uploadFile = () => {
  if (!fileUpload.value || !chatId.value) {
    return;
  }

  uploading.value = true;
  getApi()
    .ChatMessage.apiV1ChatsIdFilesPost(
      Number(chatId.value),
      {
        file: fileUpload.value,
        url: "",
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((r) => {
      // 如果成功
      if (r.status === 200 || r.status === 201) {
        fileUpload.value = null;
        getChatMessages();
      }
    })
    .catch((err) => {
      alert(err.response.data.message);
    })
    .finally(() => {
      uploading.value = false;
    });
};

function handleSelect(key: string | number) {
  chatStore.currentAssistantId = Number(key);
  assistantStore.selectMenu = false;

  message.info("助理已切换");
}
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
