import { isMaskedSecret } from "@/utils/maskedSecretUtils";
import type { ModelAddTranslator } from "@/lib/i18n/translators";

type FederationFieldId =
  | "ruleId"
  | "orgId"
  | "serviceAccountId"
  | "workspaceId"
  | "identityTokenFile"
  | "identityTokenRef"
  | "issuerUrl"
  | "subject"
  | "audience"
  | "tokenLifetime"
  | "signingKeyRef"
  | "keycloakTokenUrl"
  | "keycloakClientId"
  | "clientSecretRef"
  | "clientAuthMethod"
  | "scope"
  | "openaiProviderId"
  | "openaiServiceAccountId"
  | "openaiIdentityTokenFile";

export type FederationLabelKey = `federation.${FederationFieldId}Label`;
export type FederationTooltipKey = `federation.${FederationFieldId}Tooltip`;

export interface FederationField {
  readonly key: string;
  readonly labelKey: FederationLabelKey;
  readonly tooltipKey: FederationTooltipKey;
  readonly placeholder?: string;
  readonly required: boolean;
  readonly control: "text" | "integer" | "select";
  readonly options?: readonly string[];
}

export const isBlank = (value: unknown): boolean => {
  if (typeof value === "string") {
    return value.trim() === "";
  }
  return value === undefined || value === null;
};

export const requiredFederationValue =
  (t: ModelAddTranslator) =>
  (value: unknown): string | true =>
    isBlank(value) ? t("federation.requiredField") : true;

export const validateMaskedValueUntouched =
  (t: ModelAddTranslator, storedValue: unknown) =>
  (value: unknown): string | true =>
    isMaskedSecret(value) && value !== storedValue ? t("federation.maskedHidden") : true;
