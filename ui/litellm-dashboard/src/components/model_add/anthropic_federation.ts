import { isMaskedSecret } from "@/utils/maskedSecretUtils";
import type { ModelAddTranslator } from "@/lib/i18n/translators";
import { isBlank, type FederationField } from "./federation_field";

export type IdentitySourceId =
  | "token_file"
  | "secret_reference"
  | "internal_issuer"
  | "keycloak"
  | "environment"
  | "unrecognized";

type FederationSourceLabelKey =
  | "federation.sourceTokenFile"
  | "federation.sourceSecretRef"
  | "federation.sourceInternalIssuer"
  | "federation.sourceKeycloak"
  | "federation.sourceEnvironment";

export interface IdentitySource {
  readonly id: IdentitySourceId;
  readonly labelKey: FederationSourceLabelKey;
  readonly fixedValues: Readonly<Record<string, string>>;
  readonly fields: readonly FederationField[];
}

export const MAX_ISSUER_TTL_SECONDS = 3600;

const IDENTITY_SOURCE_KEY = "anthropic_identity_source";
const ACCEPTED_REFERENCE_PREFIX = "oidc/";
const REJECTED_REFERENCE_PREFIX = "oidc/env_path/";

export const FEDERATION_CORE_FIELDS: readonly FederationField[] = [
  {
    key: "anthropic_federation_rule_id",
    labelKey: "federation.ruleIdLabel",
    tooltipKey: "federation.ruleIdTooltip",
    placeholder: "fdrl_...",
    required: false,
    control: "text",
  },
  {
    key: "anthropic_organization_id",
    labelKey: "federation.orgIdLabel",
    tooltipKey: "federation.orgIdTooltip",
    required: false,
    control: "text",
  },
  {
    key: "anthropic_service_account_id",
    labelKey: "federation.serviceAccountIdLabel",
    tooltipKey: "federation.serviceAccountIdTooltip",
    placeholder: "svac_...",
    required: false,
    control: "text",
  },
  {
    key: "anthropic_federation_workspace_id",
    labelKey: "federation.workspaceIdLabel",
    tooltipKey: "federation.workspaceIdTooltip",
    placeholder: "wrkspc_...",
    required: false,
    control: "text",
  },
];

export const IDENTITY_SOURCES: readonly IdentitySource[] = [
  {
    id: "token_file",
    labelKey: "federation.sourceTokenFile",
    fixedValues: {},
    fields: [
      {
        key: "anthropic_identity_token_file",
        labelKey: "federation.identityTokenFileLabel",
        tooltipKey: "federation.identityTokenFileTooltip",
        placeholder: "/var/run/secrets/anthropic/token",
        required: true,
        control: "text",
      },
    ],
  },
  {
    id: "secret_reference",
    labelKey: "federation.sourceSecretRef",
    fixedValues: {},
    fields: [
      {
        key: "anthropic_identity_token",
        labelKey: "federation.identityTokenRefLabel",
        tooltipKey: "federation.identityTokenRefTooltip",
        placeholder: "oidc/env/ANTHROPIC_IDENTITY_TOKEN",
        required: true,
        control: "text",
      },
    ],
  },
  {
    id: "internal_issuer",
    labelKey: "federation.sourceInternalIssuer",
    fixedValues: { [IDENTITY_SOURCE_KEY]: "internal_issuer" },
    fields: [
      {
        key: "anthropic_issuer_url",
        labelKey: "federation.issuerUrlLabel",
        tooltipKey: "federation.issuerUrlTooltip",
        placeholder: "https://litellm.example.com",
        required: true,
        control: "text",
      },
      {
        key: "anthropic_issuer_subject",
        labelKey: "federation.subjectLabel",
        tooltipKey: "federation.subjectTooltip",
        required: true,
        control: "text",
      },
      {
        key: "anthropic_issuer_audience",
        labelKey: "federation.audienceLabel",
        tooltipKey: "federation.audienceTooltip",
        required: false,
        control: "text",
      },
      {
        key: "anthropic_issuer_ttl_seconds",
        labelKey: "federation.tokenLifetimeLabel",
        tooltipKey: "federation.tokenLifetimeTooltip",
        required: false,
        control: "integer",
      },
      {
        key: "anthropic_issuer_signing_key_ref",
        labelKey: "federation.signingKeyRefLabel",
        tooltipKey: "federation.signingKeyRefTooltip",
        placeholder: "os.environ/ANTHROPIC_ISSUER_SIGNING_KEY",
        required: true,
        control: "text",
      },
    ],
  },
  {
    id: "keycloak",
    labelKey: "federation.sourceKeycloak",
    fixedValues: { [IDENTITY_SOURCE_KEY]: "keycloak" },
    fields: [
      {
        key: "anthropic_keycloak_token_url",
        labelKey: "federation.keycloakTokenUrlLabel",
        tooltipKey: "federation.keycloakTokenUrlTooltip",
        placeholder: "https://keycloak.example.com/realms/<realm>/protocol/openid-connect/token",
        required: true,
        control: "text",
      },
      {
        key: "anthropic_keycloak_client_id",
        labelKey: "federation.keycloakClientIdLabel",
        tooltipKey: "federation.keycloakClientIdTooltip",
        required: true,
        control: "text",
      },
      {
        key: "anthropic_keycloak_client_secret_ref",
        labelKey: "federation.clientSecretRefLabel",
        tooltipKey: "federation.clientSecretRefTooltip",
        placeholder: "os.environ/KEYCLOAK_CLIENT_SECRET",
        required: true,
        control: "text",
      },
      {
        key: "anthropic_keycloak_auth_method",
        labelKey: "federation.clientAuthMethodLabel",
        tooltipKey: "federation.clientAuthMethodTooltip",
        required: false,
        control: "select",
        options: ["client_secret_basic", "client_secret_post"],
      },
      {
        key: "anthropic_keycloak_scope",
        labelKey: "federation.scopeLabel",
        tooltipKey: "federation.scopeTooltip",
        required: false,
        control: "text",
      },
    ],
  },
  {
    id: "environment",
    labelKey: "federation.sourceEnvironment",
    fixedValues: {},
    fields: [],
  },
];

export const DEFAULT_IDENTITY_SOURCE: IdentitySourceId = "token_file";

const IDENTITY_SOURCE_VALUE_KEYS: readonly string[] = [
  IDENTITY_SOURCE_KEY,
  ...IDENTITY_SOURCES.flatMap((source) => source.fields.map((field) => field.key)),
];

export const ANTHROPIC_FEDERATION_FIELDS: readonly FederationField[] = [
  ...FEDERATION_CORE_FIELDS,
  ...IDENTITY_SOURCES.flatMap((source) => source.fields),
];

export const ANTHROPIC_FEDERATION_VALUE_KEYS: readonly string[] = [
  ...FEDERATION_CORE_FIELDS.map((field) => field.key),
  ...IDENTITY_SOURCE_VALUE_KEYS,
];

const UNRECOGNIZED_IDENTITY_SOURCE: IdentitySource = {
  id: "unrecognized",
  labelKey: "federation.sourceEnvironment",
  fixedValues: {},
  fields: [],
};

export const identitySourceById = (id: IdentitySourceId): IdentitySource =>
  IDENTITY_SOURCES.find((source) => source.id === id) ?? UNRECOGNIZED_IDENTITY_SOURCE;

export const isAnthropicProvider = (provider: string | null | undefined): boolean =>
  provider !== null && provider !== undefined && provider.toLowerCase() === "anthropic";

export const inferIdentitySource = (credentialValues: Record<string, unknown> | null | undefined): IdentitySourceId => {
  const values = credentialValues ?? {};
  const declared = values[IDENTITY_SOURCE_KEY];
  if (!isBlank(declared)) {
    return (
      IDENTITY_SOURCES.find((source) => source.fixedValues[IDENTITY_SOURCE_KEY] === declared)?.id ?? "unrecognized"
    );
  }
  if (!isBlank(values.anthropic_identity_token_file)) {
    return "token_file";
  }
  if (!isBlank(values.anthropic_identity_token)) {
    return "secret_reference";
  }
  return "environment";
};

export const identitySourceOptions = (
  t: ModelAddTranslator,
  storedValues: Record<string, unknown>,
): readonly { value: IdentitySourceId; label: string }[] => [
  ...(inferIdentitySource(storedValues) === "unrecognized"
    ? [
        {
          value: "unrecognized" as const,
          label: t("federation.storedOption", { value: String(storedValues[IDENTITY_SOURCE_KEY]) }),
        },
      ]
    : []),
  ...IDENTITY_SOURCES.map((source) => ({ value: source.id, label: t(source.labelKey) })),
];

export const validateFederationValueStored =
  (t: ModelAddTranslator, identitySource: IdentitySourceId) =>
  (_value: unknown, formValues: Record<string, unknown>): string | true =>
    identitySource === "environment" && FEDERATION_CORE_FIELDS.every((field) => isBlank(formValues[field.key]))
      ? t("federation.coreValuesOrSource")
      : true;

export const validateIdentityTokenReference =
  (t: ModelAddTranslator) =>
  (value: unknown): string | true => {
    if (typeof value !== "string" || isBlank(value) || isMaskedSecret(value)) {
      return true;
    }
    return value.startsWith(ACCEPTED_REFERENCE_PREFIX) && !value.startsWith(REJECTED_REFERENCE_PREFIX)
      ? true
      : t("federation.tokenRefFormat");
  };

export const validateIssuerTtlSeconds =
  (t: ModelAddTranslator) =>
  (value: unknown): string | true => {
    if (isBlank(value)) {
      return true;
    }
    const seconds = Number(value);
    return Number.isInteger(seconds) && seconds >= 1 && seconds <= MAX_ISSUER_TTL_SECONDS
      ? true
      : t("federation.ttlRange", { max: MAX_ISSUER_TTL_SECONDS });
  };

export const otherIdentitySourceKeys = (identitySource: IdentitySourceId): readonly string[] => {
  const source = identitySourceById(identitySource);
  const kept = new Set([...source.fields.map((field) => field.key), ...Object.keys(source.fixedValues)]);
  return IDENTITY_SOURCE_VALUE_KEYS.filter((key) => !kept.has(key));
};
