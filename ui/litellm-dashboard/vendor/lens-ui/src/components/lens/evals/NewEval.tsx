"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { useDatasets } from "../datasets/api";
import { LensPageHeader } from "../ui/LensPageHeader";
import { buildEvalSpec, EMPTY_DRAFT, type NewEvalDraft } from "./newEvalSpec";
import { useSaveEval } from "./runs/api";
import { useLensTranslate } from "../../../host/useLensTranslate";

export function NewEval({
  onCancel,
  onSaved,
  initialAgent = "",
}: {
  onCancel: () => void;
  onSaved: (name: string) => void;
  initialAgent?: string;
}) {
  const t = useLensTranslate();
  const datasets = useDatasets();
  const save = useSaveEval();
  const [draft, setDraft] = useState<NewEvalDraft>({ ...EMPTY_DRAFT, agent: initialAgent });
  const [error, setError] = useState<string | null>(null);
  const set = (change: Partial<NewEvalDraft>) => setDraft((current) => ({ ...current, ...change }));
  const items = (datasets.data ?? []).map((dataset) => ({
    value: dataset.id,
    label: `${dataset.name}@${dataset.revision}`,
  }));
  const submit = () => {
    const result = buildEvalSpec(draft);
    if (!result.ok) return setError(result.error);
    setError(null);
    save.mutate(result, {
      onSuccess: (saved) => onSaved(saved.name),
      onError: (failure) => setError(failure.message),
    });
  };
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <LensPageHeader
        section={t("evals.06REGRESSIONLAB")}
        title={t("evals.newEval")}
        description={t("evals.turnRealAgentRuns")}
        actions={
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ChevronLeft /> {t("tabs.evals")}</Button>
        }
      />
      <form
        aria-label={t("evals.newEval")}
        className="min-h-0 flex-1 overflow-y-auto"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="mx-auto my-5 grid max-w-3xl gap-4 px-4 text-sm">
          <Section title={t("evals.eval")}>
            <Field label={t("datasets.name")}>
              <Input
                className="font-mono"
                placeholder="agent-regressions"
                value={draft.name}
                onChange={(event) => set({ name: event.target.value })}
              />
            </Field>
            <Field label={t("datasets.dataset")}>
              <Select
                items={items}
                value={draft.datasetId || null}
                onValueChange={(next: string | null) => {
                  const dataset = datasets.data?.find((item) => item.id === next);
                  set({ datasetId: next ?? "", agent: draft.agent || dataset?.agent_name || "" });
                }}
              >
                <SelectTrigger aria-label={t("datasets.dataset")} className="w-full font-mono text-xs">
                  <SelectValue placeholder={datasets.isPending ? t("datasets.loadingDatasets") : t("evals.pickDataset")} />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.value} value={item.value} className="font-mono text-xs">
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label={t("agents.agent")}>
              <Input
                readOnly={Boolean(initialAgent)}
                value={draft.agent}
                onChange={(event) => set({ agent: event.target.value })}
              />
            </Field>
          </Section>
          <Section title={t("evals.scorers")}>
            <Toggle
              label={t("evals.taskCompleted")}
              checked={draft.taskCompleted}
              onChange={(taskCompleted) => set({ taskCompleted })}
            />
            <Toggle label={t("evals.toolOrder")} checked={draft.calledBefore} onChange={(calledBefore) => set({ calledBefore })}>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Input
                  aria-label={t("evals.firstTool")}
                  placeholder="run_tests"
                  value={draft.first}
                  onChange={(event) => set({ first: event.target.value })}
                />
                <span className="text-muted-foreground">before</span>
                <Input
                  aria-label={t("evals.tool")}
                  placeholder="open_pr"
                  value={draft.then}
                  onChange={(event) => set({ then: event.target.value })}
                />
              </div>
            </Toggle>
            <Toggle label={t("evals.lLMJudge")} checked={draft.judge} onChange={(judge) => set({ judge })}>
              <Textarea
                aria-label={t("evals.judgeQuestion")}
                placeholder={t("evals.didAgentCompleteUser")}
                value={draft.prompt}
                onChange={(event) => set({ prompt: event.target.value })}
              />
            </Toggle>
          </Section>
          <Section title={t("evals.gate")}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Field label={t("evals.trials")}>
                <Input
                  inputMode="numeric"
                  value={draft.trials}
                  onChange={(event) => set({ trials: event.target.value })}
                />
              </Field>
              <Field label={t("evals.maxRegressions")}>
                <Input
                  inputMode="numeric"
                  value={draft.regressions}
                  onChange={(event) => set({ regressions: event.target.value })}
                />
              </Field>
              <Field label={t("evals.maxCritical")}>
                <Input
                  inputMode="numeric"
                  value={draft.critical}
                  onChange={(event) => set({ critical: event.target.value })}
                />
              </Field>
              <Field label={t("evals.minPass")}>
                <Input
                  inputMode="decimal"
                  placeholder="off"
                  value={draft.passRate}
                  onChange={(event) => set({ passRate: event.target.value })}
                />
              </Field>
              <Field label={t("evals.maxCase")}>
                <Input
                  inputMode="decimal"
                  placeholder="off"
                  value={draft.costPerCase}
                  onChange={(event) => set({ costPerCase: event.target.value })}
                />
              </Field>
            </div>
          </Section>
          <div className="lens-toolbar flex items-center justify-end gap-2 rounded-xl border px-4 py-3">
            {error && (
              <p role="alert" className="mr-auto text-xs text-destructive">
                {error}
              </p>
            )}
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              {t("datasets.cancel")}</Button>
            <Button type="submit" size="sm" disabled={save.isPending}>
              {t("agents.createEval")}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="lens-panel grid gap-4 rounded-xl border px-5 py-5 [&_input]:bg-background [&_textarea]:bg-background">
      <h3 className="lens-section-label flex items-center gap-2 text-xs font-medium">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--lens-violet)]" />
        {title}
      </h3>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1 text-xs">
      <span className="font-mono text-[11px] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  children,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="grid gap-3 rounded-lg border bg-background/60 p-3">
      <label className="flex items-center gap-2 text-xs">
        <Checkbox checked={checked} onCheckedChange={(next) => onChange(next === true)} />
        {label}
      </label>
      {checked && children && <div className="pl-6">{children}</div>}
    </div>
  );
}
