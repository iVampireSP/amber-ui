<template>
  <n-layout class="select-none">
    <n-layout-header bordered class="layout-header header-height">
      <n-grid cols="3" class="header-height">
        <n-grid-item class="flex items-center justify-start mr-1.5">
          <!-- 左侧 -->
          <!-- <n-popover
            placement="bottom"
            trigger="click"
            style="padding: 0; width: 288px"
            v-if="isMobile"
          >
            <template #trigger>
              <n-icon size="20" style="margin-left: 12px">
                <menu-outline />
              </n-icon>
            </template>
            <Menu></Menu>
          </n-popover> -->

          <n-drawer
            v-model:show="showDrawer"
            resizable
            :default-width="width"
            placement="left"
            class="select-none"
          >
            <n-drawer-content
              title="Amberlet"
              closable
              :native-scrollbar="false"
            >
              <LeftSettings></LeftSettings>
            </n-drawer-content>
          </n-drawer>
          <div
            @click="showDrawer = true"
            class="cursor-pointer ml-3 flex justify-center items-center"
          >
            <n-icon size="24">
              <menu-outline />
            </n-icon>
            <span class="ml-1.5">
              <span v-if="!isMobile"> Leaflow </span>

              <span> 利飞 </span>
            </span>
          </div>

          <!-- 更新状态 -->
          <!-- <div v-show="appStore.updating">正在更新数据</div> -->
        </n-grid-item>

        <n-grid-item class="flex items-center justify-center select-none">
          <div v-show="!isMobile">
            <!-- 中间部分 -->
            <n-popover trigger="hover">
              <template #trigger>
                <img
                  :src="leaflowpng"
                  class="w-8 cursor-pointer block select-none"
                  @click="backToHome"
                />
              </template>
              <span> Leaflow 利飞 </span>
            </n-popover>
          </div>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <!-- 右侧 -->
          <!-- 新对话 -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon class="text-2xl mr-4 cursor-pointer" @click="backToHome">
                <AddOutline />
              </n-icon>
            </template>
            <span> 新对话 </span>
          </n-tooltip>

          <!-- 助理选择 -->
          <n-popover
            :placement="userPlacement"
            class="w-full"
            trigger="click"
            style="padding: 0"
          >
            <template #trigger>
              <n-icon class="text-2xl mr-4 cursor-pointer">
                <PersonOutline />
              </n-icon>
            </template>
            <AssistantMenu />
          </n-popover>
          <!-- 用户弹出 -->
          <n-popover
            :placement="userPlacement"
            class="w-full"
            trigger="click"
            style="padding: 0"
          >
            <template #trigger>
              <n-avatar
                round
                size="medium"
                :src="userStore.user.avatar"
                class="mr-2 cursor-pointer"
              />
            </template>
            <UserMenu class="select-none" />
          </n-popover>
        </n-grid-item>
      </n-grid>
    </n-layout-header>
  </n-layout>
</template>

<script setup lang="ts">
import UserMenu from "../components/UserMenu.vue";
import AssistantMenu from "../components/AssistantMenu.vue";
import { useUserStore } from "../stores/user";
import { useIsMobile } from "../utils/composables";
import {
  MenuOutline,
  PersonOutline,
  AddOutline,
  // TrashOutline,
} from "@vicons/ionicons5";
import router from "@/router";
// import { useChatStore } from "@/stores/chat";
// import getApi from "@/plugins/api";
import leaflowpng from "@/assets/images/leaflow.png";

const userStore = useUserStore();
const isMobile = useIsMobile();
const showDrawer = ref(false);
const width = computed(() => {
  if (isMobile.value) {
    return window.innerWidth;
  } else {
    return window.innerWidth * 0.5;
  }
})

const userPlacement = ref("bottom");
if (isMobile.value) {
  userPlacement.value = "bottom";
}

// const clearChatHistory = async () => {
//   await getApi().ChatMessage.apiV1ChatsIdClearPost(chatStore.currentChatId);
// };

const backToHome = () => {
  router.push("/");
};
</script>
