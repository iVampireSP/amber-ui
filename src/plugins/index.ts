import pinia from "../stores";
import naive from "naive-ui";
import { createI18n } from "vue-i18n";
import i18nMessages from "@/i18n"
// Types
import type { App } from "vue";
// 通用字体
import "vfonts/Lato.css";
// 等宽字体
import "vfonts/FiraCode.css";

// 自动根据用户的浏览器设置选择语言
const getLocate = () => {
    const languages = navigator.languages || [navigator.language];

    for (const lang of languages) {
        if (lang.startsWith('zh-CN')) {
            return 'zh-CN'; // 简体中文
        } else if (lang.startsWith('zh-TW')) {
            return 'zh-TW'; // 繁体中文
        }
    }
    return languages[0];
};

const userLocale = getLocate();

const i18n = createI18n({
    locale: userLocale || 'zh-CN', // 如果没有匹配，默认返回简体中文
    fallbackLocale: "zh-CN",
    messages: i18nMessages,
});

export function registerPlugins(app: App) {
  app.use(i18n).use(naive).use(pinia);
}
