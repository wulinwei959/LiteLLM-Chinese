export const SENSITIVE_FIELDS = new Set(["vault_token", "approle_secret_id", "client_key"]);

export const FIELD_LABEL_KEYS = {
  vault_addr: "vault.addr",
  vault_namespace: "vault.namespace",
  vault_login_namespace: "vault.loginNamespace",
  vault_secret_namespace: "vault.secretNamespace",
  vault_mount_name: "vault.mountName",
  vault_path_prefix: "vault.pathPrefix",
  vault_token: "vault.token",
  approle_role_id: "vault.roleId",
  approle_secret_id: "vault.secretId",
  approle_mount_path: "vault.mountPath",
  client_cert: "shared.clientCert",
  client_key: "shared.clientKey",
  vault_cert_role: "vault.certRole",
} as const;
