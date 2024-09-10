// import {
//   AssistantApi,
//   ChatApi,
//   ChatMessageApi,
//   ChatPublicApi,
//   Configuration,
//   PingApi,
//   ToolApi,
// } from "@/api";
// import config from "@/config/config";
// import { useUserStore } from "@/stores/user";
//
// const userStore = useUserStore();
//
// const conf = new Configuration();
//
// conf.basePath = config.backend;
// conf.apiKey = () => {
//   return "Bearer " + userStore.id_token;
// };

// userStore.$subscribe((mutation, state) => {
//   console.log(mutation);
//   conf.apiKey = "Bearer " + state.id_token;
// });

// const api = {
//   Chat: new ChatApi(conf),
//   Assistant: new AssistantApi(conf),
//   Ping: new PingApi(conf),
//   Tool: new ToolApi(conf),
//   ChatMessage: new ChatMessageApi(conf),
//   ChatPublic: new ChatPublicApi(conf),
// };
//
// export { api, conf };
