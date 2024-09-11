<template>
    <div>
        <p ref="textRef">
            <span v-for="(part, index) in textParts" :key="index" :style="{ opacity: `${1 - index * 0.1}` }">{{ part }}</span>
        </p>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

interface Props {
    text: string;
}

const props = withDefaults(defineProps<Props>(), {
    text: ''
});

const textLength = 10; // 每次生成的文本长度
const textParts = ref<string[]>([]);

// 将文本分割成每 10 个字符的部分
const updateTextParts = () => {
    textParts.value = props.text.match(/.{1,10}/g) || [];
};

// 监听 text 变化并更新 textParts
watch(computed(() => props.text), (newText) => {
    updateTextParts();
});

onMounted(() => {
    updateTextParts();
});

onUnmounted(() => {
    // 清理资源
});
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

@keyframes fadeIn {
    to {
        opacity: 1;
    }
}
</style>