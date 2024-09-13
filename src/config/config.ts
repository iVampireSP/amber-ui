const config = {
  app_name: "Amber",
  oauth_discovery_url:
    "https://auth.leaflow.cn/.well-known/openid-configuration",
  oauth_client_id: "60021",
  oauth_callback_url: "http://localhost:5173/auth/callback",
  oauth_storage_key: "code_verifier",
  oauth_scope: "openid profile",
  backend: "http://localhost:8080",
};

// @ts-ignore ...
if (process.env.NODE_ENV === "production") {
  config.backend = "https://amber-api.leaflow.cn";
  config.oauth_callback_url = "https://amber.leaflow.cn/auth/callback";
  config.oauth_client_id = "16";
}

config.backend = "https://amber-api.leaflow.cn";

// console.log("api endpoint: " + config.backend);

export default config;
