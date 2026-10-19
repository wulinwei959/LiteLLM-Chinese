import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { apiClient } from "@/components/networking";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgentFormField, type AgentFormValues } from "./AgentFormKit";
import { entraTenantFromIssuer, IDENTITY_UUID_PATTERN } from "./agent_identity";

const PROVIDER_OPTIONS = [
  { value: "none", labelKey: "providerNoneLabel" },
  { value: "microsoft_entra", labelKey: "providerEntra" },
] as const;
const EXECUTION_MODE_OPTIONS = [
  { value: "autonomous", labelKey: "modeAutonomous" },
  { value: "delegated", labelKey: "modeDelegated" },
  { value: "both", labelKey: "modeBoth" },
] as const;
const EXECUTION_OPTIONS = [
  { value: "enabled", labelKey: "executionEnabled" },
  { value: "disabled", labelKey: "executionDisabled" },
] as const;

export const AgentIdentityFields = ({ accessToken }: { accessToken: string | null }) => {
  const t = useTranslations("agentIdentity");
  const provider = useWatch<AgentFormValues>({ name: "identity_provider" });
  const mode = useWatch<AgentFormValues>({ name: "execution_mode" });
  const showScopes = mode !== "autonomous" && mode !== undefined;
  const [tenants, setTenants] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken || provider !== "microsoft_entra") return;
    let active = true;
    apiClient
      .get<string[]>("/v1/agents/identity/providers", { accessToken })
      .then((issuers) => {
        if (active) {
          setError(null);
          setTenants(
            issuers.flatMap((issuer) => {
              const tenant = entraTenantFromIssuer(issuer);
              return tenant ? [tenant] : [];
            }),
          );
        }
      })
      .catch(() => {
        if (active) setError(t("providersLoadFailed"));
      });
    return () => {
      active = false;
    };
  }, [accessToken, provider]);

  return (
    <>
      <section aria-label={t("sectionAria")} className="my-6 space-y-4 rounded-lg border border-border p-4">
        <div>
          <h3 className="font-medium">{t("sectionTitle")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("sectionDesc")}</p>
        </div>
        <AgentFormField name="identity_provider" label={t("providerLabel")} defaultValue="none">
          {({ value, onChange, id }) => (
            <Select
              items={PROVIDER_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
              value={typeof value === "string" ? value : "none"}
              onValueChange={onChange}
            >
              <SelectTrigger id={id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {t(option.labelKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </AgentFormField>
        {provider === "microsoft_entra" && (
          <>
            <AgentFormField
              name="identity_tenant_id"
              label={t("trustedTenant")}
              rules={{ required: t("trustedTenantRequired") }}
            >
              {({ value, onChange, id }) => (
                <Select value={typeof value === "string" ? value : ""} onValueChange={onChange}>
                  <SelectTrigger id={id}>
                    <SelectValue placeholder={t("trustedTenantPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.map((tenant) => (
                      <SelectItem key={tenant} value={tenant}>
                        {tenant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </AgentFormField>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            {!error && tenants.length === 0 && <p className="text-sm text-muted-foreground">{t("tenantEmptyHint")}</p>}
            <AgentFormField
              name="identity_client_id"
              label={t("clientId")}
              rules={{
                required: t("clientIdRequired"),
                pattern: { value: IDENTITY_UUID_PATTERN, message: t("clientIdInvalid") },
              }}
              description={
                <>
                  {t("clientIdDescBefore")}{" "}
                  <a className="underline" href="https://entra.microsoft.com/" target="_blank" rel="noreferrer">
                    {t("clientIdDescLink")}
                  </a>
                  {t("clientIdDescAfter")}
                </>
              }
            >
              {({ value, onChange, ref, ...control }) => (
                <Input
                  {...control}
                  ref={ref}
                  value={typeof value === "string" ? value : ""}
                  onChange={onChange}
                  placeholder={t("clientIdPlaceholder")}
                />
              )}
            </AgentFormField>
            <AgentFormField name="execution_mode" label={t("executionMode")} defaultValue="autonomous">
              {({ value, onChange, id }) => (
                <Select
                  items={EXECUTION_MODE_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
                  value={typeof value === "string" ? value : "autonomous"}
                  onValueChange={onChange}
                >
                  <SelectTrigger id={id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXECUTION_MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </AgentFormField>
            <AgentFormField
              name="identity_service_principal_id"
              label={t("enterpriseObjectId")}
              rules={{
                required: mode !== "delegated" ? t("enterpriseObjectIdRequired") : false,
                pattern: { value: IDENTITY_UUID_PATTERN, message: t("principalUuidInvalid") },
              }}
              description={t.rich("enterpriseObjectIdHelp", {
                link: (chunks) => (
                  <a
                    className="underline"
                    href="https://entra.microsoft.com/#view/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/~/AppAppsPreview"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {chunks}
                  </a>
                ),
              })}
            >
              {({ value, onChange, ref, ...control }) => (
                <Input {...control} ref={ref} value={typeof value === "string" ? value : ""} onChange={onChange} />
              )}
            </AgentFormField>

            <AgentFormField
              name="identity_required_roles"
              label={t("requiredRoles")}
              description={t("requiredRolesDesc")}
            >
              {({ value, onChange, ref, ...control }) => (
                <Input
                  {...control}
                  ref={ref}
                  value={typeof value === "string" ? value : ""}
                  onChange={onChange}
                  placeholder="Agent.Invoke"
                />
              )}
            </AgentFormField>

            {showScopes && (
              <>
                <AgentFormField
                  name="identity_required_scopes"
                  label={t("requiredScopes")}
                  defaultValue="user_impersonation"
                  rules={{ required: t("requiredScopeRequired") }}
                >
                  {({ value, onChange, ref, ...control }) => (
                    <Input
                      {...control}
                      ref={ref}
                      value={typeof value === "string" ? value : "user_impersonation"}
                      onChange={onChange}
                    />
                  )}
                </AgentFormField>
                <p className="text-sm text-muted-foreground">{t("delegatedScopesNote")}</p>
              </>
            )}
            <AgentFormField name="enabled" label={t("execution")} defaultValue={true}>
              {({ value, onChange, id }) => (
                <Select
                  items={EXECUTION_OPTIONS.map((option) => ({ value: option.value, label: t(option.labelKey) }))}
                  value={value === false ? "disabled" : "enabled"}
                  onValueChange={(next) => onChange(next === "enabled")}
                >
                  <SelectTrigger id={id}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXECUTION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </AgentFormField>
            <p className="text-sm text-muted-foreground">{t("identityBindingHint")}</p>
          </>
        )}
      </section>
    </>
  );
};
