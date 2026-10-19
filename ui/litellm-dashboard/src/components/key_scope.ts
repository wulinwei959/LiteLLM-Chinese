import type { CommonTranslator } from "@/lib/i18n/translators";

export interface KeyModelScope {
  hasModelAccess: boolean;
  label: string | null;
}

const MANAGEMENT_ROUTES_PRESET = "management_routes";
const INFO_ROUTES_PRESET = "info_routes";
const SCIM_ROUTE_PREFIX = "/scim";

const managementScope = (t: CommonTranslator): KeyModelScope => ({
  hasModelAccess: false,
  label: t("keyScopeManagement"),
});
const readOnlyScope = (t: CommonTranslator): KeyModelScope => ({
  hasModelAccess: false,
  label: t("keyScopeReadOnly"),
});
const scimScope = (t: CommonTranslator): KeyModelScope => ({
  hasModelAccess: false,
  label: t("keyScopeScim"),
});
const FULL_MODEL_ACCESS: KeyModelScope = { hasModelAccess: true, label: null };

const isScimRoute = (route: string): boolean => route.startsWith(SCIM_ROUTE_PREFIX);

const isOnlyPreset = (allowedRoutes: string[], preset: string): boolean =>
  allowedRoutes.length === 1 && allowedRoutes[0] === preset;

export const deriveKeyModelScope = (
  t: CommonTranslator,
  allowedRoutes: string[] | null | undefined,
  keyType?: string | null,
): KeyModelScope => {
  if (keyType === "management") {
    return managementScope(t);
  }

  if (keyType === "read_only") {
    return readOnlyScope(t);
  }

  if (!Array.isArray(allowedRoutes) || allowedRoutes.length === 0) {
    return FULL_MODEL_ACCESS;
  }

  if (allowedRoutes.every(isScimRoute)) {
    return scimScope(t);
  }

  if (isOnlyPreset(allowedRoutes, MANAGEMENT_ROUTES_PRESET)) {
    return managementScope(t);
  }

  if (isOnlyPreset(allowedRoutes, INFO_ROUTES_PRESET)) {
    return readOnlyScope(t);
  }

  return FULL_MODEL_ACCESS;
};
