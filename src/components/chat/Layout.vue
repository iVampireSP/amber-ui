<template>
  <n-layout :has-sider="!isMobile">
    <n-layout-sider :native-scrollbar="false" v-if="!isMobile">
      <n-scrollbar :style="'max-height: ' + clientHeight + 'px'">
        <n-list hoverable clickable v-if="chatStore.chats?.length">
          <n-list-item
            v-for="c in chatStore.chats"
            :key="c.id"
            :class="
              c.id === chatStore.currentChat?.id
                ? ' bg-gray-100 dark:bg-gray-700'
                : ''
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
        <div v-else class="mt-8">
          <n-result
            status="404"
            title="你还没有对话"
            description="不如现在就开始？"
          >
          </n-result>
        </div>
      </n-scrollbar>
    </n-layout-sider>
    <n-layout>
      <n-layout-content>
        <slot />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { useDialog } from "naive-ui";
import { TrashBinOutline } from "@vicons/ionicons5";
import getApi from "../../plugins/api";
import { useChatStore } from "../../stores/chat";
import router from "@/router";
import { ref } from "vue";
import { EntityAssistant, EntityChat } from "@/api";
import { useIsMobile } from "@/utils/composables";
import { useAppStore } from "@/stores/app";

const clientHeight = ref(100);

const isMobile = useIsMobile();

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
      if (parseInt(router.currentRoute.value.params.id) === chatId) {
        router.push("/")
      }
    },
  });
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
