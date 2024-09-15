import { defineStore } from "pinia";
import { EntityChat } from "../api";

export const useChatStore = defineStore("chats", {
  persist: false,
  state: () => ({
    currentChat: <EntityChat | undefined> {},
    currentAssistantId: 0,
    chats: <EntityChat[] | undefined>[],
  }),
});
