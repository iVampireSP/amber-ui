<template>
  <div class="text-center" v-if="!toolStore.tools.length">
    <n-icon class="text-7xl">
      <HammerOutline />
    </n-icon>
    <p>工具可以让助理获得调用外部函数，以达到意想不到的效果。</p>
    <div class="mt-3 mb-2">
      <n-button @click="showCreateDialog = true">创建</n-button>
    </div>
  </div>
  <div v-else>
    <div class="mb-3">
      <n-button tertiary @click="showCreateDialog = true"> 新建工具 </n-button>
    </div>
    <n-list hoverable clickable>
      <n-list-item v-for="c in toolStore.tools" :key="c.id">
        <n-thing>
          <div class="flex justify-between items-center">
            <div class="font-semibold truncate block">
              {{ c.name }}
            </div>
            <div>
              <n-popconfirm @positive-click="remove(c.id ?? 0)">
                <template #trigger>
                  <n-button quaternary circle type="info">
                    <template #icon>
                      <n-icon size="16" class="cursor-pointer">
                        <TrashBinOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                删除后，将无法恢复
              </n-popconfirm>

              <n-button
                quaternary
                circle
                type="info"
                @click.stop="update(c.id ?? 0)"
              >
                <template #icon>
                  <n-icon size="16" class="cursor-pointer">
                    <Refresh />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
  <div>
    <n-drawer
      placement="left"
      v-model:show="showCreateDialog"
      :width="drawerWidth"
    >
      <n-drawer-content closable title="新建工具">
        <n-form>
          <n-form-item label="名称">
            <n-input v-model:value="currentTool.name" @keydown.enter.prevent />
          </n-form-item>

          <n-form-item label="描述">
            <n-input
              v-model:value="currentTool.description"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="发现地址">
            <n-input
              v-model:value="currentTool.discovery_url"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="认证密钥">
            <n-input
              v-model:value="currentTool.api_key"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-button type="primary" @click="create"> 新建 </n-button>
        </n-form>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script lang="ts" setup>
import { EntityTool, SchemaToolCreateRequest } from "@/api";
import getApi from "@/plugins/api";
import { useToolStore } from "@/stores/tools";
import { useIsMobile } from "@/utils/composables";
import { Refresh, HammerOutline, TrashBinOutline } from "@vicons/ionicons5";
import { AxiosError } from "axios";
import { useDialog } from "naive-ui";

const toolStore = useToolStore();
const showCreateDialog = ref(false);
const dialog = useDialog();
const currentTool: Ref<EntityTool> = ref({});

const isMobile = useIsMobile();
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return window.innerWidth;
  } else {
    return window.innerWidth * 0.6;
  }
});

/**
 * 获取所有工具
 */
const getAll = async () => {
  toolStore.tools = (await getApi().Tool.apiV1ToolsGet()).data.data ?? [];
};

const create = async () => {
  await getApi()
    .Tool.apiV1ToolsPost(currentTool.value as SchemaToolCreateRequest)
    .catch((e: AxiosError) => {
      dialog.error({
        title: "创建失败",
        // @ts-ignore 忽略
        content: e.response?.data?.error,
        positiveText: "好",
      });
    });
  getAll();

  showCreateDialog.value = false;
};

const update = async (id: number) => {
  getApi()
    .Tool.apiV1ToolsIdUpdatePost(id)
    .catch((e: AxiosError) => {
      if (e.response?.status === 404) {
        dialog.error({
          title: "工具不存在",
          content: "工具不存在",
          positiveText: "好",
        });
        return;
      }
      dialog.error({
        title: "无法更新",
        // @ts-ignore 忽略
        content: e.response?.data?.error,
        positiveText: "好",
      });
    });
};

const remove = async (id: number) => {
  await getApi()
    .Tool.apiV1ToolsIdDelete(id)
    .catch((e: AxiosError) => {
      if (e.response?.status === 404) {
        dialog.error({
          title: "工具不存在",
          content: "工具不存在",
          positiveText: "好",
        });
        return;
      }
      dialog.error({
        title: "删除失败",
        // @ts-ignore 忽略
        content: e.response?.data?.error,
        positiveText: "好",
      });
    });
  getAll();
};

onMounted(() => {
  getAll();
});
</script>
