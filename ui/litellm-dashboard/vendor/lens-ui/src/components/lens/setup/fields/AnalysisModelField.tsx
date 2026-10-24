"use client";

import { Controller, useFormContext } from "react-hook-form";
import { SearchSelect } from "../../../shared/SearchSelect";
import { analysisModelOptions, type ModelGate } from "./analysisModels";
import type { AnalysisModels } from "./useAnalysisModels";
import type { InvestigationInput } from "../investigationSchema";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export interface AnalysisModelFieldProps {
  readonly models: AnalysisModels;
  readonly gate: ModelGate;
  readonly model: string;
}

export function AnalysisModelField({ models, gate, model }: AnalysisModelFieldProps) {
  const t = useLensTranslate();
  const { control } = useFormContext<InvestigationInput>();
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("setup.analysisModel")}</p>
      <Controller
        control={control}
        name="selectedModel"
        render={({ field }) => (
          <SearchSelect
            aria-label={t("setup.analysisModel")}
            options={analysisModelOptions(models.models, models.modelDetails)}
            value={model}
            onValueChange={(value) => field.onChange(value ?? "")}
            placeholder={models.modelsLoading ? t("settings.loadingModels") : t("setup.chooseModel")}
            disabled={models.modelsLoading}
            emptyText={t("setup.matchingAnalysisModelsConfigured")}
          />
        )}
      />
      {models.modelsError && (
        <p role="alert" className="text-sm text-destructive">
          {t("setup.couldLoadModelsValue0", { value0: models.modelsError })}</p>
      )}
      {gate.unavailable && (
        <p role="alert" className="text-sm text-destructive">
          {t("setup.value0LongerAvailableChoose", { value0: model })}</p>
      )}
      {gate.unsupported && (
        <p role="alert" className="text-sm text-destructive">
          {t("setup.chooseChatModelSupports")}</p>
      )}
    </div>
  );
}
