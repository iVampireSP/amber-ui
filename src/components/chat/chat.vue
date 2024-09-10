<template>
  <div
    class="relative flex flex-col h-[calc(100vh-var(--header-height)*1.9)]"
    style="--header-height: 48px"
  >
    <div class="flex-grow mt-3 mb-1 text-5xl">
      <n-gradient-text type="info" class="pr-3">
        你好，{{ userStore.user.name }}
      </n-gradient-text>
      <br />
      <div class="pr-3 mt-8 text-2xl">
        <n-text depth="3"> 有什么我可以帮您的吗？ </n-text>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 pb-5">
      <div
        ref="inputContainer"
        class="mx-auto w-full max-w-2xl outline-none input-text input-bg rounded-full flex pl-5 pr-5 bg-white shadow-lg items-center"
      >
        <div class="overflow-x-hidden h-full w-full flex items-center">
          <n-scrollbar>
            <div
              ref="inputText"
              contenteditable="true"
              class="input-text max-w-full outline-none"
              @input="updateInputHeight"
            >
              <p>content</p>
            </div>
          </n-scrollbar>
        </div>
        <div>
          <button>按钮</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from "naive-ui";
import { useUserStore } from "../../stores/user";
import { InputHTMLAttributes, onMounted, ref } from "vue";

const message = useMessage();
const userStore = useUserStore();

const inputMessage = ref("");
const inputContainer: any = ref(null);
const inputText: InputHTMLAttributes | null = ref(null);

function updateInputHeight() {
  if (!inputText?.value || !inputContainer.value) {
    return;
  }

  const input = inputText.value;
  const container = inputContainer.value;

  // 获取元素实际占用高度
  const height = input.scrollHeight;

  const lines = input.innerText.split("\n").length;

  if (lines > 2 || height > 50) {
    container.classList.add("rounded-lg");
    container.classList.remove("rounded-full");
    container.classList.add("p-4")
  } else {
    container.classList.remove("rounded-lg");
    container.classList.add("rounded-full");
    container.classList.remove("p-4")
  }
}

onMounted(() => {
  updateInputHeight();
});
</script>

<style scoped>
.input-text {
  color: #d4d4d4;
}
.input-bg {
  background-color: #1e1f20;
}
.input-text {
  flex-grow: 1;
  padding-right: 10px; /* 为按钮区域留出一些空间 */
}
button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}
</style>
