<template>
  <n-list hoverable clickable v-if="assistants.length">
    <n-list-item v-for="c in assistants" :key="c.id" @click="currentAssistantId = c.id">
      <n-thing>
        <div class="flex justify-between items-center">
          <div>
            {{ c.name }}
          </div>
          <div>
            <n-button quaternary circle type="info" @click.stop="showEditAssistant(c.id ?? 0)">
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
              @click.stop="deleteAssistant(c.id ?? 0)"
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
    <n-result status="404" title="还没有助理" description="助理可以整合一系列工具，也可以指定人设和自定义提示词">
    </n-result>
  </div>
  <div>
    <n-drawer placement="left" v-model:show="showSettingsDialog" :width="600">
      <n-drawer-content closable title="编辑助理">
        <div v-if="currentAssistant">
          <n-form>
            <n-form-item label="助理名称">
              <n-input
                v-model:value="currentAssistant.name"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item label="资料库选择">
              <n-select
                :style="{ width: '33%' }"
                v-model:value="currentAssistant.library_id"
                :options="librarySelects"
              />
            </n-form-item>

            <n-button type="primary" @click="editAssistant"> 更新 </n-button>
          </n-form>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useDialog } from "naive-ui";
import { TrashBinOutline, SettingsOutline } from "@vicons/ionicons5";
import getApi from "../plugins/api";
import { useChatStore } from "../stores/chat";
import router from "@/router";
import { ref } from "vue";
import { EntityAssistant, EntityLibrary } from "@/api";

const dialog = useDialog();
const chatStore = useChatStore();
const showSettingsDialog = ref(false);
const currentAssistantId = ref();
const currentAssistant: Ref<EntityAssistant> = ref({});
const assistants: Ref<EntityAssistant[]> = ref([]);
const librarySelects: any = ref([]);
const libraries: Ref<EntityLibrary[]> = ref([]);
async function getChats() {
  chatStore.chats = (await getApi().Chat.apiV1ChatsGet()).data.data;
}

const deleteAssistant = async (id: number) => {
  dialog.warning({
    title: "删除助理",
    content: "删除后，将不能恢复",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await getApi().Assistant.apiV1AssistantsIdDelete(id);
      await getAssistants();
    },
  });
};

const showEditAssistant = async (id: number) => {
  showSettingsDialog.value = true;
  currentAssistantId.value = id;
  currentAssistant.value =
    (await getApi().Assistant.apiV1AssistantsIdGet(id)).data.data ?? {};
};

const editAssistant = async () => {
  await getApi().Assistant.apiV1AssistantsIdPatch(
    currentAssistantId.value,
    currentAssistant.value
  );
  await getAssistants();
};

const getLibraries = async () => {
  libraries.value =
    (await getApi().Library.apiV1LibrariesGet()).data.data ?? [];

  librarySelects.value = [];

  librarySelects.value.push({
    label: "不使用",
    value: null,
  });
  libraries.value.forEach((a) => {
    if (a.name !== undefined && a.id !== undefined) {
      return librarySelects.value.push({
        label: a.name,
        // @ts-ignore
        value: a.id,
      });
    }
  });
};

const getAssistants = async () => {
  assistants.value =
    (await getApi().Assistant.apiV1AssistantsGet()).data.data ?? [];
};

getChats();
getLibraries();
getAssistants();
</script>
