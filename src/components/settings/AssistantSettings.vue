<template>
  <div class="mb-3">
    <n-button tertiary @click="showCreateDialog = true"> 新建助理 </n-button>
  </div>
  <n-list hoverable clickable v-if="assistants.length">
    <n-list-item
      v-for="c in assistants"
      :key="c.id"
      @click="showEditAssistant(c.id ?? 0)"
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
              @click.stop="showEditAssistant(c.id ?? 0)"
            >
              <template #icon>
                <n-icon size="16" class="cursor-pointer">
                  <SettingsOutline />
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </n-thing>
    </n-list-item>
  </n-list>
  <div v-else class="text-center">
    <n-result
      status="404"
      title="还没有助理"
      description="助理可以整合一系列工具，也可以指定人设和自定义提示词"
    >
      <n-button type="primary" @click="showCreateDialog = true">
        新建助理
      </n-button>
    </n-result>
  </div>
  <div>
    <n-drawer
      placement="left"
      v-model:show="showSettingsDialog"
      :width="drawerWidth"
    >
      <n-drawer-content closable title="编辑助理">
        <div v-if="currentAssistant">
          <n-form>
            <n-form-item label="助理名称">
              <n-input
                v-model:value="currentAssistant.name"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item label="描述">
              <n-input
                v-model:value="currentAssistant.description"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item label="提示词">
              <n-input
                type="textarea"
                v-model:value="currentAssistant.prompt"
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
            <n-space>
              <n-button type="primary" @click="editAssistant"> 更新 </n-button>
              <n-button type="error" @click="deleteAssistant" class="ml-2">
                删除
              </n-button>
            </n-space>
          </n-form>

          <div class="mt-3" v-if="userTools.length">
            <n-h3>工具</n-h3>
            <div class="flex justify-between items-center">
              <div>工具 1</div>
              <div>
                <n-switch />
              </div>
            </div>
          </div>
        </div>

        <n-divider />
        <div>
          <div class="flex justify-between align-middle items-center">
            <n-h3>应用对接（原助理共享）</n-h3>
            <n-popconfirm @positive-click="createAssistantShare">
              <template #trigger>
                <n-button tertiary> 新建对接 </n-button>
              </template>
              <div>
                API Key 默认是没有请求限制的。为了防止 API Key
                滥用，对外发布时，我们建议您包装一个 UI 界面（比如使用 PHP
                等做一个请求限制），来防止 API Key 滥用。
                <br />
                当然，如果您在自己的私有应用中使用，可以忽略此建议。
              </div>
            </n-popconfirm>
          </div>

          <n-list hoverable clickable v-if="assistantShares.length">
            <n-list-item v-for="c in assistantShares" :key="c.id">
              <n-thing>
                <div class="flex justify-between items-center">
                  <div>
                    {{ c.token }}
                  </div>
                  <div>
                    <n-popconfirm
                      @positive-click="deleteAssistantShare(c.id ?? 0)"
                    >
                      <template #trigger>
                        <n-button quaternary circle type="warning">
                          <template #icon>
                            <n-icon size="16" class="cursor-pointer">
                              <TrashBinOutline />
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                      <div>删除后，应用将无法访问此助理。</div>
                    </n-popconfirm>
                  </div>
                </div>
              </n-thing>
            </n-list-item>
          </n-list>
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-drawer placement="left" v-model:show="showCreateDialog" :width="600">
      <n-drawer-content closable title="新建助理">
        <div v-if="currentAssistant">
          <n-form>
            <n-form-item label="助理名称">
              <n-input
                v-model:value="currentAssistant.name"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item label="描述">
              <n-input
                v-model:value="currentAssistant.description"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-form-item label="提示词">
              <n-input
                type="textarea"
                v-model:value="currentAssistant.prompt"
                @keydown.enter.prevent
              />
            </n-form-item>

            <n-button type="primary" @click="createAssistant"> 新建 </n-button>
          </n-form>
        </div>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import { useDialog } from "naive-ui";
import { TrashBinOutline, SettingsOutline } from "@vicons/ionicons5";
import getApi from "@/plugins/api";
import { useChatStore } from "@/stores/chat";
import { ref } from "vue";
import {
  EntityAssistant,
  EntityAssistantShare,
  EntityAssistantTool,
  EntityLibrary,
  EntityTool,
} from "@/api";
import { useIsMobile } from "@/utils/composables";

const dialog = useDialog();
const chatStore = useChatStore();
const showSettingsDialog = ref(false);
const showCreateDialog = ref(false);
const currentAssistantTools: Ref<EntityAssistantTool[]> = ref([]);
const userTools: Ref<EntityTool[]> = ref([]);
const currentAssistantId = ref();
const currentAssistant: Ref<EntityAssistant> = ref({});
const assistants: Ref<EntityAssistant[]> = ref([]);
const librarySelects: any = ref([]);
const libraries: Ref<EntityLibrary[]> = ref([]);
const assistantShares: Ref<EntityAssistantShare[]> = ref([]);

const isMobile = useIsMobile();
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return 300;
  } else {
    return 600;
  }
});

async function getChats() {
  chatStore.chats = (await getApi().Chat.apiV1ChatsGet()).data.data;
}

const deleteAssistant = async () => {
  dialog.warning({
    title: "删除助理",
    content: "删除后，将不能恢复",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await getApi().Assistant.apiV1AssistantsIdDelete(
        currentAssistantId.value
      );
      await getAssistants();
      showSettingsDialog.value = false;
    },
  });
};

const showEditAssistant = async (id: number) => {
  showSettingsDialog.value = true;
  currentAssistantId.value = id;
  currentAssistant.value =
    (await getApi().Assistant.apiV1AssistantsIdGet(id)).data.data ?? {};
  await getAssistantsShares();

  getTools();
};

const editAssistant = async () => {
  await getApi().Assistant.apiV1AssistantsIdPut(
    currentAssistantId.value,
    currentAssistant.value
  );
  await getAssistants();
  await getAssistantsShares();
};

const getTools = async () => {
  currentAssistantTools.value =
    (
      await getApi().Assistant.apiV1AssistantsIdToolsGet(
        currentAssistantId.value
      )
    ).data.data ?? [];

  userTools.value = (await getApi().Tool.apiV1ToolsGet()).data.data ?? [];
};

const createAssistant = async () => {
  await getApi().Assistant.apiV1AssistantsPost({
    name: currentAssistant.value.name ?? "",
    prompt: currentAssistant.value.prompt ?? "",
    description:
      currentAssistant.value.description ?? currentAssistant.value.name ?? "",
  });
  await getAssistants();
  showCreateDialog.value = false;
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

const getAssistantsShares = async () => {
  assistantShares.value =
    (
      await getApi().Assistant.apiV1AssistantsIdSharesGet(
        currentAssistantId.value
      )
    ).data.data ?? [];
};

const createAssistantShare = async () => {
  await getApi().Assistant.apiV1AssistantsIdSharesPost(
    currentAssistantId.value
  );
  await getAssistantsShares();
};

const deleteAssistantShare = async (id: number) => {
  await getApi().Assistant.apiV1AssistantsIdSharesShareIdDelete(
    currentAssistantId.value,
    id
  );
  await getAssistantsShares();
};

getChats();
getLibraries();
getAssistants();
</script>
