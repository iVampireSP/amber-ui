<template>
  <div class="text-center" v-if="libraryStore.libraries?.length === 0">
    <n-icon class="text-7xl">
      <DocumentOutline />
    </n-icon>
    <p>Amber 可以索引您的文档中的内容</p>
    <div class="mt-3 mb-2">
      <n-button @click="showCreateLibraryDialog = true">创建</n-button>
    </div>
  </div>

  <div v-else>
    <div class="mb-3">
      <n-button tertiary @click="showCreateLibraryDialog = true">
        新建资料库
      </n-button>
    </div>
    <!-- 资料库列表 -->
    <n-list hoverable clickable>
      <n-list-item
        v-for="c in libraryStore.libraries"
        :key="c.id"
        @click.stop="showEditDialog(c)"
      >
        <n-thing>
          <div class="flex justify-between items-center">
            <div class="truncate block">
              {{ c.name }}
            </div>
            <div>
              <n-button
                quaternary
                circle
                type="info"
                @click.stop="showEditDialog(c)"
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

  <!-- 创建 -->
  <n-drawer
    placement="left"
    v-model:show="showCreateLibraryDialog"
    :width="drawerWidth"
  >
    <n-drawer-content closable title="创建资料库">
      <div v-if="currentLibrary">
        <n-form>
          <n-form-item label="资料库名称">
            <n-input
              v-model:value="createLibrary.name"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="描述资料库">
            <n-input
              v-model:value="createLibrary.description"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-button type="primary" @click="newLibrary"> 创建 </n-button>
        </n-form>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!-- 填写文档 -->
  <n-drawer
    placement="left"
    v-model:show="showCreateDocumentDialog"
    :width="drawerWidth"
  >
    <n-drawer-content closable title="新建文档">
      <div v-if="currentLibrary">
        <n-form>
          <n-form-item label="文档名称">
            <n-input
              v-model:value="createDocument.name"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="文档内容">
            <n-input
              type="textarea"
              v-model:value="createDocument.content"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-button type="primary" @click="newDocument"> 创建 </n-button>
        </n-form>
      </div>
    </n-drawer-content>
  </n-drawer>

  <!-- 编辑 -->
  <n-drawer
    placement="left"
    v-model:show="showEditLibraryDialog"
    :width="drawerWidth"
  >
    <n-drawer-content closable title="编辑资料库">
      <div v-if="currentLibrary">
        <n-form>
          <n-form-item label="资料库名称">
            <n-input
              v-model:value="currentLibrary.name"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="描述资料库">
            <n-input
              v-model:value="currentLibrary.description"
              @keydown.enter.prevent
            />
          </n-form-item>

          <n-form-item label="要设置为默认吗">
            <n-switch v-model:value="currentLibrary.default" />
          </n-form-item>

          <n-space>
            <n-button type="primary" @click="updateLibrary"> 更新 </n-button>

            <n-popconfirm @positive-click="remove(currentLibrary.id ?? 0)">
              <template #trigger>
                <n-button class="ml-10" type="warning"> 删除 </n-button>
              </template>
              删除后，将无法恢复
            </n-popconfirm>
          </n-space>
        </n-form>
      </div>
      <n-divider />

      <div>
        <div class="mt-3 mb-2">
          <n-button @click="showCreateDocumentDialog = true">上传文档</n-button>
        </div>
      </div>
      <!-- 文档列表 -->
      <div>
        <n-list hoverable v-if="documents.length">
          <n-list-item v-for="c in documents" :key="c.id">
            <n-thing>
              <div class="flex justify-between items-center">
                <div>
                  {{ c.name }}
                </div>
                <div>
                  <n-icon size="16" v-if="c.chunked">
                    <Checkmark />
                  </n-icon>
                  <n-icon  v-else size="16" class="cursor-pointer">
                    <Reload />
                  </n-icon>
                  <n-popconfirm @positive-click="deleteDocument(c.id ?? 0)">
                    <template #trigger>
                      <n-button quaternary circle type="warning">
                        <template #icon>
                          <n-icon size="16" class="cursor-pointer">
                            <TrashBinOutline />
                          </n-icon>
                        </template>
                      </n-button>
                    </template>
                    <div>删除后，文档将无法被检索</div>
                  </n-popconfirm>
                </div>
              </div>
            </n-thing>
          </n-list-item>
        </n-list>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import {
  EntityDocument,
  EntityLibrary,
  SchemaDocumentCreateRequest,
} from "@/api";
import getApi from "@/plugins/api";
import { useLibraryStore } from "@/stores/libraries";
import { useIsMobile } from "@/utils/composables";
import {
  TrashBinOutline,
  SettingsOutline,
  DocumentOutline,
  Reload,
  Checkmark
} from "@vicons/ionicons5";
import { AxiosError } from "axios";
import { useMessage } from "naive-ui";

const libraryStore = useLibraryStore();
const showCreateLibraryDialog = ref(false);
const showEditLibraryDialog = ref(false);
const showCreateDocumentDialog = ref(false);
const currentLibrary: Ref<EntityLibrary> = ref({});
const createLibrary: Ref<EntityLibrary> = ref({});
const isMobile = useIsMobile();
const message = useMessage();
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return window.innerWidth;
  } else {
    return window.innerWidth * 0.6;
  }
});
const createDocument: Ref<SchemaDocumentCreateRequest> = ref({
  name: "",
  content: "",
});
const documents: Ref<EntityDocument[]> = ref([]);

const showEditDialog = async (library: EntityLibrary) => {
  currentLibrary.value = library;
  showEditLibraryDialog.value = true;

  getDocuments(library.id ?? 0);
};

const getDocuments = async (libraryId: number) => {
  await getApi()
    .Library.apiV1LibrariesIdDocumentsGet(libraryId)
    .then((r) => {
      documents.value = r.data.data ?? [];
    });
};

const updateLibrary = async () => {
  if (currentLibrary.value.id) {
    await getApi().Library.apiV1LibrariesIdPut(currentLibrary.value.id, {
      name: currentLibrary.value.name ?? "",
      description: currentLibrary.value.description ?? "",
      default: currentLibrary.value.default ?? false,
    });
  }
};

const newLibrary = async () => {
  if (createLibrary.value.name) {
    await getApi()
      .Library.apiV1LibrariesPost({
        name: createLibrary.value.name,
        description: createLibrary.value.description,
      })
      .then((r) => {
        showCreateLibraryDialog.value = false;
      })
      .catch((e: AxiosError) => {
        // @ts-ignore ...
        message.error(e.response?.data.message ?? "创建失败");
      })
      .finally(() => {
        libraryStore.updateLibraries();
      });
  }
};

const remove = async (id: number) => {
  await getApi().Library.apiV1LibrariesIdDelete(id);
  libraryStore.updateLibraries();
};

const newDocument = async () => {
  if (currentLibrary.value.id) {
    await getApi().Library.apiV1LibrariesIdDocumentsPost(
      currentLibrary.value.id,
      createDocument.value
    );

    getDocuments(currentLibrary.value.id);
  }
};

const deleteDocument = async (documentId: number) => {
  await getApi().Library.apiV1LibrariesIdDocumentsDocumentIdDelete(
    documentId,
    currentLibrary.value.id ?? 0
  );

  getDocuments(currentLibrary.value.id ?? 0);
};

onMounted(() => {
  libraryStore.updateLibraries();
});
</script>
