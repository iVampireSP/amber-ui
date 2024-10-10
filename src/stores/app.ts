// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  persist: false,
  state: () => ({
    headerHeight: 64,
    updating: false,
    contentScrollHeight: 0,
    contentScrollPosition: 0,
    contentScrollOnBottom: false,
    contentScrollable: false,
    headerCenterLogoPosition: {
      x: 0,
      y: 0,
    }
  }),
});
