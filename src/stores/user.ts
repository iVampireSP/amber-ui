import { defineStore } from "pinia";
import axios from "axios";
import config from "../config/config";
import { Base64 } from "js-base64";

let timer: any = null;

export const useUserStore = defineStore("user", {
  persist: true,
  state: () => ({
    logined: false,
    id_token: "",
    refresh_token: "",
    access_token: "",
    expired_at: 0,
    user: {
      id: 0,
      name: "",
      email: "",
      avatar: "",
    },
    timer: 0,
  }),
  actions: {
    login(
      idToken: string,
      accessToken: string,
      refreshToken: string,
      expiredAt: number
    ) {
      const idTokenParts = idToken.split(".");

      const idTokenPayload = JSON.parse(Base64.decode(idTokenParts[1]));

      expiredAt = Date.now() + expiredAt * 1000;
      this.expired_at = expiredAt;

      this.refresh_token = refreshToken;
      this.access_token = accessToken;

      this.id_token = idToken;
      this.user = { ...idTokenPayload };
      this.logined = true;
    },
    checkAndRefresh() {
      if (this.logined) {
        if (this.expired_at - Date.now() < 60000) {
          this.refresh();
        }
      }
    },
    setupTimer() {
      this.checkAndRefresh();
      timer = setInterval(() => {
        this.checkAndRefresh();
      }, 10 * 1000);
    },
    async refresh() {
      const discovery = await axios.get(config.oauth_discovery_url);

      // post /oauth/token to refresh
      // 构建 form 参数
      const data = new URLSearchParams();
      data.set("grant_type", "refresh_token");
      data.set("refresh_token", this.refresh_token);
      data.set("client_id", config.oauth_client_id);
      data.set("scope", config.oauth_scope);

      axios
        .post(discovery.data.token_endpoint, data)
        .then((response) => {
          this.login(
            response.data.id_token,
            response.data.access_token,
            response.data.refresh_token,
            response.data.expires_in
          );
        })
        .catch((error) => {
          // if 401
          if (error.response.status === 401) {
            console.log("Refresh token failed");
          }
          // logout
          this.logout();
          clearInterval(timer);
        });
    },
    logout() {
      this.$reset();
      this.user = this.$state.user;
      this.id_token = this.$state.id_token;
      this.logined = this.$state.logined;
    },
  },
});
