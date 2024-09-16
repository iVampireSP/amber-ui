<template>
  <div :id="id" :style="style"></div>
</template>

<script setup lang="ts">
import lottie, { AnimationConfigWithData, AnimationConfigWithPath, AnimationItem } from "lottie-web";

import { onMounted, onUnmounted, ref } from "vue";

const id = ref("lottie-" + Math.random().toString(36).substring(3, 13));

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  height: {
    type: Number,
    default: 128,
  },
  width: {
    type: Number,
    default: 0,
  },
  center: {
    type: Boolean,
    default: true,
  },
  style: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const container: Ref<HTMLElement | null> = ref(null);

const animation: Ref<AnimationItem | null> = ref(null);

// const src = "/assets/lottie/" + props.name + ".json";

onMounted(() => {
  // get dom
  container.value = document.getElementById(id.value);

  if (container.value) {
    container.value.style.height = props.height + "px";
    if (props.width) {
      container.value.style.width = props.width + "px";
    }
    if (props.center) {
      container.value.style.textAlign = "center";
    }
  }

  // set height

  // if width

  // set center(text center)

  if (container.value) {
    let options: AnimationConfigWithData = {
      container: container.value,
      renderer: "svg",
      loop: props.loop,
      autoplay: props.autoplay,
      animationData: props.data,
    };

    animation.value = lottie.loadAnimation(options);
  }
});

onUnmounted(() => {
  if (animation.value !== null) {
    animation.value.destroy();
  }
});
</script>
