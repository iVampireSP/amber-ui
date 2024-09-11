import { useUserStore } from "../stores/user";
import { h, computed } from "vue";
import { createDiscreteApi, darkTheme, lightTheme, useOsTheme } from "naive-ui";
import type { ConfigProviderProps } from "naive-ui";

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

    return Promise.reject(error);
  },
};

export { request, response };
