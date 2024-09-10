<template>
  <div>
    <h1>请稍后...</h1>
  </div>
</template>

<script async setup lang="ts">
import config from "../../config/config";
import axios from "axios";
import router from "../../plugins/router";

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
