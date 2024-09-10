// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  persist: false,
  state: () => ({
    navigation_drawer: false,
    navigation_items: [
      {
        icon: "mdi-home",
        text: "主页",
        to: "/",
      },
      {
        icon: "mdi-assistant",
        text: "助理",
        to: "/assistants",
      },
      {
        icon: "mdi-tools",
        text: "工具",
        to: "/tools",
      },
      {
        icon: "mdi-key",
        text: "令牌",
        to: "/tokens",
      },
    ],
  }),
});
