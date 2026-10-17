export type CacheFieldType =
  | "string"
  | "password"
  | "integer"
  | "float"
  | "boolean"
  | "list"
  | "model-select"
  | "select";

export type CacheFieldName =
  | "url"
  | "host"
  | "port"
  | "db"
  | "password"
  | "username"
  | "redis_startup_nodes"
  | "sentinel_nodes"
  | "service_name"
  | "sentinel_password"
  | "similarity_threshold"
  | "redis_semantic_cache_embedding_model"
  | "semantic_cache_scope"
  | "ssl"
  | "ssl_cert_reqs"
  | "ssl_check_hostname"
  | "namespace"
  | "ttl"
  | "max_connections"
  | "gcp_service_account"
  | "gcp_ssl_ca_certs";

/** Every key here resolves under the `cacheSettings` namespace. */
export type CacheMessageKey =
  | "fields.url.label"
  | "fields.url.help"
  | "fields.host.label"
  | "fields.host.help"
  | "fields.port.label"
  | "fields.port.help"
  | "fields.db.label"
  | "fields.db.help"
  | "fields.password.label"
  | "fields.password.help"
  | "fields.username.label"
  | "fields.username.help"
  | "fields.redis_startup_nodes.label"
  | "fields.redis_startup_nodes.help"
  | "fields.sentinel_nodes.label"
  | "fields.sentinel_nodes.help"
  | "fields.service_name.label"
  | "fields.service_name.help"
  | "fields.sentinel_password.label"
  | "fields.sentinel_password.help"
  | "fields.similarity_threshold.label"
  | "fields.similarity_threshold.help"
  | "fields.redis_semantic_cache_embedding_model.label"
  | "fields.redis_semantic_cache_embedding_model.help"
  | "fields.semantic_cache_scope.label"
  | "fields.semantic_cache_scope.help"
  | "fields.ssl.label"
  | "fields.ssl.help"
  | "fields.ssl_cert_reqs.label"
  | "fields.ssl_cert_reqs.help"
  | "fields.ssl_check_hostname.label"
  | "fields.ssl_check_hostname.help"
  | "fields.namespace.label"
  | "fields.namespace.help"
  | "fields.ttl.label"
  | "fields.ttl.help"
  | "fields.max_connections.label"
  | "fields.max_connections.help"
  | "fields.gcp_service_account.label"
  | "fields.gcp_service_account.help"
  | "fields.gcp_ssl_ca_certs.label"
  | "fields.gcp_ssl_ca_certs.help"
  | "fieldOptions.semantic_cache_scope.key"
  | "fieldOptions.semantic_cache_scope.end_user"
  | "redisTypes.node"
  | "redisTypes.cluster"
  | "redisTypes.sentinel"
  | "redisTypes.semantic"
  | "redisTypeDescriptions.node"
  | "redisTypeDescriptions.cluster"
  | "redisTypeDescriptions.sentinel"
  | "redisTypeDescriptions.semantic"
  | "rules.portRange"
  | "rules.validJsonArray"
  | "rules.jsonArray"
  | "rules.nonNegativeInteger"
  | "rules.number"
  | "sections.connection"
  | "sections.cluster"
  | "sections.sentinel"
  | "sections.semantic"
  | "sections.ssl"
  | "sections.cacheManagement"
  | "sections.gcp"
  | "secretAlreadySet"
  | "redisTypeFallback";

export interface CacheFieldOption {
  readonly value: string;
  readonly labelKey: CacheMessageKey;
}

export type RedisType = "node" | "cluster" | "sentinel" | "semantic";

export type CacheSection = "connection" | "cluster" | "sentinel" | "semantic" | "ssl" | "cacheManagement" | "gcp";

export type CacheFieldRule = (value: unknown) => CacheMessageKey | null;

// Marker the backend returns for a configured credential and maps back to the
// stored secret on save, so the plaintext never round-trips through the form.
export const REDACTED_VALUE = "***REDACTED***";

export interface CacheField {
  readonly name: CacheFieldName;
  readonly type: CacheFieldType;
  readonly section: CacheSection;
  readonly labelKey: CacheMessageKey;
  readonly helpKey: CacheMessageKey;
  readonly redisType: RedisType | null;
  readonly defaultValue?: string | number | boolean;
  readonly options?: readonly CacheFieldOption[];
  readonly rules?: CacheFieldRule[];
  // Credential field: never prefilled into the form, and dropped from the save
  // payload when left untouched so the redacted marker is never persisted.
  readonly secret?: boolean;
}

export const REDIS_TYPES: readonly RedisType[] = ["node", "cluster", "sentinel", "semantic"];

export const REDIS_TYPE_LABEL_KEYS: Readonly<Record<RedisType, CacheMessageKey>> = {
  node: "redisTypes.node",
  cluster: "redisTypes.cluster",
  sentinel: "redisTypes.sentinel",
  semantic: "redisTypes.semantic",
};

export const REDIS_TYPE_DESCRIPTION_KEYS: Readonly<Record<RedisType, CacheMessageKey>> = {
  node: "redisTypeDescriptions.node",
  cluster: "redisTypeDescriptions.cluster",
  sentinel: "redisTypeDescriptions.sentinel",
  semantic: "redisTypeDescriptions.semantic",
};

const isBlank = (value: unknown): boolean => value === undefined || value === null || String(value).trim() === "";

const portRule: CacheFieldRule = (value) => {
  if (isBlank(value)) {
    return null;
  }
  const port = Number(value);
  return Number.isInteger(port) && port >= 1 && port <= 65535 ? null : "rules.portRange";
};

const jsonListRule: CacheFieldRule = (value) => {
  if (isBlank(value)) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(String(value));
  } catch {
    return "rules.validJsonArray";
  }
  return Array.isArray(parsed) ? null : "rules.jsonArray";
};

const nonNegativeIntegerRule: CacheFieldRule = (value) => {
  if (isBlank(value)) {
    return null;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? null : "rules.nonNegativeInteger";
};

const numberRule: CacheFieldRule = (value) => {
  if (isBlank(value)) {
    return null;
  }
  return Number.isNaN(Number(value)) ? "rules.number" : null;
};

export const CACHE_FIELDS: readonly CacheField[] = [
  {
    name: "url",
    labelKey: "fields.url.label",
    type: "string",
    section: "connection",
    helpKey: "fields.url.help",
    redisType: null,
    secret: true,
  },
  {
    name: "host",
    labelKey: "fields.host.label",
    type: "string",
    section: "connection",
    helpKey: "fields.host.help",
    redisType: null,
  },
  {
    name: "port",
    labelKey: "fields.port.label",
    type: "string",
    section: "connection",
    helpKey: "fields.port.help",
    redisType: null,
    defaultValue: "6379",
    rules: [portRule],
  },
  {
    name: "db",
    labelKey: "fields.db.label",
    type: "integer",
    section: "connection",
    helpKey: "fields.db.help",
    redisType: null,
    rules: [nonNegativeIntegerRule],
  },
  {
    name: "password",
    labelKey: "fields.password.label",
    type: "password",
    section: "connection",
    helpKey: "fields.password.help",
    redisType: null,
    secret: true,
  },
  {
    name: "username",
    labelKey: "fields.username.label",
    type: "string",
    section: "connection",
    helpKey: "fields.username.help",
    redisType: null,
  },
  {
    name: "redis_startup_nodes",
    labelKey: "fields.redis_startup_nodes.label",
    type: "list",
    section: "cluster",
    helpKey: "fields.redis_startup_nodes.help",
    redisType: "cluster",
    rules: [jsonListRule],
  },
  {
    name: "sentinel_nodes",
    labelKey: "fields.sentinel_nodes.label",
    type: "list",
    section: "sentinel",
    helpKey: "fields.sentinel_nodes.help",
    redisType: "sentinel",
    rules: [jsonListRule],
  },
  {
    name: "service_name",
    labelKey: "fields.service_name.label",
    type: "string",
    section: "sentinel",
    helpKey: "fields.service_name.help",
    redisType: "sentinel",
  },
  {
    name: "sentinel_password",
    labelKey: "fields.sentinel_password.label",
    type: "password",
    section: "sentinel",
    helpKey: "fields.sentinel_password.help",
    redisType: "sentinel",
    secret: true,
  },
  {
    name: "similarity_threshold",
    labelKey: "fields.similarity_threshold.label",
    type: "float",
    section: "semantic",
    helpKey: "fields.similarity_threshold.help",
    redisType: "semantic",
    defaultValue: 0.8,
    rules: [numberRule],
  },
  {
    name: "redis_semantic_cache_embedding_model",
    labelKey: "fields.redis_semantic_cache_embedding_model.label",
    type: "model-select",
    section: "semantic",
    helpKey: "fields.redis_semantic_cache_embedding_model.help",
    redisType: "semantic",
  },
  {
    name: "semantic_cache_scope",
    labelKey: "fields.semantic_cache_scope.label",
    type: "select",
    section: "semantic",
    helpKey: "fields.semantic_cache_scope.help",
    redisType: "semantic",
    defaultValue: "key",
    options: [
      { value: "key", labelKey: "fieldOptions.semantic_cache_scope.key" },
      { value: "end_user", labelKey: "fieldOptions.semantic_cache_scope.end_user" },
    ],
  },
  {
    name: "ssl",
    labelKey: "fields.ssl.label",
    type: "boolean",
    section: "ssl",
    helpKey: "fields.ssl.help",
    redisType: null,
    defaultValue: false,
  },
  {
    name: "ssl_cert_reqs",
    labelKey: "fields.ssl_cert_reqs.label",
    type: "string",
    section: "ssl",
    helpKey: "fields.ssl_cert_reqs.help",
    redisType: null,
  },
  {
    name: "ssl_check_hostname",
    labelKey: "fields.ssl_check_hostname.label",
    type: "boolean",
    section: "ssl",
    helpKey: "fields.ssl_check_hostname.help",
    redisType: null,
    defaultValue: false,
  },
  {
    name: "namespace",
    labelKey: "fields.namespace.label",
    type: "string",
    section: "cacheManagement",
    helpKey: "fields.namespace.help",
    redisType: null,
  },
  {
    name: "ttl",
    labelKey: "fields.ttl.label",
    type: "float",
    section: "cacheManagement",
    helpKey: "fields.ttl.help",
    redisType: null,
    rules: [numberRule],
  },
  {
    name: "max_connections",
    labelKey: "fields.max_connections.label",
    type: "integer",
    section: "cacheManagement",
    helpKey: "fields.max_connections.help",
    redisType: null,
    rules: [nonNegativeIntegerRule],
  },
  {
    name: "gcp_service_account",
    labelKey: "fields.gcp_service_account.label",
    type: "string",
    section: "gcp",
    helpKey: "fields.gcp_service_account.help",
    redisType: null,
  },
  {
    name: "gcp_ssl_ca_certs",
    labelKey: "fields.gcp_ssl_ca_certs.label",
    type: "string",
    section: "gcp",
    helpKey: "fields.gcp_ssl_ca_certs.help",
    redisType: null,
  },
];
