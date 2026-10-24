import React, { useId } from "react";
import { useTranslations } from "next-intl";
import { AutoRouterAllowanceNote } from "./AutoRouterAvailability";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ClassifierCircuitBreakerConfig from "./ClassifierCircuitBreakerConfig";
import type { ComplexityRouterConfigValue } from "./ComplexityRouterConfig";
import { defaultJevClassifierConfig, fixedClassifierModels } from "./jev_classifier_config";

const providerDescriptions = {
  jev: "Uses TypeSafe System One Choice evaluation with your configured tiers",
  laya: "Uses Laya with your configured tiers. Set LAYA_API_BASE on the gateway to connect your Laya server.",
  bespoke:
    "Uses Bespoke Nimble with your configured tiers. Set BESPOKE_API_BASE on the gateway to connect your Nimble server.",
  databricks:
    "Uses the Databricks ai_decide AI Function, or a decision serving endpoint you name, with your configured tiers. Set DATABRICKS_API_BASE to https://<workspace-host>/serving-endpoints and DATABRICKS_API_KEY on the gateway.",
};

export default function JevClassifierConfig({
  value,
  onChange,
  section = "all",
}: {
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
  section?: "all" | "model" | "advanced";
}) {
  const t = useTranslations("models.addModel");
  const id = useId();
  const config = value.jev_classifier_config ?? defaultJevClassifierConfig();
  const models = fixedClassifierModels(config.provider);
  const update = (patch: Partial<typeof config>) =>
    onChange({ ...value, jev_classifier_config: { ...config, ...patch } });

  return (
    <div className={section === "model" ? "space-y-3" : "mt-4 space-y-3"}>
      {section !== "advanced" && !config.deployment_name && (
        <>
          <p className="text-sm text-muted-foreground">{t("jevIntro")}</p>
          <div className="space-y-2">
            <Label htmlFor={`${id}-model`}>{t("jevClassifierModelLabel")}</Label>
            <Input
              id={`${id}-model`}
              value={config.model}
              onChange={(event) => update({ model: event.target.value })}
            />
          </div>
        </>
      )}
      {section !== "model" && (
        <>
          <div className="space-y-2">
            <Label htmlFor={`${id}-timeout`}>{t("jevClassifierTimeoutLabel")}</Label>
            <Input
              id={`${id}-timeout`}
              type="number"
              min={1}
              step={1}
              value={config.timeout_ms}
              onChange={(event) => update({ timeout_ms: Number(event.target.value) })}
            />
          </div>
          <ClassifierCircuitBreakerConfig
            value={config}
            onChange={(next) =>
              update({
                circuit_breaker_enabled: next.circuit_breaker_enabled,
                circuit_breaker_cooldown_seconds: next.circuit_breaker_cooldown_seconds,
              })
            }
          />
          <div className="space-y-2">
            <Label htmlFor={`${id}-instructions`}>{t("jevInstructionsLabel")}</Label>
            <AutoRouterAllowanceNote
              feature="tier_or_classifier_prompt"
              label={t("jevAllowanceLabel")}
            />
            <Textarea
              id={`${id}-instructions`}
              value={config.instructions ?? ""}
              placeholder={t("jevInstructionsPlaceholder")}
              onChange={(event) => update({ instructions: event.target.value || undefined })}
            />
            {config.instructions && (
              <Button variant="outline" type="button" onClick={() => update({ instructions: undefined })}>
                {t("jevRestoreInstructions")}
              </Button>
            )}
            <p className="text-xs text-muted-foreground">{t("jevBuiltInNote")}</p>
          </div>
        </>
      )}
    </div>
  );
}
