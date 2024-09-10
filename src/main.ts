const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

import "./style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import naive from "naive-ui";
// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";

import App from "./App.vue";
import router from "./plugins/router";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(naive);
app.use(router);

// @ts-ignore ...
if (process.env.NODE_ENV === "production") {
  setTimeout(() => {
    const appContainer = document.getElementById("app");
    if (appContainer) {
      appContainer.style.opacity = "0";
    }
    setTimeout(() => {
      const defaultLoader = document.getElementById("default-loader");
      // remove
      defaultLoader?.remove();
    }, 300);

    setTimeout(() => {
      app.mount("#app");
    }, 300);
    setTimeout(() => {
      appContainer!.style.opacity = "1";
    }, 300);
  }, 200);
} else {
  app.mount("#app");
}
