<!--<script setup lang="ts">-->
<!--import DefaultLayout from './layouts/DefaultLayout.vue'-->

<!--// const ipcHandle = () => window.electron.ipcRenderer.send('ping')-->
<!--</script>-->

<!--<template>-->
<!--  <DefaultLayout />-->
<!--</template>-->
<template>
  <n-config-provider
    :date-locale="dateZhCN"
    :hljs="hljs"
    :locale="zhCN"
    :theme="theme"
    :theme-overrides="themeOverrides"
  >
    <n-global-style />
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider :max="3">
          <n-dialog-provider>
            <!--            &lt;!&ndash;  加载动画  &ndash;&gt;-->
            <!--            <transition name="fade">-->

            <!--              <div v-show="load_step === 1">-->
            <!--                <div class="flex h-screen">-->
            <!--                  <div class="m-auto text-center">-->
            <!--                    <Lottie v-if="osThemeRef === 'dark'" :loop="false" name="lae-jump"/>-->
            <!--                    <Lottie v-else :loop="false" name="lae-jump-black"/>-->
            <!--                    <n-h3>莱云</n-h3>-->
            <!--                  </div>-->
            <!--                </div>-->
            <!--              </div>-->
            <!--            </transition>-->

            <!--  页面   -->
            <!-- <transition name="fade">
              <div v-if="true">
                <DefaultLayout />
              </div>
            </transition> -->
            <DefaultLayout />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import { computed } from "vue";
import hljs from "highlight.js/lib/core";
import ini from "highlight.js/lib/languages/ini";

import {
  darkTheme,
  dateZhCN,
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useOsTheme,
  zhCN,
} from "naive-ui";
// import Lottie from "./components/Lottie.vue";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import { useUserStore } from "./stores/user";
import { useAppStore } from "./stores/app";

const appStore = useAppStore();
const osThemeRef = useOsTheme();

let switched = false;

const theme = computed(() => {
  if (switched && document.startViewTransition) {
    switch_appearance_with_transitions(osThemeRef.value);
  }

  switched = true;

  if (osThemeRef.value === "dark") {
    document.documentElement.setAttribute("theme", "dark");
    return darkTheme;
  } else {
    document.documentElement.setAttribute("theme", "light");
    return null;
  }
});

// 这个函数是点击事件的回调函数，带有参数 event
const switch_appearance_with_transitions = (toColor) => {
  const transition = document.startViewTransition(() => {});

  // 获取点击位置，作为圆心，根据页面大小计算半径
  let x = appStore.headerCenterLogoPosition.x;
  let y = appStore.headerCenterLogoPosition.y;

  if (toColor === "dark") {
    // 获取可视区域的宽高
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    x = innerWidth / 2;
    y = innerHeight - 1;
  }

  console.log(x, y);
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  );

  // 等待伪元素创建完成：
  transition.ready.then(() => {
    // 新视图的根元素动画：构造一个圆形作为裁切，并且半径会从0开始放大到endRadius
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: "ease-in",
        // 指定要附加动画的伪元素
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
};

// watch theme change

// const load_step = ref(1)
//
// if (process.env.NODE_ENV === 'production') {
//   window.onload = () => {
//     setTimeout(() => {
//       load_step.value = 1
//       setTimeout(() => {
//         load_step.value = 2
//       }, 500)
//     }, 250)
//   }
// } else {
//   load_step.value = 2
// }

hljs.registerLanguage("ini", ini);

// 主题调整
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
// const themeOverrides = {
//   common: {
//     primaryColor: '#ec4b2d',
//     primaryColorHover: '#ec4b2d',
//   },
//   Button: {
//     textColor: '#ec4b2d'
//   },
//
// }

const themeOverrides = {
  common: {
    fontFamily: "Noto Sans SC, sans-serif",
    fontFamilyMono: "JetBrains Mono, monospace",
  },
};

// UserStore
const userStore = useUserStore();
userStore.setupTimer();
</script>
