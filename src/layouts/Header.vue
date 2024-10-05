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
              <LeftSettings v-if="userStore.logined"></LeftSettings>
              <div v-else>要使用 Amberlet，请先登录。</div>
            </n-drawer-content>
          </n-drawer>
          <div
            @click="showDrawer = true"
            class="cursor-pointer ml-3 flex justify-center items-center"
            ref="leftMenu"
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
            <div
              v-if="!chatStore.currentChat?.id && !chatStore.currentChat?.name"
            >
              <img
                :src="leaflowpng"
                class="w-8 cursor-pointer block select-none"
                ref="centerLogo"
                @click="toggleHomeChat"
              />
            </div>

            <div v-else-if="chatStore.toolName != ''">
              <n-gradient-text type="info">
                正在执行 {{ chatStore.toolName }}
              </n-gradient-text>
            </div>
            <div v-else>
              <span>{{ chatStore.currentChat?.name }}</span>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item class="flex items-center justify-end mr-1.5">
          <!-- 右侧 -->

          <div v-if="userStore.logined" class="flex items-center">
            <!-- 新对话 -->
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon class="text-2xl mr-4 cursor-pointer" @click="newChat">
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

            <!-- 社区 -->
            <n-popover
              :placement="userPlacement"
              class="w-full"
              trigger="click"
              style="padding: 0"
              v-if="!isMobile"
            >
              <template #trigger>
                <n-icon class="text-2xl mr-4 cursor-pointer">
                  <PeopleCircleOutline />
                </n-icon>
              </template>
              <n-list hoverable clickabl class="select-none cursor-pointer">
                <template #header>
                  <div>
                    <span class="text-xl">社区</span>
                  </div>
                </template>
                <n-list-item>
                  <n-a target="_blank" :href="config.forum_url">社区主页</n-a>
                </n-list-item>
                <n-list-item>
                  <n-a target="_blank" :href="config.forum_url + '/t/assistant'"
                    >助理预设</n-a
                  >
                </n-list-item>

                <n-list-item>
                  <n-a target="_blank" :href="config.forum_url + '/t/tools'"
                    >工具分享</n-a
                  >
                </n-list-item>
                <n-list-item>
                  <n-a target="_blank" :href="config.forum_url + '/t/prompts'"
                    >助理提示词</n-a
                  >
                </n-list-item>
              </n-list>
            </n-popover>

            <!-- Bug 反馈 -->
            <n-popover
              :placement="userPlacement"
              class="w-full"
              trigger="click"
              style="padding: 0"
              v-if="!isMobile"
            >
              <template #trigger>
                <n-icon class="text-2xl mr-4 cursor-pointer">
                  <BugOutline />
                </n-icon>
              </template>
              <n-image :src="groupPng" width="250" height="500" />
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
          </div>

          <div v-else class="mr-2">
            <n-button @click="gotoLogin" strong secondary type="primary">
              登录
            </n-button>
          </div>
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
  BugOutline,
  PeopleCircleOutline,
  // TrashOutline,
} from "@vicons/ionicons5";
import router from "@/router";
// import { useChatStore } from "@/stores/chat";
// import getApi from "@/plugins/api";
import leaflowpng from "@/assets/images/leaflow.png";
import { useChatStore } from "@/stores/chat";
import groupPng from "@/assets/images/group.png";
import config from "@/config/config";
import { useAppStore } from "@/stores/app";

const userStore = useUserStore();
const appStore = useAppStore();
const chatStore = useChatStore();
const isMobile = useIsMobile();
const showDrawer = ref(false);
const width = computed(() => {
  if (isMobile.value) {
    return window.innerWidth;
  } else {
    return window.innerWidth * 0.4;
  }
});

const userPlacement = ref("bottom");
if (isMobile.value) {
  userPlacement.value = "bottom";
}

// const clearChatHistory = async () => {
//   await getApi().ChatMessage.apiV1ChatsIdClearPost(chatStore.currentChatId);
// };

const toggleHomeChat = () => {
  if (router.currentRoute.value.name == "/home/") {
    router.push("/");
  } else {
    router.push("/home");
  }
};

const newChat = () => {
  router.push("/");
};

const gotoLogin = () => {
  router.push("/auth/login");
};

const leftMenu = ref();
const centerLogo = ref();

const setCirclePosition = () => {
  if (isMobile.value) {
    // 获取 leftMenu 的位置
    const leftMenuRect = leftMenu.value.getBoundingClientRect();

    // 计算元素的正中心
    const centerX = leftMenuRect.x + leftMenuRect.width / 2;
    const centerY = leftMenuRect.y + leftMenuRect.height / 2;

    appStore.headerCenterLogoPosition.x = centerX;
    appStore.headerCenterLogoPosition.y = centerY;
  } else {
    // 获取 centerLogo 的位置
    const centerLogoRect = centerLogo.value.getBoundingClientRect();

    // 计算元素的正中心
    const centerX = centerLogoRect.x + centerLogoRect.width / 2;
    const centerY = centerLogoRect.y + centerLogoRect.height / 2;
    appStore.headerCenterLogoPosition.x = centerX;
    appStore.headerCenterLogoPosition.y = centerY;
  }
};

onMounted(() => {
  setCirclePosition();
});

window.addEventListener("resize", setCirclePosition);

onUnmounted(() => {
  window.removeEventListener("resize", setCirclePosition);
});
</script>
