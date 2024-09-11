<template>
  <div>
    <p ref="textRef">
      <span
        v-for="(part, index) in textParts"
        :key="index"
        :style="{ opacity: `${1 - index * 0.1}` }"
        >{{ part }}</span
      >
    </p>

    <!-- 包裹 v-md-editor 的 div -->
    <div class="editor-container">
      <v-md-preview
        :text="text"
        @input="handleInput"
        height="500px"
        
      ></v-md-preview>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";


import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});


const text = ref("text");
const textLength = 10; // 每次生成的文本长度
const textParts = ref<string[]>([]);

// 将文本分割成每 10 个字符的部分
const updateTextParts = () => {
  textParts.value = text.value.match(/.{1,10}/g) || [];
};

// 监听 text 变化并更新 textParts
watch(
  () => text.value,
  (newText) => {
    updateTextParts();
  }
);

onMounted(() => {
  updateTextParts();

  // 随机生成字符串到 text.value
//   setInterval(() => {
//     const randomString = Math.random().toString(36).substring(2, 2 + textLength);
//     text.value += randomString;
//   }, 1000);
});

onUnmounted(() => {
  // 清理资源
});

// 处理输入事件
const handleInput = (value: string) => {
  text.value = value;
};
</script>

<style lang="css" scoped>
p {
  position: relative;
  overflow: hidden;
  white-space: nowrap; /* 保持文本在同一行 */
}

span {
  display: inline-block;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  animation: fadeIn 0.5s ease-in-out forwards;
}

.editor-container {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
</style>
