<script setup lang="ts">
import Test3 from './test3.vue';


const text = ref("some text");
</script>

<template>
    <Test3 :text="text"></Test3>
</template>01