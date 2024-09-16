// Utilities
import { defineStore } from "pinia";
import { EntityAssistant } from "../api";

export const useAssistantStore = defineStore("assistant", {
  persist: false,
  state: () => ({
    selectMenu: false,
    assistants: <EntityAssistant[] | undefined>[],
  }),
});
