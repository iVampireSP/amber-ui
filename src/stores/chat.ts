import { defineStore } from "pinia";
import { EntityChat } from "../api";

export const useChatStore = defineStore("chats", {
  persist: false,
  state: () => ({
    chats: <EntityChat[] | undefined>[],
  }),
});
