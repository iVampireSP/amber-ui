<template>
  <div class="flex items-center align-center justify-center h-screen">
    <div class="text-center">
      <div class="mt-5 !ml-2">
        <n-h1>“生成式 AI 的颠覆性只会越来越大”</n-h1>
        <n-text italic> 全球第三大富豪 Gautam Adani（高塔姆·阿达尼） </n-text>
      </div>
      <br />
      <n-p>正在载入</n-p>
    </div>
  </div>
</template>

<script async setup lang="ts">
import config from "../../config/config";
import axios from "axios";
import { useUserStore } from "../../stores/user";

const userStore = useUserStore();

function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(codeVerifier)
  );

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function go() {
  userStore.logout();
  const codeVerifier = generateRandomString(128);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem(config.oauth_storage_key, codeVerifier);

  const query = new URLSearchParams({
    client_id: config.oauth_client_id,
    redirect_uri: config.oauth_callback_url,
    response_type: "code",
    scope: config.oauth_scope,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  }).toString();

  const discovery = await axios.get(config.oauth_discovery_url);

  const a = document.createElement("a");
  a.href = discovery.data.authorization_endpoint + "?" + query;
  a.click();
}

go();
</script>
