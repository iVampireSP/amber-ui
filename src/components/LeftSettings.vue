<template>
  <n-tabs type="segment" animated class="select-none">
    <n-tab-pane name="chap1" tab="对话">
      <n-list hoverable clickable v-if="chatStore.chats?.length">
        <n-list-item
          v-for="c in chatStore.chats"
          :key="c.id"
          :class="
            c.id === chatStore.currentChatId
              ? ' bg-gray-100 dark:bg-gray-700'
              : ''
          "
          @click="viewChat(c.id ?? 0)"
        >
          <n-thing>
            <div class="flex justify-between items-center">
              <div>
                {{ c.name }}
              </div>
              <n-button
                quaternary
                circle
                type="warning"
                @click.stop="deleteChat(c.id ?? 0)"
              >
                <template #icon>
                  <n-icon size="16" class="cursor-pointer">
                    <TrashBinOutline />
                  </n-icon>
                </template>
              </n-button>
            </div>
          </n-thing>
        </n-list-item>
      </n-list>
      <div v-else>
        <n-result
          status="404"
          title="你还没有对话"
          description="不如现在就开始？"
        >
        </n-result>
      </div>
    </n-tab-pane>
    <n-tab-pane name="chap2" tab="助理">
      <Assistants />
    </n-tab-pane>
    <n-tab-pane name="chap3" tab="工具">
      “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的
      Amazon 服务，还是救公寓的火。<br /><br />
      我的脑海中忽然出现了 Amazon
      著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
      debug 这个线上问题。
    </n-tab-pane>
    <n-tab-pane name="documents" tab="文档">
      “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的
      Amazon 服务，还是救公寓的火。<br /><br />
      我的脑海中忽然出现了 Amazon
      著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
      debug 这个线上问题。
    </n-tab-pane>
    <n-tab-pane name="chap4" tab="记忆">
      “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的
      Amazon 服务，还是救公寓的火。<br /><br />
      我的脑海中忽然出现了 Amazon
      著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
      debug 这个线上问题。
    </n-tab-pane>
    <n-tab-pane name="chap5" tab="账户">
      “威尔！着火了！快来帮忙！”我听到女朋友大喊。现在一个难题在我面前——是恢复一个重要的
      Amazon 服务，还是救公寓的火。<br /><br />
      我的脑海中忽然出现了 Amazon
      著名的领导力准则”客户至上“，有很多的客户还依赖我们的服务，我不能让他们失望！所以着火也不管了，女朋友喊我也无所谓，我开始
      debug 这个线上问题。
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NMenu, useDialog } from "naive-ui";
import { useRoute } from "vue-router";
import { leftMenuOptions } from "../plugins/menus/left";
import { ChatboxOutline, TrashBinOutline } from "@vicons/ionicons5";
import getApi from "../plugins/api";
import { useChatStore } from "../stores/chat";
import router from "@/router";

const dialog = useDialog();
const route = useRoute();
// @ts-ignore
const chatId = route.params.id as number;

const currentRoute: any = computed(() => route.name);

const collapsed = ref(false);

const chatStore = useChatStore();

async function getChats() {
  chatStore.chats = (await getApi().Chat.apiV1ChatsGet()).data.data;
}

const viewChat = (chatId: number) => {
  router.push("/chat/" + chatId);
};

const deleteChat = async (chatId: number) => {
  dialog.warning({
    title: "删除对话",
    content: "删除后，将不能恢复",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: async () => {
      await getApi().Chat.apiV1ChatsIdDelete(chatId);
      await getChats();
    },
  });
};

getChats();
</script>
