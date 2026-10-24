"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import { money } from "../../model/format";
import { Input } from "../../../ui/input";
import { DurationInput } from "../../../shared/DurationInput";
import type { InvestigationInput } from "../investigationSchema";
import { AnalysisModelField, type AnalysisModelFieldProps } from "./AnalysisModelField";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export function RunFields({ models, gate, model }: AnalysisModelFieldProps) {
  const t = useLensTranslate();
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<InvestigationInput>();
  const [repeat, budget] = useWatch({ control, name: ["repeat", "budget"] });
  return (
    <>
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" className="size-4 rounded border-input accent-foreground" {...register("repeat")} />
          {t("setup.keepWatchingNewTraces")}</label>
        {repeat && (
          <Controller
            control={control}
            name="interval"
            render={({ field }) => (
              <DurationInput label={t("setup.checkEvery")} value={field.value} onChange={field.onChange} base="minutes" />
            )}
          />
        )}
        {errors.interval?.message && (
          <p role="alert" className="text-sm text-destructive">
            {errors.interval.message}
          </p>
        )}
      </div>
      <details open={!gate.modelValid || undefined}>
        <summary className="cursor-pointer text-sm font-medium">{t("setup.advancedOptions")}</summary>
        <div className="mt-4 space-y-5">
          <AnalysisModelField models={models} gate={gate} model={model} />
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid content-start gap-2 text-sm font-medium">
              {t("setup.maximumRunsOptional")}<Input
                {...register("selection.sample_size", {
                  setValueAs: (value: unknown) => (value == null || value === "" ? null : Number(value)),
                })}
                type="number"
                min="1"
                placeholder={t("setup.limit")}
              />
              {errors.selection?.sample_size?.message && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.selection.sample_size.message}
                </p>
              )}
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                {...register("manualSelection", {
                  onChange: () => setValue("selection.execution_ids", [], { shouldValidate: true }),
                })}
              />
              {t("setup.chooseIndividualRuns")}</label>
          </div>
          {errors.selection?.execution_ids?.message && (
            <p role="alert" className="text-sm text-destructive">
              {errors.selection.execution_ids.message}
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid content-start gap-2 text-sm font-medium">
              {t("setup.monthlyLimitUSD")}<Input {...register("budget", { valueAsNumber: true })} type="number" min="0.01" step="1" />
              {errors.budget?.message && (
                <p role="alert" className="text-sm text-destructive">
                  {errors.budget.message}
                </p>
              )}
            </label>
          </div>
        </div>
      </details>
      {gate.modelValid && Number.isFinite(budget) && budget > 0 && (
        <p role="note" aria-label={t("setup.analysisUsage")} className="text-xs leading-5 text-muted-foreground">
          {t("setup.lensSendsSelectedTrace", { value0: model, value1: money(budget) })}</p>
      )}
    </>
  );
}
