import type { MenuOption } from "naive-ui";
import { RouterLink } from "vue-router";
import { NIcon } from "naive-ui";
import { LogOutOutline } from "@vicons/ionicons5";

const menuOptions: Ref<MenuOption[]> = ref([]);

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const addMenuItem = (to: string, label: string, icon: any) => {
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

addMenuItem("/auth/logout", "退出登录", LogOutOutline);

export { addMenuItem as addUserMenu, menuOptions as userMenuOptions };
