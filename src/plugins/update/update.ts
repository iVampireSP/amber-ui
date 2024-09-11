import { useAssistantStore } from "../../stores/assistants";
import api from "../../plugins/api";
import { useUserStore } from "../../stores/user";

const updateAll = async () => {
  // 更新所有的数据
  const userStore = useUserStore();
  const assistantStore = useAssistantStore();

  const assistantList = await api().Assistant.apiV1AssistantsGet();
  assistantStore.assistants = assistantList.data.data;
};

export { updateAll };
