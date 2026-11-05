import type { ModelsAddModelTranslator } from "@/lib/i18n/translators";
import { Providers } from "../provider_info_helpers";

type AuthTypeTextId = "copilotShared" | "copilotPerUser" | "m365OAuth" | "m365Static";
export type AuthTypeLabelKey = `authTypes.${AuthTypeTextId}Label`;
export type AuthTypeDescriptionKey = `authTypes.${AuthTypeTextId}Description`;

export interface ProviderAuthType {
  readonly id: string;
  readonly labelKey: AuthTypeLabelKey;
  readonly descriptionKey: AuthTypeDescriptionKey;
  readonly fieldKeys: readonly string[];
  readonly requiredFieldKeys: readonly string[];
  readonly fixedValues?: Readonly<Record<string, string>>;
  readonly credentialOnly?: boolean;
}

const EMPTY_PROVIDER_AUTH_TYPES: readonly ProviderAuthType[] = [];

export const GITHUB_COPILOT_AUTH_TYPE_KEY = "github_copilot_auth_type";
export const GITHUB_COPILOT_HOST_KEY = "github_copilot_host";
export const GITHUB_COPILOT_PER_USER_AUTH_TYPE = "per_user_oauth";

export const PROVIDER_AUTH_TYPES: Partial<Record<keyof typeof Providers, readonly ProviderAuthType[]>> = {
  GITHUB_COPILOT: [
    {
      id: "shared_device_login",
      labelKey: "authTypes.copilotSharedLabel",
      descriptionKey: "authTypes.copilotSharedDescription",
      fieldKeys: ["api_base", "api_key"],
      requiredFieldKeys: [],
    },
    {
      id: GITHUB_COPILOT_PER_USER_AUTH_TYPE,
      labelKey: "authTypes.copilotPerUserLabel",
      descriptionKey: "authTypes.copilotPerUserDescription",
      credentialOnly: true,
      fieldKeys: [GITHUB_COPILOT_AUTH_TYPE_KEY, GITHUB_COPILOT_HOST_KEY],
      requiredFieldKeys: [GITHUB_COPILOT_AUTH_TYPE_KEY],
      fixedValues: { [GITHUB_COPILOT_AUTH_TYPE_KEY]: GITHUB_COPILOT_PER_USER_AUTH_TYPE },
    },
  ],
  MICROSOFT_365_COPILOT: [
    {
      id: "oauth_token_exchange",
      labelKey: "authTypes.m365OAuthLabel",
      descriptionKey: "authTypes.m365OAuthDescription",
      credentialOnly: true,
      fieldKeys: [
        "token_exchange_endpoint",
        "token_exchange_profile",
        "client_id",
        "client_secret",
        "token_exchange_scope",
        "token_exchange_audience",
      ],
      requiredFieldKeys: ["token_exchange_endpoint", "client_id", "client_secret"],
    },
    {
      id: "static_token",
      labelKey: "authTypes.m365StaticLabel",
      descriptionKey: "authTypes.m365StaticDescription",
      fieldKeys: ["api_key"],
      requiredFieldKeys: ["api_key"],
    },
  ],
};

export type ResolvedAuthType = ProviderAuthType & { readonly label: string; readonly description: string };

export const authTypesFor = (t: ModelsAddModelTranslator, provider: string | null): readonly ResolvedAuthType[] =>
  rawAuthTypesFor(provider).map((authType) => ({
    ...authType,
    label: t(authType.labelKey),
    description: t(authType.descriptionKey),
  }));

const rawAuthTypesFor = (provider: string | null): readonly ProviderAuthType[] => {
  const providerKeys: readonly (keyof typeof Providers)[] = Object.keys(Providers) as (keyof typeof Providers)[];
  const providerKey =
    provider === null ? undefined : providerKeys.find((key) => key === provider || Providers[key] === provider);
  return providerKey === undefined
    ? EMPTY_PROVIDER_AUTH_TYPES
    : PROVIDER_AUTH_TYPES[providerKey] ?? EMPTY_PROVIDER_AUTH_TYPES;
};

export const authTypeFieldKeys = (provider: string | null): readonly string[] =>
  rawAuthTypesFor(provider)
    .flatMap(({ fieldKeys }) => fieldKeys)
    .filter((fieldKey, index, fieldKeys) => fieldKeys.indexOf(fieldKey) === index);

export const inferAuthTypeId = (authTypes: readonly ProviderAuthType[], values: Record<string, unknown>): string =>
  authTypes.find(({ requiredFieldKeys }) =>
    requiredFieldKeys.some(
      (fieldKey) => values[fieldKey] !== undefined && values[fieldKey] !== null && values[fieldKey] !== "",
    ),
  )?.id ??
  authTypes[0]?.id ??
  "";

export const hiddenAuthFieldKeys = (authTypes: readonly ProviderAuthType[], selectedId: string): readonly string[] => {
  const selectedFieldKeys = authTypes.find(({ id }) => id === selectedId)?.fieldKeys ?? [];

  return authTypes
    .filter(({ id }) => id !== selectedId)
    .flatMap(({ fieldKeys }) => fieldKeys)
    .filter(
      (fieldKey, index, fieldKeys) => !selectedFieldKeys.includes(fieldKey) && fieldKeys.indexOf(fieldKey) === index,
    );
};
