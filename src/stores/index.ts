// Utilities
import { createPinia, setActivePinia } from "pinia";

import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);

// console

// 设置当前活跃的 Pinia 实例
// setActivePinia(pinia);

export default pinia;
