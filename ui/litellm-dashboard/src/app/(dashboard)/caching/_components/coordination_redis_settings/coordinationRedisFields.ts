export type CoordinationFieldType = "string" | "password" | "integer" | "boolean" | "list";

export type CoordinationRedisType = "node" | "cluster" | "sentinel";

export type CoordinationSection = "connection" | "cluster" | "sentinel" | "ssl";

/** Every key here resolves under the `cacheSettings` namespace. */
export type CoordinationMessageKey =
  | "coordination.startupNodesHelp"
  | "coordination.urlHelp"
  | "fields.host.help"
  | "fields.host.label"
  | "fields.password.help"
  | "fields.password.label"
  | "fields.port.help"
  | "fields.port.label"
  | "fields.redis_startup_nodes.label"
  | "fields.sentinel_nodes.help"
  | "fields.sentinel_nodes.label"
  | "fields.sentinel_password.help"
  | "fields.sentinel_password.label"
  | "fields.service_name.help"
  | "fields.service_name.label"
  | "fields.ssl.help"
  | "fields.ssl.label"
  | "fields.url.label"
  | "fields.username.help"
  | "fields.username.label"
  | "redisTypeDescriptions.cluster"
  | "redisTypeDescriptions.node"
  | "redisTypeDescriptions.sentinel"
  | "redisTypes.cluster"
  | "redisTypes.node"
  | "redisTypes.sentinel"
  | "rules.jsonArray"
  | "rules.portRange"
  | "rules.validJsonArray"
  | "secretAlreadySet";

export type CoordinationFieldRule = (value: unknown) => CoordinationMessageKey | null;

export interface CoordinationField {
  readonly name: string;
  readonly labelKey: CoordinationMessageKey;
  readonly type: CoordinationFieldType;
  readonly section: CoordinationSection;
  readonly helpKey: CoordinationMessageKey;
  readonly redisType: CoordinationRedisType | null;
  readonly secret: boolean;
  readonly defaultValue?: string | number | boolean;
  readonly rules?: CoordinationFieldRule[];
}

export const COORDINATION_REDIS_TYPES: readonly CoordinationRedisType[] = ["node", "cluster", "sentinel"];

export const COORDINATION_REDIS_TYPE_DESCRIPTION_KEYS: Readonly<Record<CoordinationRedisType, CoordinationMessageKey>> =
  {
    node: "redisTypeDescriptions.node",
    cluster: "redisTypeDescriptions.cluster",
    sentinel: "redisTypeDescriptions.sentinel",
  };

export const COORDINATION_REDIS_TYPE_LABEL_KEYS: Readonly<Record<CoordinationRedisType, CoordinationMessageKey>> = {
  node: "redisTypes.node",
  cluster: "redisTypes.cluster",
  sentinel: "redisTypes.sentinel",
};

const isBlank = (value: unknown): boolean => value === undefined || value === null || String(value).trim() === "";

const portRule: CoordinationFieldRule = (value) => {
  if (isBlank(value)) {
    return null;
  }
  const port = Number(value);
  return Number.isInteger(port) && port >= 1 && port <= 65535 ? null : "rules.portRange";
};

const jsonListRule: CoordinationFieldRule = (value) => {
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

export const COORDINATION_FIELDS: readonly CoordinationField[] = [
  {
    name: "url",
    labelKey: "fields.url.label",
    type: "password",
    section: "connection",
    helpKey: "coordination.urlHelp",
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
    secret: false,
  },
  {
    name: "port",
    labelKey: "fields.port.label",
    type: "integer",
    section: "connection",
    helpKey: "fields.port.help",
    redisType: null,
    secret: false,
    defaultValue: "6379",
    rules: [portRule],
  },
  {
    name: "username",
    labelKey: "fields.username.label",
    type: "string",
    section: "connection",
    helpKey: "fields.username.help",
    redisType: null,
    secret: false,
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
    name: "startup_nodes",
    labelKey: "fields.redis_startup_nodes.label",
    type: "list",
    section: "cluster",
    helpKey: "coordination.startupNodesHelp",
    redisType: "cluster",
    secret: false,
    rules: [jsonListRule],
  },
  {
    name: "sentinel_nodes",
    labelKey: "fields.sentinel_nodes.label",
    type: "list",
    section: "sentinel",
    helpKey: "fields.sentinel_nodes.help",
    redisType: "sentinel",
    secret: false,
    rules: [jsonListRule],
  },
  {
    name: "service_name",
    labelKey: "fields.service_name.label",
    type: "string",
    section: "sentinel",
    helpKey: "fields.service_name.help",
    redisType: "sentinel",
    secret: false,
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
    name: "ssl",
    labelKey: "fields.ssl.label",
    type: "boolean",
    section: "ssl",
    helpKey: "fields.ssl.help",
    redisType: null,
    secret: false,
    defaultValue: false,
  },
];
