<template>
  <div class="p-4 pt-0">
    <div>
      <n-grid x-gap="14" cols="1 s:2" responsive="screen">
        <n-gi class="mt-3 from-green-200 to-green-300 rounded-lg p-4">
          <h3 class="text-2xl">Leaflow Amber</h3>
          <p class="mt-3">
            Amber 是一个全新的智能体平台，是我们 LeaFlow
            生态里面重要的一环，也是我们自脱离莱云之后全新的尝试。 Leaflow Amber
            目前仍然处于测试阶段， 不代表最终品质。
          </p>

          <div
            v-if="
              siteUsage.month_tokens &&
              siteUsage.month_tool_calls &&
              siteUsage.month_tokens > 0 &&
              siteUsage.month_tool_calls
            "
          >
            <p class="mt-5">处理的 Token 和工具调用的情况</p>
            <n-statistic tabular-nums>
              <n-number-animation
                ref="numberAnimationInstRef"
                :from="0"
                :to="siteUsage.month_tokens"
              />
              <template #suffix> Tokens </template>
            </n-statistic>
            <n-statistic tabular-nums>
              <n-number-animation
                ref="numberAnimationInstRef"
                :from="0"
                :to="siteUsage.month_tool_calls"
              />
              <template #suffix> Calls </template>
            </n-statistic>
          </div>
        </n-gi>
        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">💬 对话优化引擎</h3>

          <p class="mt-3">
            Amber
            的对话优化引擎无与伦比。我们独特的对话功能支持多个助理并行工作，您可以通过输入
            @
            或点击右上角的“切换助理”选项，轻松指定下一个回复的助理。所有助理共享一个上下文，彼此了解每个操作，为您提供流畅一致的对话体验。与一些只能处理单一对话的竞品相比，Amber
            的多助理协作系统显得更为智能和高效。在重大决策型的使用场景中，你可以通过
            Amber 对话引擎去得到 N 个 Second Opinion。 Amber
            为聊天场景做了很多的优化，它将更能处理您日常生活中的问题。
          </p>
        </n-gi>
        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">📖 智能上下文</h3>

          <p class="mt-3">
            Amber
            拥有独特的智能上下文技术，能够根据对话场景自动调整上下文。这一过程对用户是透明的，您无需手动干预，系统会智能识别何时需要移除或添加上下文信息。这种灵活性不仅提升了对话的流畅性，还能显著降低
            Token 的消耗，节省从几千到几万不等的费用，帮助用户更高效地利用资源。
          </p>
          <p>
            需要注意的是，OpenAI
            兼容模式不支持智能上下文功能，因此在使用该模式时，您将无法享受到这一创新技术带来的便利。我们建议您在适用的情况下，充分利用
            Amber 的智能上下文，以优化您的对话体验和资源使用。
          </p>
        </n-gi>

        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">🛠️ 客制化</h3>

          <p class="mt-3">
            Amber 具备了目前主流 LLM
            对话平台都拥有的高自由度智能体自定义功能，用户可以自定义提示词，绑定工具，以完成复杂任务并优化工作流。例如，您可以设置助理在每天早上自动为您生成当天的工作清单，或者在您需要时快速调用数据分析工具。我们的助理不仅能执行简单的任务，还能实现多步骤的复杂操作，并与知识库无缝集成，说它是您高效工作的得力助手，绝不为过。
            💪
          </p>
        </n-gi>
        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">🧠 记忆</h3>

          <p class="mt-3">
            Amber
            通过采样您的对话内容生成记忆，这些记忆是碎片化的，但对话中共享。您可以随时清除所有记忆，确保数据的灵活管理。Amber
            会收集您的消息，并且根据消息推断您的喜好。记忆的内容您完全可以控制，甚至禁用助理的记忆。助理将会根据您的记忆来改变响应的结果，您喜欢什么，您直接在对话中说明即可（Amber
            会从第二条消息开始学习记忆） ❤️
          </p>
        </n-gi>
        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">🔗 API</h3>

          <p class="mt-3">
            我们提供强大的助理 API，支持兼容 OpenAI 格式的应用接入 Amber。通过
            Chat Completion API，您可以直接调用 Amber
            的工具、记忆以及知识库功能。例如，一个开发者可以轻松地将 Amber
            集成到他们的客服系统中，自动处理常见问题并提供高效的解决方案。相较于其他平台，我们的
            API 更具灵活性和扩展性，让您的应用赋予更多可能。不仅仅在 Amber
            系统的本身，您也可以通过我们 Leaflow 平台的 UserLand，解锁更多高阶
            API 玩法！ 🚀
          </p>
          <p class="mt-3">
            如果您要使用 Amber API，请查看此链接：<n-a
              target="_blank"
              href="https://amber-api.leaflow.cn/swagger/index.html"
              >Amber API</n-a
            >
          </p>
        </n-gi>
        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">🛠️ 工具集成</h3>

          <p class="mt-3">
            我们的工具功能拥有极大的扩展性，且工具系统拥有更多的对话控制功能，所以目前不兼容
            OpenAI
            新版本的格式。工具可以助您高效完成各类任务。例如，您可以将自己的应用或者
            Home Assistant 接入 Amber，随后在对话中控制它。Amber
            的记忆功能将会记住你的喜好（接入教程和详细文档将在近期提供）。 📈
          </p>
        </n-gi>
        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">📚 文档管理</h3>

          <p class="mt-3">
            文档管理是 Amber
            知识库的核心功能之一。对话中上传的文件将自动保存至知识库，您只需设置助理关联知识库，即可实现快速检索和使用。假设您是一位项目经理，您可以在对话中上传项目计划书，并在需要时快速检索相关内容。Amber
            在您发送消息时，将会自动搜索资料库。此外，我们正在开发桌面端软件，该软件可以根据您的需要同步文档至
            Amber，以便随时调用🗂️。 Amber
            不会长期保存您的文档的源文件，我们不建议您上传具有机密性的文档。
          </p>
        </n-gi>

        <n-gi class="mt-3 from-cyan-500 to-blue-500 rounded-lg p-4">
          <h3 class="text-2xl">👋 一起加入</h3>
          <p class="mt-3">
            我们提供了 WP Amber，此 WordPress 插件可以将 Amber
            放到你的博客中，让您的访客通过助理来总结并解释文章等。
          </p>
          <n-image :src="grouppng" width="150" height="300" />
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from "../router";
import { useUserStore } from "../stores/user";
import grouppng from "@/assets/images/group.png";
import { SchemaSiteUsageResponse } from "@/api";
import getApi from "@/plugins/api";

const userStore = useUserStore();
const siteUsage: Ref<SchemaSiteUsageResponse> = ref({});

const login = () => {
  router.push("/auth/login");
};

onMounted(async () => {
  const r = (await getApi().Usage.apiV1UsageGet()).data.data;
  if (r) {
    siteUsage.value = r;
  }
});
</script>
