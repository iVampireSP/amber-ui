import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueRouter from "unplugin-vue-router/vite";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
// import { resolve } from "path";
// const rootPath = new URL(".", import.meta.url).pathname;

import { fileURLToPath, URL } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern", "legacy"
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  plugins: [
    VueRouter({
      dts: "src/typed-router.d.ts",
      routesFolder: [
        {
          src: "src/pages",
          path: "",
          // override globals
          exclude: (excluded) => excluded,
          filePatterns: (filePatterns) => filePatterns,
          extensions: (extensions) => extensions,
        },
      ],
    }),
    vue(),
    Layouts(),
    AutoImport({
      imports: [
        "vue",
        {
          "vue-router/auto": ["useRoute", "useRouter"],
        },
      ],
      dts: "src/auto-imports.d.ts",
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      dts: "src/components.d.ts",
    }),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
});
