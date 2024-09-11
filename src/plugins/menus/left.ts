import type { MenuOption } from "naive-ui";
import { RouterLink } from "vue-router";
import { NIcon } from "naive-ui";
import { Home as HomeIcon } from "@vicons/ionicons5";

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

addMenuItem("/", "Amber", HomeIcon);
addMenuItem("/auth/login", "Amber", HomeIcon);

export { addMenuItem as addLeftMenu, menuOptions as leftMenuOptions };
