const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

import "./styles/style.css";
import "./styles/color.less";
import "animate.css";

import { createApp } from 'vue'
import App from './App.vue'

import naive from 'naive-ui'

import router from "./router";
import { registerPlugins } from "./plugins";

const app = createApp(App)

app.use(naive)

registerPlugins(app);

app.use(router);

if (process.env.NODE_ENV === "production") {
  setTimeout(() => {
    const appContainer = document.getElementById("app");
    if (appContainer) {
      appContainer.style.opacity = "0";
    }
    setTimeout(() => {
      const defaultLoader = document.getElementById("default-loader");
      defaultLoader?.remove();
    }, 300);

    setTimeout(() => {
      app.mount("#app");
    }, 300);
    setTimeout(() => {
      if (appContainer) {
        appContainer.style.opacity = "1";
      }
    }, 300);
  }, 200);
} else {
  app.mount("#app");
}
