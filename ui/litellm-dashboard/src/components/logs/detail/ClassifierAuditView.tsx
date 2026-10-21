import { useTranslations } from "next-intl";
import CopyButton from "@/components/shared/CopyButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReactNode } from "react";
import { JsonViewer } from "./JsonViewer";

interface ClassifierAuditViewProps {
  request: Record<string, unknown>;
  response: unknown;
}

export function ClassifierAuditView({ request, response }: ClassifierAuditViewProps) {
  const t = useTranslations("logs");

  return (
    <div className="mb-6 space-y-4">
      <AuditField title={t("classifierAudit.inputTitle")} value={request.classifier_input}>
        {t("classifierAudit.inputDesc")}
      </AuditField>
      <AuditField title={t("classifierAudit.originatingTitle")} value={request.originating_request_masked}>
        {t("classifierAudit.originatingDesc")}
      </AuditField>
      <AuditField title={t("classifierAudit.responseTitle")} value={response}>
        {t("classifierAudit.responseDesc")}
      </AuditField>
    </div>
  );
}

function AuditField({ title, value, children }: { title: string; value: unknown; children: ReactNode }) {
  const t = useTranslations("logs");
  const serialized = JSON.stringify(value);
  const truncated = serialized?.includes("litellm_truncated") ?? false;

  return (
    <Card size="sm" role="region" aria-label={title}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {value != null && (
          <CopyButton value={JSON.stringify(value, null, 2)} label={t("drawer.copyLabel", { label: title })} />
        )}
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm text-muted-foreground">{children}</p>
        {truncated && (
          <p role="status" className="mb-3 text-sm text-warning">
            {t("classifierAudit.truncated")}
          </p>
        )}
        {value == null ? (
          <p className="text-sm text-muted-foreground">{t("classifierAudit.notCaptured")}</p>
        ) : (
          <JsonViewer data={value} mode="formatted" />
        )}
      </CardContent>
    </Card>
  );
}
