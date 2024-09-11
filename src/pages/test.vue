<template>
    <div>
        <p ref="textRef">
            <span v-for="(part, index) in textParts" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">{{ part }}</span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// 生成固定长度的随机文本
const generateText = (length: number) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += characters[Math.floor(Math.random() * characters.length)];
    }
    return text;
};

const textLength = 10; // 每次生成的文本长度
const text = ref('');
const textParts = ref<string[]>([]);

// 将文本分割成每 10 个字符的部分
const updateTextParts = () => {
    textParts.value = text.value.match(/.{1,10}/g) || [];
};

// 定时追加新文本
const updateInterval = 500; // 每 5 秒追加一次
let intervalId: any;

onMounted(() => {
    intervalId = setInterval(() => {
        text.value += generateText(textLength);
        updateTextParts();
    }, updateInterval);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

// 初始更新文本部分
onMounted(() => {
    updateTextParts();
});
</script>

<style lang="css" scoped>
p {
    position: relative;
    overflow: hidden;
}

span {
    display: inline-block;
    transform: translateY(100%);
    transition: transform 0.5s ease-in-out;
    animation: fadeIn 0.5s ease-in-out forwards;
}

@keyframes fadeIn {
    to {
        transform: translateY(0);
    }
}
</style>