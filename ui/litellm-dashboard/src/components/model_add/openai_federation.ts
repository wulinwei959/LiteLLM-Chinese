import { isBlank, type FederationField } from "./federation_field";
import type { ModelAddTranslator } from "@/lib/i18n/translators";

const OPENAI_API_HOST = "api.openai.com";

export const OPENAI_FEDERATION_FIELDS: readonly FederationField[] = [
  {
    key: "openai_identity_provider_id",
    labelKey: "federation.openaiProviderIdLabel",
    tooltipKey: "federation.openaiProviderIdTooltip",
    required: false,
    control: "text",
  },
  {
    key: "openai_service_account_id",
    labelKey: "federation.openaiServiceAccountIdLabel",
    tooltipKey: "federation.openaiServiceAccountIdTooltip",
    required: false,
    control: "text",
  },
  {
    key: "openai_identity_token_file",
    labelKey: "federation.openaiIdentityTokenFileLabel",
    tooltipKey: "federation.openaiIdentityTokenFileTooltip",
    placeholder: "/var/run/secrets/kubernetes.io/serviceaccount/token",
    required: false,
    control: "text",
  },
];

export const isOpenAIProvider = (provider: string | null | undefined): boolean => provider?.toLowerCase() === "openai";

const isOpenAIApiHost = (hostname: string): boolean =>
  hostname === OPENAI_API_HOST || hostname.endsWith(`.${OPENAI_API_HOST}`);

const targetsOpenAIApi = (apiBase: string): boolean => {
  const url = URL.canParse(apiBase) ? new URL(apiBase) : null;
  return url?.protocol === "https:" && isOpenAIApiHost(url.hostname);
};

export const validateOpenAIFederationApiBase =
  (t: ModelAddTranslator) =>
  (value: unknown): string | true =>
    typeof value !== "string" || isBlank(value) || targetsOpenAIApi(value)
      ? true
      : t("federation.openaiApiBaseHost", { host: OPENAI_API_HOST });
