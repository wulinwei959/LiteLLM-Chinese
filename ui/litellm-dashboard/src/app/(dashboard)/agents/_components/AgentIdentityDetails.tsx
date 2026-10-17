import React from "react";
import { useTranslations } from "next-intl";
import type { components } from "@/lib/http/schema";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/components/networking";
import { Button } from "@/components/ui/button";
import { readAgentIdentity } from "./agent_identity";

type IdentityTranslator = ReturnType<typeof useTranslations<"agents.identity">>;

const authenticationMessage = (t: IdentityTranslator, error: boolean, lastAuthenticated?: string | null): string => {
  if (error) return t("authEvidenceFailed");
  if (lastAuthenticated) return t("lastAuthenticated", { timestamp: new Date(lastAuthenticated).toLocaleString() });
  return t("awaitingAuth");
};

export const AgentIdentityDetails = ({
  agentId,
  identity: value,
  accessToken,
  isAdmin,
}: {
  agentId: string;
  identity: unknown;
  accessToken: string | null;
  isAdmin: boolean;
}) => {
  const t = useTranslations("agents.identity");
  const commonT = useTranslations("common");
  const identity = readAgentIdentity(value);
  const { data, isError, isFetching, refetch } = useQuery({
    queryKey: ["agent-identity", agentId, identity],
    queryFn: () =>
      apiClient.get<components["schemas"]["ManagedAgentIdentityStatus"]>(
        `/v1/agents/${encodeURIComponent(agentId)}/identity`,
        {
          accessToken: accessToken ?? "",
        },
      ),
    enabled: Boolean(isAdmin && accessToken && identity),
  });

  if (!identity || !isAdmin) return null;
  const executionLabel = data?.enabled ? commonT("enabled") : commonT("disabled");
  return (
    <section aria-label={t("sectionAria")} className="mb-6 space-y-2 rounded-lg border border-border p-4">
      <h3 className="font-medium">{t("heading")}</h3>
      <p className="text-sm">
        {t("tenantLabel")}: <span className="font-mono">{identity.tenant_id}</span>
      </p>
      <>
        <p className="text-sm">
          {t("appIdLabel")}: <span className="font-mono">{identity.client_id}</span>
        </p>
        <p className="text-sm">
          {t("servicePrincipalLabel")}: {identity.service_principal_id || t("notConfigured")}
        </p>
      </>
      <p className="text-sm">
        {t("executionModeLine", {
          execution: data ? executionLabel : t("loadingValue"),
          mode: data?.execution_mode ?? t("loadingValue"),
        })}
      </p>
      <p className="text-sm">
        {data?.identity?.active === false
          ? t("identityUnbound")
          : authenticationMessage(t, isError, data?.last_authenticated_at)}
      </p>
      <p className="text-xs text-muted-foreground">{t("evidenceNote")}</p>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={() => {
            void refetch();
          }}
        >
          {t("refreshButton")}
        </Button>
        <a className="text-sm underline" href="/ui/logs/">
          {t("viewLogsLink")}
        </a>
      </div>
    </section>
  );
};
