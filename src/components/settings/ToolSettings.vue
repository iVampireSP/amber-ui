<template>
  <div class="text-center" v-if="toolStore.tools">
    <n-icon class="text-7xl">
      <HammerOutline />
    </n-icon>
    <p>工具可以让助理获得调用外部函数，以达到意想不到的效果。</p>
    <div class="mt-3">
      <n-button>创建</n-button>
    </div>
  </div>
  <div v-else>
    <div class="mb-3">
      <n-button tertiary @click="showCreateDialog = true"> 新建工具 </n-button>
    </div>
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
              type="textarea"
              v-model:value="currentTool.discovery_url"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-button type="primary" @click="createTool"> 新建 </n-button>
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
import { HammerOutline } from "@vicons/ionicons5";

const toolStore = useToolStore();
const showCreateDialog = ref(false);
const currentToolId = ref();
const currentTool: Ref<EntityTool> = ref({});
const createToolRequest: Ref<SchemaToolCreateRequest> = ref({
  description: "",
  name: "",
  url: "",
});

const isMobile = useIsMobile();
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return 300;
  } else {
    return 600;
  }
});

const getTools = async () => {
  toolStore.tools = (await getApi().Tool.apiV1ToolsGet()).data.data ?? [];
};

const createTool = async () => {
  await getApi().Tool.apiV1ToolsPost(createToolRequest.value);
  getTools();
  showCreateDialog.value = false;
};

onMounted(() => {
  getTools();
});
</script>
