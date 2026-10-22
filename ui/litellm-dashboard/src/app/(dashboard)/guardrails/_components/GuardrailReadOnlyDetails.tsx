import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_DECISION_THRESHOLD } from "./decision_model/decisionModelQuestion";
import { GuardrailModeRows } from "./GuardrailModeDisplay";
import { GuardrailStreamScopeDetail } from "./StreamScopeFields";
import ToolPermissionRulesEditor, { type ToolPermissionConfig } from "./tool_permission/ToolPermissionRulesEditor";

interface DecisionModelCheckView {
  name: string;
  action?: string;
  threshold?: number;
  instructions?: string;
}

const DecisionModelSection = ({
  decisionModel,
  checks,
}: {
  decisionModel: string;
  checks: DecisionModelCheckView[];
}) => {
  const t = useTranslations("guardrails");
  return (
    <div>
      <p className="font-medium">{t("detail.decisionModel")}</p>
      <div className="font-mono">{decisionModel}</div>
      <p className="mt-2 font-medium">{t("detail.checks")}</p>
      <div className="mt-2 overflow-hidden rounded-lg border border-border">
        <div className="flex border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold">
          <span className="flex-1">{t("detail.check")}</span>
          <span className="w-24 text-right">{t("detail.action")}</span>
          <span className="w-24 text-right">{t("detail.threshold")}</span>
        </div>
        {checks.map((check) => (
          <div key={check.name} className="flex items-center border-b border-border px-4 py-2 text-sm last:border-b-0">
            <span className="flex-1">{check.name.replace(/_/g, " ")}</span>
            <span className="w-24 text-right">
              <Badge variant="secondary">{check.action ?? t("detail.blockAction")}</Badge>
            </span>
            <span className="w-24 text-right">{check.threshold ?? DEFAULT_DECISION_THRESHOLD}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const GuardrailReadOnlyDetails = ({
  guardrailId,
  guardrailName,
  displayName,
  litellmParams,
  streamScope,
  defaultOn,
  piiEntityCount,
  createdAt,
  updatedAt,
  showToolPermission,
  toolPermissionConfig,
}: {
  guardrailId: string;
  guardrailName: string;
  displayName: string;
  litellmParams: {
    mode?: unknown;
    logging_only_scope?: string | null;
    guardrail?: string;
    decision_model?: string;
    checks?: DecisionModelCheckView[];
    logging_only_continue_on_input_failure?: boolean | null;
  };
  streamScope: unknown;
  defaultOn: boolean | undefined;
  piiEntityCount: number;
  createdAt: string;
  updatedAt: string;
  showToolPermission: boolean;
  toolPermissionConfig: ToolPermissionConfig;
}) => {
  const t = useTranslations("guardrails");
  return (
    <div className="space-y-4">
      <div>
        <p className="font-medium">{t("detail.guardrailId")}</p>
        <div className="font-mono">{guardrailId}</div>
      </div>
      <div>
        <p className="font-medium">{t("detail.guardrailName")}</p>
        <div>{guardrailName || t("detail.unnamedGuardrail")}</div>
      </div>
      <div>
        <p className="font-medium">{t("detail.provider")}</p>
        <div>{displayName}</div>
      </div>
      <GuardrailModeRows litellmParams={litellmParams} />
      <GuardrailStreamScopeDetail raw={streamScope} />
      <div>
        <p className="font-medium">{t("detail.defaultOn")}</p>
        <Badge variant={defaultOn ? "secondary" : "outline"}>{defaultOn ? t("yes") : t("no")}</Badge>
      </div>
      {litellmParams.guardrail === "decision_model" && litellmParams.decision_model && (
        <DecisionModelSection decisionModel={litellmParams.decision_model} checks={litellmParams.checks ?? []} />
      )}
      {piiEntityCount > 0 && (
        <div>
          <p className="font-medium">{t("detail.piiProtection")}</p>
          <div className="mt-2">
            <Badge variant="secondary">{t("detail.piiEntities", { count: piiEntityCount })}</Badge>
          </div>
        </div>
      )}
      <div>
        <p className="font-medium">{t("detail.createdAt")}</p>
        <div>{createdAt}</div>
      </div>
      <div>
        <p className="font-medium">{t("detail.lastUpdated")}</p>
        <div>{updatedAt}</div>
      </div>
      {showToolPermission && <ToolPermissionRulesEditor value={toolPermissionConfig} disabled />}
    </div>
  );
};
