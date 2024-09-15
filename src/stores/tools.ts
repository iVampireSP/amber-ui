// Utilities
import { defineStore } from "pinia";
import { EntityTool } from "../api";

export const useToolStore = defineStore("tools", {
  persist: false,
  state: () => ({
    tools: <EntityTool[]> [],
  }),
});
