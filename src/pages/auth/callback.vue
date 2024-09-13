<template>
  <div class="flex items-center align-center justify-center h-screen">
    <div class="text-center">
      <div class="mt-5 !ml-2">
        <n-h1>正在验证 Token</n-h1>
        <n-text italic></n-text>
      </div>
      <br />
      <n-p></n-p>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { useUserStore } from "../../stores/user";
import router from "../../router";
import config from "../../config/config";

const userStore = useUserStore();

axios.get(config.oauth_discovery_url).then((discovery) => {
  const localCodeVerifier = localStorage.getItem(config.oauth_storage_key);

  const code: any = router.currentRoute.value.query.code;

  // 从当前页面请求中获取 code
  const q = new URLSearchParams({
    client_id: config.oauth_client_id,
    grant_type: "authorization_code",
    redirect_uri: config.oauth_callback_url,
    code_verifier: localCodeVerifier || "",
    code: code ?? "",
  });

  const tokenEndpoint = discovery.data.token_endpoint;
  axios
    .post(tokenEndpoint, q)
    .then((r) => {
      userStore.access_token = r.data.access_token;
      userStore.refresh_token = r.data.refresh_token;

      userStore.login(
        r.data.id_token,
        r.data.access_token,
        r.data.refresh_token,
        r.data.expires_in,
      );
    })
    .catch((e) => {
      console.log(e);
      alert("登录失败");
    })
    .finally(() => {
      // 跳转到 /
      router.push("/");
    });
});
</script>
