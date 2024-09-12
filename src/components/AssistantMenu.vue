<template>
  <div v-show="!loaded">正在载入</div>
  <n-list hoverable clickable v-show="loaded" class="select-none">
    <template #header>
      <div>
        <span class="text-xl">切换助理</span>
      </div>
    </template>
    <n-list-item v-for="a in assistantStore.assistants" :key="a.id">
      <n-thing>
        {{ a.name }}
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup lang="ts">
import { useUserStore } from "../stores/user";
import { updateAll } from "../plugins/update/update";
import { useAssistantStore } from "../stores/assistants";

const loaded = ref(false);
const userStore = useUserStore();
const assistantStore = useAssistantStore();

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

update();
</script>
