<template>
  <div v-if="assistants.length">
    <div class="mb-3">
      <n-button tertiary @click="showCreateDialog = true"> 新建助理 </n-button>
    </div>
    <n-list hoverable clickable>
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
  </div>
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
      <n-drawer-content closable title="编辑助理" :native-scrollbar="false">
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

            <n-form-item label="提示词（支持模板, 使用 {foo} 作为变量）">
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

            <n-form-item label="助理设置">
              <div>
                <div>
                  <n-switch
                    v-model:value="currentAssistant.disable_default_prompt"
                  >
                  </n-switch>
                  禁用默认提示词
                </div>

                <div>
                  <n-switch v-model:value="currentAssistant.disable_memory">
                  </n-switch>
                  禁用记忆
                </div>

                <div>
                  <n-switch
                    v-model:value="
                      currentAssistant.enable_memory_for_assistant_api
                    "
                    :disabled="currentAssistant.disable_memory"
                  >
                  </n-switch>
                  允许助理 API 读取记忆
                </div>
              </div>
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
            <div v-for="c in userTools" :key="c.id">
              <!-- 如果是第 2 或不是最后一个，则添加 hr -->
              <n-divider v-if="userTools.indexOf(c) !== 0" />
              <div class="flex justify-between items-center mt-3">
                <div>
                  {{ c.name }}
                  <div v-if="c.description">{{ c.description }}</div>
                </div>
                <div>
                  <n-switch
                    :value="findTool(c.id ?? 0)"
                    @click="bindOrUnbind(c.id ?? 0)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <n-divider v-if="!userTools.length" />
        <div v-else class="mt-10"></div>
        <div>
          <div class="flex justify-between align-middle items-center">
            <div>
              <n-h3 class="inline">助理 API</n-h3>
              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon size="16"><HelpCircleOutline /></n-icon>
                </template>
                <div>
                  <n-text
                    >你可以将应用通过 OpenAI 协议接入到 Amber，我们目前支持 Chat
                    Completion API。</n-text
                  >
                  <n-text>
                    我们的 API 端点是：{{ config.backend }}/openai-compatible/v1
                    。密钥为下方的 API Key。
                  </n-text>
                </div>
              </n-popover>
            </div>

            <n-popconfirm @positive-click="createAssistantKey">
              <template #trigger>
                <n-button tertiary> 新 API </n-button>
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

          <div class="mt-3">
            <n-list hoverable clickable v-if="assistantApiKeys.length">
              <n-list-item v-for="c in assistantApiKeys" :key="c.id">
                <n-thing>
                  <div class="flex justify-between items-center">
                    <div>
                      {{ c.secret }}
                    </div>
                    <div>
                      <n-popconfirm
                        @positive-click="deleteAssistantKey(c.id ?? 0)"
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
        </div>
      </n-drawer-content>
    </n-drawer>

    <n-drawer
      placement="left"
      v-model:show="showCreateDialog"
      :width="drawerWidth"
    >
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
import {
  TrashBinOutline,
  SettingsOutline,
  HelpCircleOutline,
} from "@vicons/ionicons5";
import getApi from "@/plugins/api";
import { useChatStore } from "@/stores/chat";
import { ref } from "vue";
import {
  EntityAssistant,
  EntityAssistantKey,
  EntityAssistantTool,
  EntityLibrary,
  EntityTool,
} from "@/api";
import { useIsMobile } from "@/utils/composables";
import { AxiosError } from "axios";
import config from "@/config/config";

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
const assistantApiKeys: Ref<EntityAssistantKey[]> = ref([]);

const isMobile = useIsMobile();
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return window.innerWidth;
  } else {
    return window.innerWidth * 0.6;
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
  await getAssistantsKeys();

  getTools();
};

const editAssistant = async () => {
  await getApi().Assistant.apiV1AssistantsIdPut(
    currentAssistantId.value,
    currentAssistant.value
  );
  await getAssistants();
  await getAssistantsKeys();
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
  await getApi()
    .Assistant.apiV1AssistantsPost({
      name: currentAssistant.value.name ?? "",
      prompt: currentAssistant.value.prompt ?? "",
      description:
        currentAssistant.value.description ?? currentAssistant.value.name ?? "",
    })
    .then(() => {
      showCreateDialog.value = false;
    })
    .catch((e: AxiosError) => {
      if (e.response?.status === 400) {
        dialog.error({
          title: "参数错误",
          // @ts-ignore 忽略
          content: e.response?.data?.error,
          positiveText: "好",
        });
        return;
      }
    });
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

const getAssistantsKeys = async () => {
  assistantApiKeys.value =
    (
      await getApi().Assistant.apiV1AssistantsIdKeysGet(
        currentAssistantId.value
      )
    ).data.data ?? [];
};

const createAssistantKey = async () => {
  await getApi().Assistant.apiV1AssistantsIdKeysPost(currentAssistantId.value);
  await getAssistantsKeys();
};

const deleteAssistantKey = async (id: number) => {
  await getApi().Assistant.apiV1AssistantsIdKeysKeyIdDelete(
    currentAssistantId.value,
    id
  );
  await getAssistantsKeys();
};

const findTool = (id: number) => {
  let binded = false;
  for (let i = 0; i < currentAssistantTools.value.length; i++) {
    if (currentAssistantTools.value[i].tool_id === id) {
      binded = true;
      break;
    }
  }

  return binded;
};

const bindOrUnbind = async (id: number) => {
  let binded = findTool(id);

  if (binded) {
    await getApi().Assistant.apiV1AssistantsIdToolsToolIdDelete(
      currentAssistantId.value,
      id
    );
  } else {
    await getApi().Assistant.apiV1AssistantsIdToolsToolIdPost(
      currentAssistantId.value,
      id
    );
  }

  getTools();
};

getChats();
getLibraries();
getAssistants();
</script>
