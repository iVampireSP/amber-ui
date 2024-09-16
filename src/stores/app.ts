// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  persist: false,
  state: () => ({
    updating: false,
    contentScrollHeight: 0,
    contentScrollPosition: 0,
    contentScrollOnBottom: false,
  }),
});
