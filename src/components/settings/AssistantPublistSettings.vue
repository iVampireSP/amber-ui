<template>
  <p>在做了在做了</p>
  <div v-if="assistants.length">
    <n-list hoverable clickable>
      <n-list-item v-for="c in assistants" :key="c.id">
        <n-thing>
          <div class="flex justify-between items-center">
            <div>
              {{ c.name }}
              <br />
              {{ c.description }}
            </div>
            <div>
              <n-button
                quaternary
                circle
                type="info"
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
      title="目前没有共享的助理"
      description="你可以在这里收藏别人发布的助理，并使用它。"
    >
      <n-button type="primary"> 在做了在做了 </n-button>
    </n-result>
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
  SchemaAssistantPublic,
} from "@/api";
import { useIsMobile } from "@/utils/composables";
const currentAssistantTools: Ref<EntityAssistantTool[]> = ref([]);

const currentAssistantId = ref();

const assistants: Ref<SchemaAssistantPublic[]> = ref([]);
const assistantApiKeys: Ref<EntityAssistantKey[]> = ref([]);

const isMobile = useIsMobile();
const drawerWidth = computed(() => {
  if (isMobile.value) {
    return window.innerWidth;
  } else {
    return window.innerWidth * 0.6;
  }
});

const getAssistants = async () => {
  getApi()
    .Assistant.apiV1AssistantsPublicGet(1)
    .then((r) => {
      assistants.value = r.data.data?.data ?? [];
    });
};


// const bindOrUnbind = async (id: number) => {
//   let binded = findTool(id);

//   if (binded) {
//     await getApi().Assistant.apiV1AssistantsIdToolsToolIdDelete(
//       currentAssistantId.value,
//       id
//     );
//   } else {
//     await getApi().Assistant.apiV1AssistantsIdToolsToolIdPost(
//       currentAssistantId.value,
//       id
//     );
//   }

// };

getAssistants();
</script>
