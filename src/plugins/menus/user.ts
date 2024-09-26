import type { MenuOption } from "naive-ui";
import { RouterLink } from "vue-router";
import { NIcon } from "naive-ui";
import { ChatbubbleOutline, HammerOutline, HomeOutline, LogOutOutline, PeopleCircleOutline, PersonOutline } from "@vicons/ionicons5";
import config from "@/config/config";

const menuOptions: Ref<MenuOption[]> = ref([]);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const addMenuItem = (to: string, label: string, icon: any) => {
  // 如果 to 是 http 或 https 开头
  if (/^(http|https):\/\//.test(to)) {
    menuOptions.value.push({
      label: () =>
        h(
          "a",
          {
            href: to,
            target: "_blank",
            rel: "noopener noreferrer",
          },
          { default: () => label }
        ),
      key: to,
      icon: renderIcon(icon),
    });
    return;
  }

  menuOptions.value.push({
    label: () =>
      h(
        RouterLink,
        {
          to: {
            name: to as any,
          },
        },
        { default: () => label }
      ),
    key: to as string,
    icon: renderIcon(icon),
  });
};

addMenuItem("/home/", "Amber 首页", HomeOutline);
addMenuItem(config.forum_url, "社区主页", PeopleCircleOutline);
addMenuItem(config.forum_url + "/t/assistant", "助理预设", PersonOutline);
addMenuItem(config.forum_url + "/t/tools", "工具分享", HammerOutline);
addMenuItem(config.forum_url + "/t/prompts", "助理提示词", ChatbubbleOutline);
addMenuItem("/auth/logout", "退出登录", LogOutOutline);

export { addMenuItem as addUserMenu, menuOptions as userMenuOptions };
