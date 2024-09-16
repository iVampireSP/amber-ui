<template>
  <div class="text-center" v-if="!memories.length">
    <n-icon class="text-7xl">
      <GiftSharp />
    </n-icon>
    <n-p>Amber 会根据您的对话更加了解你</n-p>
    <!-- <div class="mt-3 mb-2">
      <n-button>创建</n-button>
    </div> -->
  </div>
  <div v-else>
    <div class="mb-3">
      <n-popconfirm @positive-click="purgeMemory">
        <template #trigger>
          <n-button tertiary> 清除记忆 </n-button>
        </template>
        清除后, 助理将不会记得你的喜好
      </n-popconfirm>
    </div>
    <n-list hoverable clickable>
      <n-list-item v-for="c in memories" :key="c.id">
        <n-thing>
          <div class="flex justify-between items-center">
            <div>
              {{ c.content }}
            </div>
            <div>
              <n-popconfirm @positive-click="deleteMemory(c)">
                <template #trigger>
                  <n-button quaternary circle type="info">
                    <template #icon>
                      <n-icon size="16" class="cursor-pointer">
                        <TrashBinOutline />
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                删除后, 助理将不再记得这条记忆
              </n-popconfirm>
            </div>
          </div>
        </n-thing>
      </n-list-item>
    </n-list>
  </div>
</template>

<script lang="ts" setup>
import { EntityMemory } from "@/api";
import getApi from "@/plugins/api";
import { GiftSharp } from "@vicons/ionicons5";
import { TrashBinOutline } from "@vicons/ionicons5";

const memories: Ref<EntityMemory[]> = ref([]);

const getMemories = async () => {
  memories.value = (await getApi().Memory.apiV1MemoriesGet()).data.data ?? [];
};

const deleteMemory = async (memory: EntityMemory) => {
  await getApi().Memory.apiV1MemoriesIdDelete(memory.id ?? 0);
  getMemories();
};

const purgeMemory = async () => {
  await getApi().Memory.apiV1MemoriesPurgePost();
  getMemories();
};

onMounted(() => {
  getMemories();
});
</script>
