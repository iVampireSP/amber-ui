<template>
  <n-list hoverable clickable v-if="chatStore.chats?.length">
    <n-list-item
      v-for="c in chatStore.chats"
      :key="c.id"
      :class="
        c.id === chatStore.currentChatId ? ' bg-gray-100 dark:bg-gray-700' : ''
      "
      @click="viewChat(c.id ?? 0)"
    >
      <n-thing>
        <div class="flex justify-between items-center">
          <div>
            {{ c.name }}
          </div>
          <div>
            <n-button
              quaternary
              circle
              type="info"
              @click.stop="editChat(c.id ?? 0)"
            >
              <template #icon>
                <n-icon size="16" class="cursor-pointer">
                  <SettingsOutline />
                </n-icon>
              </template>
            </n-button>
            <n-button
              quaternary
              circle
              type="warning"
              @click.stop="deleteChat(c.id ?? 0)"
            >
              <template #icon>
                <n-icon size="16" class="cursor-pointer">
                  <TrashBinOutline />
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </n-thing>
    </n-list-item>
  </n-list>
  <div v-else>
    <n-result status="404" title="你还没有对话" description="不如现在就开始？">
    </n-result>
  </div>
  <div>
    <n-drawer placement="left" v-model:show="showSettingsDialog" :width="600">
      <n-drawer-content closable title="编辑对话">
        <div v-if="currentChat">
          <n-form >
            <n-form-item label="对话名称">
              <n-input
                v-model:value="currentChat.name"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item label="指定助理">
              <n-select
                :style="{ width: '33%' }"
                v-model:value="currentChat.assistant_id"
                :options="assistantSelects"
              />
            </n-form-item>

            <n-button type="primary" @click="editChatPost"> 更新 </n-button>
          </n-form>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import { NMenu, useDialog } from "naive-ui";
import { useRoute } from "vue-router";
import { leftMenuOptions } from "../plugins/menus/left";
import {
  ChatboxOutline,
  TrashBinOutline,
  SettingsOutline,
} from "@vicons/ionicons5";
import getApi from "../plugins/api";
import { useChatStore } from "../stores/chat";
import router from "@/router";
import { ref } from "vue";
import { EntityAssistant, EntityChat } from "@/api";

const dialog = useDialog();
const chatStore = useChatStore();
const showSettingsDialog = ref(false);
const currentChatId = ref();
const currentChat: Ref<EntityChat> = ref({});
const assistants: Ref<EntityAssistant[]> = ref([]);
const assistantSelects = ref([
  {
    label: "不使用",
    value: null,
  },
]);

async function getChats() {
  chatStore.chats = (await getApi().Chat.apiV1ChatsGet()).data.data;
}

const viewChat = (chatId: number) => {
  router.push("/chat/" + chatId);
};

const deleteChat = async (chatId: number) => {
  dialog.warning({
    title: "删除对话",
    content: "删除后，将不能恢复",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await getApi().Chat.apiV1ChatsIdDelete(chatId);
      await getChats();
    },
  });
};

const editChat = async (_chatId: number) => {
  showSettingsDialog.value = true;
  currentChatId.value = _chatId;
  currentChat.value =
    (await getApi().Chat.apiV1ChatsIdGet(_chatId)).data.data ?? {};
};

const editChatPost = async () => {
  await getApi().Chat.apiV1ChatsIdPut(currentChatId.value, {
    name: currentChat.value?.name ?? "",
    assistant_id: currentChat.value?.assistant_id,
  });
  await getChats();
};

const getAssistants = async () => {
  assistants.value =
    (await getApi().Assistant.apiV1AssistantsGet()).data.data ?? [];

  assistantSelects.value = [];

  assistantSelects.value.push({
    label: "不使用",
    value: null,
  });
  assistants.value.forEach((a) => {
    if (a.name !== undefined && a.id !== undefined) {
      return assistantSelects.value.push({
        label: a.name,
        // @ts-ignore
        value: a.id,
      });
    }
  });
};

getChats();
getAssistants();
</script>
