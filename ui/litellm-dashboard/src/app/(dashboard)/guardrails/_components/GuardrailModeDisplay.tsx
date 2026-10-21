import { useTranslations } from "next-intl";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatGuardrailMode,
  formatLoggingOnlyScope,
  loggingOnlyContinueFromParams,
  modeIncludesLoggingOnly,
} from "./guardrail_info_helpers";

type GuardrailModeParams = {
  mode?: unknown;
  default_on?: boolean;
  logging_only_scope?: string | null;
  logging_only_continue_on_input_failure?: boolean | null;
};

export const GuardrailModeCard: React.FC<{ litellmParams: GuardrailModeParams }> = ({ litellmParams }) => {
  const t = useTranslations("guardrails");
  const commonT = useTranslations("common");
  return (
    <Card className="block p-6">
      <p>{t("form.modeLabel")}</p>
      <div className="mt-2">
        <h3 className="text-lg font-medium">{formatGuardrailMode(litellmParams.mode, commonT) || "-"}</h3>
        <Badge variant={litellmParams.default_on ? "secondary" : "outline"}>
          {litellmParams.default_on ? t("form.alwaysOnLabel") : t("form.alwaysOffLabel")}
        </Badge>
      </div>
      {modeIncludesLoggingOnly(litellmParams.mode) && (
        <div className="mt-4">
          <p>{t("form.loggingOnlyScopeLabel")}</p>
          <h3 className="text-lg font-medium">{formatLoggingOnlyScope(litellmParams.logging_only_scope)}</h3>
          <p className="mt-2">{t("form.continueAfterFlaggedLabel")}</p>
          <h3 className="text-lg font-medium">
            {loggingOnlyContinueFromParams(litellmParams) ? t("form.onLabel") : t("form.offLabel")}
          </h3>
        </div>
      )}
    </Card>
  );
};

export const GuardrailModeRows: React.FC<{ litellmParams: GuardrailModeParams }> = ({ litellmParams }) => {
  const t = useTranslations("guardrails");
  const commonT = useTranslations("common");
  return (
    <>
      <div>
        <p className="font-medium">{t("form.modeLabel")}</p>
        <div>{formatGuardrailMode(litellmParams.mode, commonT) || "-"}</div>
      </div>
      {modeIncludesLoggingOnly(litellmParams.mode) && (
        <div>
          <p className="font-medium">{t("form.loggingOnlyScopeLabel")}</p>
          <div>{formatLoggingOnlyScope(litellmParams.logging_only_scope)}</div>
          <p className="font-medium">{t("form.continueAfterFlaggedLabel")}</p>
          <div>{loggingOnlyContinueFromParams(litellmParams) ? t("form.onLabel") : t("form.offLabel")}</div>
        </div>
      )}
    </>
  );
};
