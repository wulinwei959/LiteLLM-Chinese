"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { SearchSelect } from "@/components/shared/SearchSelect";
import type { LensTranslator } from "@/lib/i18n/translators";
import { DurationInput } from "./DurationInput";
import { ActivityScope, type ActivitySelection } from "./ActivityScope";
import { analysisModelOptions, normalizeFilters, type AnalysisModelInfo, type Settings } from "./lensData";

function validateSample(selection: ActivitySelection, t: LensTranslator) {
  const hours = selection.lookback_hours ?? 24;
  if (!Number.isInteger(hours) || hours < 1 || hours > 8760) throw new Error(t("chooseTimeRange"));
  const percent = selection.sample_percent ?? 100;
  if (!Number.isFinite(percent) || percent <= 0 || percent > 100) throw new Error(t("chooseSamplingPercent"));
  if (selection.sample_size != null && (!Number.isInteger(selection.sample_size) || selection.sample_size < 1))
    throw new Error(t("choosePositiveMax"));
}

function newCheck(instruction = ""): Settings["checks"][number] {
  return { id: crypto.randomUUID(), instruction, enabled: true };
}

export function LensSetup({
  initial,
  mode = initial ? "edit" : "new",
  models,
  modelDetails = [],
  modelsLoading = false,
  modelsError,
  defaultModel,
  defaultSource = "traces",
  accessToken,
  ready = true,
  onClose,
  onSave,
}: {
  initial?: Settings;
  mode?: "new" | "edit" | "duplicate";
  models: string[];
  modelDetails?: AnalysisModelInfo[];
  modelsLoading?: boolean;
  modelsError?: string;
  defaultModel?: string;
  defaultSource?: Settings["source"];
  accessToken: string;
  ready?: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => Promise<void>;
}) {
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const [step, setStep] = useState(0);
  const [previewReady, setPreviewReady] = useState(false);
  const [manualSelection, setManualSelection] = useState(!!initial?.execution_ids?.length);
  const [name, setName] = useState(initial?.name ?? "");
  const initialSelection: Required<ActivitySelection> = {
    source: initial?.source ?? defaultSource,
    service: initial?.service ?? "",
    agent_name: initial?.agent_name ?? "",
    filters: initial?.filters ?? [],
    lookback_hours: initial?.lookback_hours ?? 24,
    sample_size: initial?.sample_size ?? null,
    sample_percent: initial?.sample_percent ?? 100,
    team_id: initial?.team_id ?? "",
    execution_ids: initial?.execution_ids ?? [],
  };
  const [selection, setSelection] = useState(initialSelection);
  const [context, setContext] = useState(initial?.context ?? "");
  const [questions, setQuestions] = useState(() => (initial?.checks?.length ? initial.checks : [newCheck()]));
  const [selectedModel, setModel] = useState<string | null>(initial?.model ?? null);
  const model = selectedModel ?? defaultModel ?? "";
  const [budget, setBudget] = useState(initial?.monthly_budget ?? 100);
  const [repeat, setRepeat] = useState(mode === "edit" && !!initial?.enabled);
  const [interval, setInterval] = useState(initial?.interval_minutes ?? 30);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const filledChecks = questions.filter((check) => check.instruction.trim());
  const suggestedName = filledChecks[0]?.instruction.trim() || context.trim().split("\n")[0] || t("investigation");
  const title = name.trim() || suggestedName.slice(0, 100);
  const changeSelection = (next: ActivitySelection) => {
    const pool = (s: ActivitySelection) =>
      JSON.stringify([s.source, s.service, s.agent_name, s.filters, s.lookback_hours, s.team_id]);
    setSelection({
      ...selection,
      ...next,
      execution_ids: pool(next) === pool(selection) ? next.execution_ids ?? [] : [],
    });
  };
  const validate = () => {
    normalizeFilters(selection.filters ?? [], t);
    if (step >= 2 && manualSelection && !selection.execution_ids?.length) throw new Error(t("chooseAtLeastOneRun"));
    validateSample(selection, t);
    if (step >= 1 && !context.trim() && !filledChecks.length) throw new Error(t("describeExpectedBehavior"));
    if (filledChecks.some((check) => check.instruction.trim().length < 3)) throw new Error(t("minThreeChars"));
  };
  const next = () => {
    try {
      validate();
      setError("");
      setStep(step + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("checkYourSettings"));
    }
  };
  const save = async () => {
    setBusy(true);
    setError("");
    try {
      validate();
      const settings: Settings = {
        ...initial,
        ...selection,
        name: title,
        context: context.trim(),
        model,
        monthly_budget: budget,
        enabled: repeat,
        interval_minutes: interval,
        concurrency: initial?.concurrency ?? 8,
        filters: normalizeFilters(selection.filters ?? [], t),
        checks: filledChecks.map((check) => ({ ...check, instruction: check.instruction.trim() })),
      };
      await onSave(settings);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("couldNotSaveInvestigation"));
    } finally {
      setBusy(false);
    }
  };
  const unsupported = modelDetails.some((m) => m.model_group === model && m.mode && m.mode !== "chat");
  const budgetValid = Number.isFinite(budget) && budget > 0 && budget <= 100000;
  const canRun = ready || mode === "edit";
  const modelsReady = !modelsLoading && !modelsError;
  const unavailable = !!model && modelsReady && !models.includes(model);
  const supported = !unsupported && !unavailable;
  const preservingSavedModel = mode === "edit" && model === initial?.model;
  const modelReady = modelsReady || preservingSavedModel;
  const modelValid = !!model && supported && modelReady;
  const intervalRangeValid = interval >= 1 && interval <= 10080;
  const intervalValid = !repeat || (Number.isInteger(interval) && intervalRangeValid);
  const configurationValid = modelValid && budgetValid && intervalValid;
  const runReady = canRun && (mode === "edit" || previewReady);
  const selectionValid = !manualSelection || !!selection.execution_ids?.length;
  const validSettings = configurationValid && selectionValid;
  const canSave = !busy && runReady && validSettings;
  const createLabel = repeat ? t("runAndMonitor") : t("runInvestigation");
  const saveLabel = mode === "edit" ? t("saveChanges") : createLabel;
  const headings = [
    t("headingActivity"),
    t("headingLookFor"),
    mode === "edit" ? t("headingReviewChanges") : t("headingReady"),
  ];
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        className={`flex max-h-[90dvh] flex-col gap-6 overflow-hidden ${step === 2 ? "sm:max-w-3xl" : "sm:max-w-xl"}`}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{headings[step]}</DialogTitle>
          <DialogDescription className="sr-only">
            {[t("step0Desc"), t("step1Desc"), t("step2Desc")][step]}
          </DialogDescription>
        </DialogHeader>
        <nav aria-label={t("investigationSetup")} className="flex gap-2 text-xs">
          {[t("tabActivity"), t("tabExpectations"), t("tabRun")].map((label, index) => (
            <button
              key={label}
              disabled={index > step || busy}
              aria-current={index === step ? "step" : undefined}
              onClick={() => {
                setStep(index);
                setError("");
              }}
              className={`flex-1 border-t-2 pt-2 text-left ${index === step ? "border-foreground font-medium" : "border-border text-muted-foreground"}`}
            >
              {index + 1}. {label}
            </button>
          ))}
        </nav>
        <div className="min-h-0 overflow-y-auto pr-1 space-y-5">
          {(step === 0 || step === 2) && (
            <ActivityScope
              key={step}
              value={selection}
              onChange={changeSelection}
              accessToken={accessToken}
              nameField={
                step === 0 ? (
                  <label className="grid gap-2 text-sm font-medium">
                    {t("investigationName")}
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("investigationNamePlaceholder")}
                      maxLength={100}
                    />
                  </label>
                ) : undefined
              }
              mode={step === 0 ? "scope" : "activity"}
              onPreviewReady={setPreviewReady}
              manualSelection={manualSelection}
            />
          )}
          {step === 1 && (
            <>
              <label className="grid gap-2 text-sm font-medium">
                {t("whatShouldAgentDo")}
                <Textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  maxLength={6000}
                  rows={4}
                  placeholder={t("agentDoPlaceholder")}
                />
              </label>
              <fieldset className="space-y-3">
                <legend className="mb-2 text-sm font-medium">{t("whatToLookFor")}</legend>
                {questions.map((check, index) => (
                  <div key={check.id} className="flex items-start gap-2">
                    <Textarea
                      aria-label={t("checkAria", { index: index + 1 })}
                      value={check.instruction}
                      onChange={(event) =>
                        setQuestions(
                          questions.map((item) =>
                            item.id === check.id ? { ...item, instruction: event.target.value } : item,
                          ),
                        )
                      }
                      rows={2}
                      placeholder={t("checkPlaceholder")}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={t("removeCheckAria", { index: index + 1 })}
                      onClick={() => setQuestions(questions.filter((item) => item.id !== check.id))}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => setQuestions([...questions, newCheck()])}>
                  <Plus className="size-3.5" /> {t("addCheck")}
                </Button>
              </fieldset>
              {(!context.trim() || !filledChecks.length) && (
                <Button
                  variant="link"
                  className="h-auto px-0"
                  onClick={() => {
                    if (!context.trim()) setContext(t("exampleContext"));
                    if (!filledChecks.length)
                      setQuestions([newCheck(t("exampleCheck1")), newCheck(t("exampleCheck2"))]);
                  }}
                >
                  {t("useAnExample")}
                </Button>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <details open={!modelValid || undefined}>
                <summary className="cursor-pointer text-sm font-medium">{t("advancedOptions")}</summary>
                <div className="mt-4 space-y-5">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{t("analysisModel")}</p>
                    <SearchSelect
                      aria-label={t("analysisModel")}
                      options={analysisModelOptions(models, modelDetails, t)}
                      value={model}
                      onValueChange={(value) => setModel(value ?? "")}
                      placeholder={modelsLoading ? t("loadingModels") : t("chooseAModel")}
                      disabled={modelsLoading}
                      emptyText={t("noMatchingModels")}
                    />
                    {modelsError && (
                      <p role="alert" className="text-sm text-destructive">
                        {t("couldNotLoadModels", { error: modelsError })}
                      </p>
                    )}
                    {unavailable && (
                      <p role="alert" className="text-sm text-destructive">
                        {t("modelUnavailable", { model })}
                      </p>
                    )}
                    {unsupported && (
                      <p role="alert" className="text-sm text-destructive">
                        {t("chooseChatModel")}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid content-start gap-2 text-sm font-medium">
                      {t("maximumRunsOptional")}
                      <Input
                        type="number"
                        min="1"
                        placeholder={t("noLimit")}
                        value={selection.sample_size ?? ""}
                        onChange={(event) =>
                          setSelection({
                            ...selection,
                            sample_size: event.target.value ? Number(event.target.value) : null,
                          })
                        }
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={manualSelection}
                        onChange={(event) => {
                          setManualSelection(event.target.checked);
                          setSelection({ ...selection, execution_ids: [] });
                        }}
                      />
                      {t("chooseIndividualRuns")}
                    </label>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid content-start gap-2 text-sm font-medium">
                      {t("monthlyLimitUsd")}
                      <Input
                        type="number"
                        min="0.01"
                        max="100000"
                        step="1"
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                      />
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                          type="checkbox"
                          checked={repeat}
                          onChange={(e) => setRepeat(e.target.checked)}
                          className="size-4 rounded border-input accent-foreground"
                        />
                        {t("repeatInvestigation")}
                      </label>
                      {repeat && (
                        <DurationInput
                          label={t("repeatEvery")}
                          value={interval}
                          onChange={setInterval}
                          base="minutes"
                          max={10080}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </details>
            </>
          )}
          {!ready && mode !== "edit" && (
            <p role="status" className="text-sm text-amber-700">
              {t("workerUnavailableDraft")}
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        <DialogFooter className="border-t pt-4">
          <Button variant="outline" disabled={busy} onClick={() => (step ? setStep(step - 1) : onClose())}>
            {step ? commonT("back") : commonT("cancel")}
          </Button>
          {step < 2 ? (
            <Button onClick={next}>{commonT("continue")}</Button>
          ) : (
            <Button disabled={!canSave} onClick={() => void save()}>
              {busy ? t("saving") : saveLabel}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
