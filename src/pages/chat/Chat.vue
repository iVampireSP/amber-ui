<template>
  <ChatComponent />
</template>
<script setup lang="ts">
import ChatComponent from "@/components/chat/Chat.vue";
import { useDialog } from "naive-ui";
import getApi from "../../plugins/api";
import { useChatStore } from "../../stores/chat";
import router from "@/router";
import { ref } from "vue";
import { EntityAssistant, EntityChat } from "@/api";
import { useAppStore } from "@/stores/app";

const clientHeight = ref(100);

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

const appStore = useAppStore();
const updateClientHeight = () => {
  clientHeight.value = window.innerHeight - appStore.headerHeight;
};

onMounted(() => {
  updateClientHeight();
  window.addEventListener("resize", updateClientHeight);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateClientHeight);
});

getChats();
getAssistants();
</script>
