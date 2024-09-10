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

app.mount("#app");
