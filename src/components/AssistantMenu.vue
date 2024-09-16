<template>
  <div v-show="!loaded">正在载入</div>
  <n-list hoverable clickable v-show="loaded" class="select-none">
    <template #header>
      <div>
        <span class="text-xl">下条消息的助理</span>
      </div>
    </template>
    <n-list-item
      v-for="a in assistantStore.assistants"
      :key="a.id"
      @click="changeAssistant(a.id)"
    >
      <div class="flex justify-between items-center">
        <div>
          {{ a.name }}
        </div>
        <div v-show="a.id === chatStore.currentAssistantId" class="text-green">
          <n-text type="success">
            <n-icon><CheckmarkOutline /></n-icon>
          </n-text>
        </div>
      </div>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { updateAll } from "../plugins/update/update";
import { useAssistantStore } from "../stores/assistants";
import { useChatStore } from "@/stores/chat";
import { CheckmarkOutline } from "@vicons/ionicons5";

const loaded = ref(false);
const userStore = useUserStore();
const assistantStore = useAssistantStore();
const chatStore = useChatStore();

watch(
  () => userStore.logined,
  (newValue, oldValue) => {
    if (newValue) {
      update();
    }
  }
);
function update() {
  updateAll();
  loaded.value = true;
}

const changeAssistant = (id: number | undefined) => {
  if (id) {
    chatStore.currentAssistantId = id;
  }
};

update();
</script>
