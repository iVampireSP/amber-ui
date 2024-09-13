import {
  AssistantApi,
  ChatApi,
  ChatMessageApi,
  ChatPublicApi,
  Configuration,
  LibrariesApi,
  PingApi,
  ToolApi,
} from "../api";
import config from "../config/config";

import { useUserStore } from "../stores/user";
import axios from "./axios";

// 定义 Api 类型
interface Api {
  Chat: ChatApi;
  Assistant: AssistantApi;
  Ping: PingApi;
  Tool: ToolApi;
  ChatMessage: ChatMessageApi;
  ChatPublic: ChatPublicApi;
  Library: LibrariesApi;
  conf: Configuration
}

let api: Api | null = null; // 使用联合类型来表示初始状态可能是 null

const getApi = () => {
  if (api) {
    return api;
  }

  const userStore = useUserStore();

  const conf = new Configuration();

  conf.basePath = config.backend;
  conf.apiKey = () => {
    return "Bearer " + userStore.id_token;
  };

  userStore.$subscribe((mutation, state) => {
    conf.apiKey = "Bearer " + state.id_token;
  });

  api = {
    Chat: new ChatApi(conf, undefined, axios),
    Assistant: new AssistantApi(conf, undefined, axios),
    Ping: new PingApi(conf, undefined, axios),
    Tool: new ToolApi(conf, undefined, axios),
    ChatMessage: new ChatMessageApi(conf, undefined, axios),
    ChatPublic: new ChatPublicApi(conf, undefined, axios),
    Library: new LibrariesApi(conf, undefined, axios),
    conf: conf
  };

  return api;
};

export default getApi;
