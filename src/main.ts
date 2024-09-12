const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

import "./style.css";
import "animate.css";
import { registerPlugins } from "./plugins";
import router from "./router";


import App from "./App.vue";
import { createApp } from "vue";

const app = createApp(App);


registerPlugins(app);
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
