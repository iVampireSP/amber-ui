import pinia from "../stores";
import naive from "naive-ui";

// Types
import type { App } from "vue";
// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";

export function registerPlugins(app: App) {
  app.use(naive).use(pinia);
}
