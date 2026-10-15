export const SENSITIVE_FIELDS = new Set(["cyberark_api_key", "client_key"]);

export const FIELD_LABEL_KEYS = {
  cyberark_api_base: "cyberark.serverUrl",
  cyberark_account: "cyberark.account",
  cyberark_username: "cyberark.username",
  cyberark_api_key: "cyberark.apiKey",
  client_cert: "shared.clientCert",
  client_key: "shared.clientKey",
  ssl_verify: "cyberark.sslVerify",
  refresh_interval: "cyberark.refreshInterval",
} as const;
