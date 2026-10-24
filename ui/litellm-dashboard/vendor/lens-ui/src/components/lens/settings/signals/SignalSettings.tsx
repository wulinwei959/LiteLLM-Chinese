"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { SetupAgentPrompt } from "../../onboarding/SetupAgentPrompt";

import { SearchSelect } from "../../../shared/SearchSelect";
import { StatusDot } from "../../../shared/StatusDot";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Skeleton } from "../../../ui/skeleton";
import { Textarea } from "../../../ui/textarea";

import { useLensApi } from "../../data/LensServices";
import { lensKeys, lensQueries } from "../../data/queries";
import { SIGNAL_LIBRARY, signalsConfigured, systemOneModels } from "../../model/signals";
import { WatchPicker } from "../../setup/WatchPicker";
import type { SignalConfig } from "../../model/types";
import { SettingsCard, SettingsSection } from "../SettingsSection";
import {
  MAX_SIGNALS,
  configFrom,
  draftFrom,
  draftProblems,
  newRow,
  type SignalDraft,
  type SignalRow,
} from "./signalDraft";
import { useLensTranslate } from "../../../../host/useLensTranslate";

const LIBRARY_QUESTIONS = (): ReadonlySet<string> => new Set(SIGNAL_LIBRARY.map((signal) => signal.question));

export function SignalSettings() {
  const t = useLensTranslate();
  return (
    <SettingsSection
      heading={t("settings.signals")}
      icon={<Flag aria-hidden="true" className="size-4" />}
      description={t("settings.setOnceEveryTrace")}
    >
      <SignalConfigLoader />
    </SettingsSection>
  );
}

function SignalConfigLoader() {
  const t = useLensTranslate();
  const api = useLensApi();
  const config = useQuery(lensQueries.signalConfig(api));
  if (config.error)
    return (
      <p role="alert" className="text-sm text-destructive">
        {t("settings.couldLoadSignalsValue0", { value0: config.error.message })}</p>
    );
  if (!config.data) return <Skeleton aria-label={t("settings.loadingSignals")} className="h-40 w-full" />;
  return <SignalForm saved={config.data} />;
}

const FieldError = ({ children }: { children?: string }) =>
  children ? <p className="mt-1 text-xs text-destructive">{children}</p> : null;

function SetupCallout({ hasModels }: { hasModels: boolean }) {
  const t = useLensTranslate();
  return (
    <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
      <Flag aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="space-y-1">
        <p className="font-medium">{t("settings.chooseSystem1Model")}</p>
        {hasModels ? (
          <p className="text-xs text-muted-foreground">{t("settings.pickOneEvaluationModels")}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {t("settings.addEvaluationProviderLens")}{" "}
            <a
              href="https://github.com/BerriAI/lens/blob/main/docs/signals.md"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-foreground underline underline-offset-2"
            >
              {t("settings.configureSignals")}</a>
          </p>
        )}
      </div>
    </div>
  );
}

function SignalFields({
  row,
  problems,
  onChange,
  onRemove,
}: {
  row: SignalRow;
  problems?: { name?: string; question?: string };
  onChange: (row: SignalRow) => void;
  onRemove: () => void;
}) {
  const t = useLensTranslate();
  const label = row.name.trim() || t("settings.newSignal");
  return (
    <li className="grid gap-2 rounded-lg border border-[var(--lens-violet)]/20 bg-background/60 p-3 sm:grid-cols-[200px_minmax(0,1fr)_auto]">
      <div>
        <Input
          aria-label={t("settings.signalName")}
          placeholder={t("model.userFrustration")}
          value={row.name}
          aria-invalid={Boolean(problems?.name)}
          onChange={(event) => onChange({ ...row, name: event.target.value })}
        />
        <FieldError>{problems?.name}</FieldError>
      </div>
      <div>
        <Textarea
          aria-label={t("settings.questionValue0", { value0: label })}
          placeholder={t("settings.userShowFrustrationAgent")}
          rows={2}
          value={row.question}
          aria-invalid={Boolean(problems?.question)}
          onChange={(event) => onChange({ ...row, question: event.target.value })}
        />
        <FieldError>{problems?.question}</FieldError>
      </div>
      <Button variant="ghost" size="icon-sm" aria-label={t("settings.removeValue0", { value0: label })} onClick={onRemove}>
        <Trash2 aria-hidden="true" />
      </Button>
    </li>
  );
}

export function SignalForm({ saved }: { saved: SignalConfig }) {
  const t = useLensTranslate();
  const api = useLensApi();
  const queryClient = useQueryClient();
  const modelId = useId();
  const thresholdId = useId();
  const [draft, setDraft] = useState<SignalDraft>(() => draftFrom(saved));
  const [draftBase, setDraftBase] = useState<SignalConfig>(() => saved);
  const [savedElsewhere, setSavedElsewhere] = useState(false);
  const savedKey = JSON.stringify(saved);
  const draftBaseKey = JSON.stringify(draftBase);
  if (savedKey !== draftBaseKey) {
    const draftIsDirty = JSON.stringify(configFrom(draft)) !== JSON.stringify(configFrom(draftFrom(draftBase)));
    setDraftBase(saved);
    if (draftIsDirty) {
      setSavedElsewhere(true);
    } else {
      setDraft(draftFrom(saved));
      setSavedElsewhere(false);
    }
  }
  const details = useQuery(lensQueries.modelDetails(api));
  const models = systemOneModels(details.data?.data ?? []);
  const options = models.map((info) => ({
    value: info.model_group,
    label: info.model_group,
    sublabel: info.providers.join(", "),
  }));
  const problems = draftProblems(draft);
  const next = configFrom(draft);
  const dirty = JSON.stringify(next) !== JSON.stringify(configFrom(draftFrom(draftBase)));
  const save = useMutation({
    mutationFn: (config: SignalConfig) => api.saveSignalConfig(config),
    onSuccess: (config) => {
      queryClient.setQueryData(lensKeys.signalConfig(api.scope), config);
      setDraft(draftFrom(config));
      setDraftBase(config);
      setSavedElsewhere(false);
      void queryClient.invalidateQueries({ queryKey: ["traceSignals"] });
    },
  });
  const setRows = (rows: readonly SignalRow[]) => setDraft((current) => ({ ...current, rows }));
  const addRow = () => setRows([...draft.rows, newRow(crypto.randomUUID())]);
  const active = signalsConfigured(saved);
  const custom = draft.rows.filter((row) => !LIBRARY_QUESTIONS().has(row.question));
  const picked = new Set(
    SIGNAL_LIBRARY.filter((signal) => draft.rows.some((row) => row.question === signal.question)).map(
      (signal) => signal.id,
    ),
  );
  const pick = (next: ReadonlySet<string>) =>
    setRows([
      ...SIGNAL_LIBRARY.filter((signal) => next.has(signal.id)).map(
        (signal) =>
          draft.rows.find((row) => row.question === signal.question) ?? {
            key: crypto.randomUUID(),
            id: draft.rows.some((row) => row.id === signal.id) ? "" : signal.id,
            name: signal.name,
            question: signal.question,
          },
      ),
      ...custom,
    ]);
  const loadLatest = () => {
    setDraft(draftFrom(saved));
    setDraftBase(saved);
    setSavedElsewhere(false);
  };

  return (
    <>
      <SettingsCard className="space-y-4">
        <SetupAgentPrompt goal="signals" featureConfigured={active} />
        <p
          role="status"
          className="inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 font-mono text-xs"
        >
          <StatusDot state={active ? "ok" : "off"} />
          {active ? t("settings.flaggingTracesValue0", { value0: saved.model }) : t("settings.signalsOff")}
        </p>
        {!saved.model && !details.isPending && <SetupCallout hasModels={models.length > 0} />}
        {savedElsewhere && (
          <div role="alert" className="flex items-center justify-between gap-3 rounded-md border p-3 text-sm">
            <span>{t("settings.signalsChangedElsewhere")}</span>
            <Button type="button" variant="outline" size="sm" onClick={loadLatest}>
              {t("settings.loadLatest")}</Button>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
          <div className="space-y-1.5">
            <label htmlFor={modelId} className="font-mono text-xs font-medium">
              {t("settings.system1Model")}</label>
            <SearchSelect
              inputId={modelId}
              aria-label={t("settings.system1Model")}
              options={options}
              value={draft.model}
              onValueChange={(value) => setDraft((current) => ({ ...current, model: value ?? "" }))}
              placeholder={details.isPending ? t("settings.loadingModels") : t("settings.chooseASystem1Model")}
              disabled={details.isPending}
              emptyText={t("settings.evaluationModelsConfiguredLens")}
              allowClear
            />
            <p className="text-xs text-muted-foreground">{t("settings.evaluationModelsConfiguredForLensSuchAsTypeSafe")}</p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={thresholdId} className="font-mono text-xs font-medium">
              {t("settings.flagScore")}</label>
            <div className="flex items-center gap-1.5">
              <Input
                id={thresholdId}
                type="number"
                inputMode="numeric"
                min={5}
                max={95}
                step={5}
                value={Number.isNaN(draft.thresholdPercent) ? "" : draft.thresholdPercent}
                aria-invalid={Boolean(problems.threshold)}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, thresholdPercent: event.target.valueAsNumber }))
                }
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
            <FieldError>{problems.threshold}</FieldError>
          </div>
        </div>
        <div className="space-y-4 border-t border-border pt-4">
          <WatchPicker
            label={t("settings.flagRuns")}
            options={SIGNAL_LIBRARY}
            selected={picked}
            onChange={pick}
            onAddCustom={addRow}
            addDisabled={draft.rows.length >= MAX_SIGNALS}
          />
          {custom.length > 0 && (
            <ul aria-label={t("settings.customSignals")} className="space-y-2">
              {custom.map((row) => (
                <SignalFields
                  key={row.key}
                  row={row}
                  problems={problems.rows.get(row.key)}
                  onChange={(changed) => setRows(draft.rows.map((other) => (other.key === row.key ? changed : other)))}
                  onRemove={() => setRows(draft.rows.filter((other) => other.key !== row.key))}
                />
              ))}
            </ul>
          )}
          {draft.rows.length === 0 && (
            <p className="text-xs text-muted-foreground">{t("settings.pickLeastOneSignal")}</p>
          )}
          <FieldError>{problems.signals}</FieldError>
        </div>
        <p className="text-xs text-muted-foreground">
          {t("settings.lensSendsTraceContent")}</p>
        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          {save.error && (
            <p role="alert" className="text-sm text-destructive">
              {t("settings.couldSaveSignalsValue0", { value0: save.error.message })}</p>
          )}
          {save.isSuccess && !dirty && <p className="text-xs text-muted-foreground">{t("settings.saved")}</p>}
          <Button disabled={!dirty || problems.any || save.isPending} onClick={() => save.mutate(next)}>
            {save.isPending ? t("settings.saving") : t("settings.saveSignals")}
          </Button>
        </div>
      </SettingsCard>
    </>
  );
}
