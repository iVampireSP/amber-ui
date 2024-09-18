import { defineStore } from "pinia";
import { EntityLibrary } from "../api";
import getApi from "@/plugins/api";

export const useLibraryStore = defineStore("libraries", {
  persist: false,
  state: () => ({
    libraries: <EntityLibrary[] | undefined>[],
  }),
  actions: {
    updateLibraries() {
      getApi()
        .Library.apiV1LibrariesGet()
        .then((r) => {
          this.libraries = r.data.data ?? [];
        });
    },
  },
});
