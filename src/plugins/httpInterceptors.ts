import { h, computed } from "vue";
import { createDiscreteApi, darkTheme, lightTheme, useOsTheme } from "naive-ui";
import type { ConfigProviderProps } from "naive-ui";
import error401 from "@/pages/errors/401.vue";
import error404 from "@/pages/errors/404.vue";
import error400 from "@/pages/errors/400.vue";
import error500 from "@/pages/errors/500.vue";

const osThemeRef = useOsTheme();

const configProviderPropsRef = computed<ConfigProviderProps>(() => ({
  theme: osThemeRef.value === "light" ? lightTheme : darkTheme,
}));
const { dialog, loadingBar } = createDiscreteApi(
  ["message", "dialog", "notification", "loadingBar", "modal"],
  {
    configProviderProps: configProviderPropsRef,
  }
);

const request = {
  onFulfilled: (config: any) => {
    if (config.headers === undefined) {
      config.headers = {};
    }

    loadingBar.start();

    return Promise.resolve(config);
  },
  onRejected: (error: any) => {
    console.error(error);

    // loadingBar.error()

    return Promise.reject(error);
  },
};

const response = {
  onFulfilled: (res: any) => {
    // if 20x
    if (res.status >= 200 && res.status < 300) {
      loadingBar.finish();
    } else if (res.status >= 400 && res.status < 600) {
      loadingBar.error();
    }

    return Promise.resolve(res);
  },
  onRejected: (error: any) => {
    loadingBar.error();

    console.error("axios error", error);

    let data = [];

    if (error.response.data.data) {
      data = error.response.data.data;
    }

    if (error.response.data.message) {
      data = error.response.data.message;
    }

    if (error.response.data.error) {
      data = error.response.data.error.message;
    }

    if (error.response.status === 400) {
      // dialog.error({
      //   title: "输入有误",
      //   content: () => {
      //     return h(error400, {
      //       show_footer: false,
      //     });
      //   },
      // });
    } else if (error.response.status === 401) {
      dialog.error({
        title: "401 未授权",
        content: () => {
          return h(error401, {
            show_footer: false,
          });
        },
      });
    } else if (error.response.status === 404) {
      dialog.error({
        title: "404 未找到",
        content: () => {
          return h(error404, {
            show_footer: false,
          });
        },
      });
    } else if (error.response.status === 500) {
      dialog.error({
        title: "500 服务器错误",
        content: () => {
          return h(error500);
        },
      });
    }

    return Promise.reject(error);
  },
};

export { request, response };
