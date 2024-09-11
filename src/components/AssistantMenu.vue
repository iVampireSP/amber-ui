<template>
  <n-list hoverable clickable>
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
import { useRoute } from "vue-router";
import { useUserStore } from "../stores/user";
import { updateAll } from "../plugins/update/update";
import { useAssistantStore } from "../stores/assistants";

const route = useRoute();
const currentRoute: any = computed(() => route.name);
const collapsed = ref(false);
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
}

update();
</script>
