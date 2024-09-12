<template>
  <div>
    <h3 class="mb-3">聊天记录</h3>

    <v-card
      v-for="message in messages.data"
      :key="message.id"
      class="mx-auto mt-3"
      width="100%"
    >
      <template #title>
        <div class="font-weight-black">
          <div v-if="message.role == 'assistant'">AI</div>
          <div v-else-if="message.role == 'system'">系统</div>

          <div v-else-if="message.role == 'file'" class="text-right">文件</div>
          <div v-else-if="message.role == 'image'" class="text-right">图片</div>
          <div v-else-if="message.role == 'user'" class="text-right">用户</div>

          <div v-else>
            {{ message.role }}
          </div>
        </div>
      </template>

      <v-card-text class="bg-surface-light pt-4">
        <div
          v-if="message.role == 'assistant' || message.role == 'system'"
          class="text-left"
        >
          <vue-markdown :source="message.content" />
        </div>

        <div v-else-if="message.role == 'user'" class="text-right">
          <vue-markdown :source="message.content" />
        </div>
        <div v-else-if="message.role == 'image'" class="text-right">
          <img
            :src="fileBaseUrl + '/' + message.content + '/download'"
            width="30%"
          />
        </div>
        <div v-else-if="message.role == 'file'" class="text-right">
          其他文件：<a :href="fileBaseUrl + '/' + message.content + '/download'"
            >下载</a
          >
        </div>
        <div v-else>
          {{ message.content }}
        </div>
      </v-card-text>
    </v-card>

    <div class="mt-3">
      <div v-if="toolError" class="mb-3">
        <v-alert
          density="compact"
          text="这个工具出现了异常，这应该不是我们的问题，如果你是此工具的开发者，请打开开发者控制台查看具体错误。"
          :title="'工具 ' + toolName + ' 出现异常'"
          type="warning"
        ></v-alert>
      </div>

      <div v-show="toolCalling">
        <v-progress-circular
          color="primary"
          indeterminate
          :size="16"
        ></v-progress-circular>
        正在执行 {{ toolName }}
      </div>
      <v-text-field
        v-model="input"
        label="输入消息"
        @keyup.enter="sendMessage"
      ></v-text-field>
      <v-file-input v-model="fileUpload" label="选择文件"></v-file-input>

      <v-btn color="primary" @click="sendMessage">发送</v-btn>
      <v-btn
        class="ml-2"
        color="primary"
        :loading="uploading"
        @click="uploadFile"
        >上传文件</v-btn
      >

      <v-btn class="ml-2" color="primary" @click="clearMessages">清空</v-btn>
      <v-btn class="ml-2" color="primary" @click="deleteChat">删除</v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useApi from "@/plugins/api";
import router from "@/router";
import { useChatStore } from "@/stores/chat";
import config from "@/config/config";

const chatStore = useChatStore();
const api = useApi();

// @ts-ignore
const chatId = useRoute().params.id as number;
chatStore.currentChatId = chatId;

const messages: Ref<any> = ref({
  data: [],
});
const input = ref("");
const toolName = ref("");
const toolError = ref(false);
const toolCalling = ref(false);
const fileUpload = ref();
const uploading = ref(false);
const fileBaseUrl = config.backend + "/api/v1/files";

document.addEventListener("paste", function (event) {
  const items = event.clipboardData && event.clipboardData.items;
  if (items && items.length) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        fileUpload.value = items[i].getAsFile();
        break;
      }
    }
  }
});

function sendMessage() {
  if (input.value !== "") {
    toolError.value = false;
    api.ChatMessage.apiV1ChatsIdMessagesPost(chatId, {
      message: input.value,
      role: "user",
    })
      .then((res) => {
        const newMessage = {
          content: input.value,
          role: "user",
        };

        if (messages.value.data == null) {
          messages.value.data = [newMessage];
        } else {
          messages.value.data?.push(newMessage);
        }

        const streamId = res.data.data?.stream_id;

        if (streamId) {
          streamChat(streamId);
        }
      })
      .catch((err) => {
        // if 409
        if (err.response.status === 409) {
          const streamId = err.response.data.data?.stream_id;

          if (streamId) {
            streamChat(streamId);
          }
        }
      });
  }
}

function streamChat(streamId: String) {
  const url = api.conf.basePath + "/api/v1/stream/" + streamId;

  const evtSource = new EventSource(url);

  let messageAdded = false;

  // 滚动页面到最底部
  window.scrollTo(0, document.body.scrollHeight);

  let i = 0;

  evtSource.addEventListener("data", (e) => {
    if (e.data === "[DONE]") {
      evtSource.close();
      return;
    }

    const data = JSON.parse(e.data);

    let append = true;

    switch (data.state) {
      case "tool_calling":
        toolCalling.value = true;
        toolName.value =
          data.tool_call_message.tool_name +
          " 中的 " +
          data.tool_call_message.function_name;
        break;
      case "tool_response":
        setTimeout(() => {
          toolName.value = "";
          toolCalling.value = false;
        }, 300);
        break;
      case "tool_failed":
        toolName.value =
          data.tool_response_message.tool_name +
          " 中的 " +
          data.tool_response_message.function_name;
        toolError.value = true;
        append = false;
        setTimeout(() => {
          toolCalling.value = false;
        }, 300);
        break;
      case "chunk":
        if (!messageAdded) {
          const newMessage = {
            content: "",
            role: "assistant",
          };

          if (messages.value.data == null) {
            messages.value.data = [newMessage];
          } else {
            // add to messages
            messages.value.data?.push(newMessage);
          }

          messageAdded = true;
          append = true;
          // set index
          i = (messages.value.data?.length ?? 1) - 1;
        }
    }

    if (append && messageAdded) {
      // @ts-ignore
      messages.value.data[i].content += data.content;
    }
  });

  // close
  evtSource.addEventListener("close", () => {
    evtSource.close();
  });
}

const getMessages = () => {
  api.ChatMessage.apiV1ChatsIdMessagesGet(chatId).then((res) => {
    messages.value.data = [];
    res.data.data?.forEach((message: any) => {
      if (message.role === "file") {
        // 如果 mime_type 是 image/
        if (message.user_file) {
          if (message.user_file.file.mime_type.startsWith("image/")) {
            message.role = "image";
            message.content = message.user_file.file.id;
          }
        } else if (message.file.mime_type.startsWith("image/")) {
          message.role = "image";
          message.content = message.file.id;
        }

        messages.value.data?.push(message);
      } else if (message.role === "assistant" || message.role === "user") {
        messages.value.data?.push(message);
      }
    });
  });
};

const clearMessages = () => {
  api.ChatMessage.apiV1ChatsIdClearPost(chatId).then(() => {
    getMessages();
  });
};

const deleteChat = () => {
  api.Chat.apiV1ChatsIdDelete(chatId).then(() => {
    api.Chat.apiV1ChatsGet().then((r) => {
      chatStore.chats = r.data.data;
    });
    router.push("/assistants");
  });
};

const uploadFile = () => {
  if (!fileUpload.value) {
    return;
  }

  uploading.value = true;
  api.ChatMessage.apiV1ChatsIdFilesPost(
    chatId,
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
        getMessages();
      }
    })
    .catch((err) => {
      alert(err.response.data.message);
    })
    .finally(() => {
      uploading.value = false;
    });
};

getMessages();
</script>
