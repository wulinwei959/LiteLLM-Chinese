import React from "react";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  classificationFrequency,
  withClassificationFrequency,
  effectiveClassifierType,
  usesLlmClassifier,
  DEFAULT_CLASSIFIER_TIMEOUT_MS,
  type ComplexityRouterConfigValue,
  type ClassificationFrequency,
} from "./ComplexityRouterConfig";
import { restrictionReason, restrictedBy } from "./TierRestrictions";

const FREQUENCY_DESCRIPTION_KEYS = {
  every_request: "frequencyEveryRequestDescription",
  user_turn: "frequencyUserTurnDescription",
  session: "frequencySessionDescription",
} as const;

export default function ClassifierPrimarySettings({
  value,
  onChange,
  modelOptions,
  showValidationErrors = false,
  section = "all",
}: {
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
  modelOptions: { value: string; label: string }[];
  showValidationErrors?: boolean;
  section?: "all" | "judge" | "frequency";
}) {
  const id = React.useId();
  const t = useTranslations("models.addModel");
  const restriction = restrictedBy(value, "sessionAffinity");
  const frequency = classificationFrequency(value);
  const frequencyDescription = t(FREQUENCY_DESCRIPTION_KEYS[frequency]);
  const usesJudge = usesLlmClassifier(effectiveClassifierType(value));
  const missingJudge = showValidationErrors && usesJudge && !value.classifier_llm_config?.model;
  return (
    <div
      className={
        {
          all: "mb-6 grid gap-4 sm:grid-cols-2",
          frequency: "mb-6 grid gap-4",
          judge: "grid gap-4",
        }[section]
      }
    >
      {section !== "judge" && (
        <div className="space-y-2">
          <Label htmlFor={`${id}-frequency`}>{t("howOftenToClassify")}</Label>
          <Select
            items={[
              { value: "every_request", label: t("frequencyEveryRequest") },
              { value: "user_turn", label: t("frequencyUserTurn") },
              { value: "session", label: t("frequencySession") },
            ]}
            value={frequency}
            onValueChange={(frequency) => {
              if (frequency) onChange(withClassificationFrequency(value, frequency as ClassificationFrequency));
            }}
          >
            <SelectTrigger id={`${id}-frequency`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="every_request">{t("frequencyEveryRequest")}</SelectItem>
              <SelectItem value="user_turn">{t("frequencyUserTurn")}</SelectItem>
              <SelectItem value="session" disabled={Boolean(restriction)}>
                {t("frequencySession")}
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">{restrictionReason(t, restriction) ?? frequencyDescription}</p>
        </div>
      )}
      {section !== "frequency" && usesJudge && (
        <div className="space-y-2">
          <Label htmlFor={`${id}-judge`}>{t("judgeModel")}</Label>
          <SearchSelect
            inputId={`${id}-judge`}
            aria-label={t("judgeModel")}
            options={modelOptions}
            value={value.classifier_llm_config?.model ?? ""}
            placeholder={t("selectJudgeModel")}
            allowClear={false}
            className={missingJudge ? "border-destructive" : undefined}
            onValueChange={(model) => {
              if (!model || model === value.classifier_llm_config?.model) return;
              onChange({
                ...value,
                classifier_llm_config: {
                  ...value.classifier_llm_config,
                  model,
                  timeout_ms: value.classifier_llm_config?.timeout_ms ?? DEFAULT_CLASSIFIER_TIMEOUT_MS,
                  reasoning_effort: undefined,
                },
              });
            }}
          />
          {missingJudge && (
            <p role="alert" className="text-xs text-destructive">
              {t("judgeModelRequired")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
