"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useDatasets } from "../datasets/api";
import { NewEval } from "../evals/NewEval";
import { useEvals, useEvalRuns } from "../evals/runs/api";
import {
  githubRunRepository,
  parseGitHubRepository,
  parseTaskImport,
  type ConnectTarget,
} from "../evals/runs/connectSnippets";
import type { EvalDefinition } from "../evals/runs/types";
import { getRequestBaseUrl } from "../../../lib/http/runtime";
import { VerifyGitHub, WorkflowSetup } from "./GitHubWorkflowSetup";
import { useLensTranslate } from "../../../host/useLensTranslate";

interface GitHubEvalSetupDialogProps {
  readonly agent: string;
  readonly repository?: string;
  readonly definition?: EvalDefinition;
  readonly onOpenChange: (open: boolean) => void;
  readonly onOpenDatasets?: () => void;
}

export function GitHubEvalSetupDialog(props: GitHubEvalSetupDialogProps) {
  const t = useLensTranslate();
  return (
    <Dialog open onOpenChange={props.onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="pr-6">
          <DialogTitle className="flex items-center gap-2">
            <Github aria-hidden="true" className="size-5" /> {t("agents.setUpPREvals")}</DialogTitle>
          <DialogDescription>
            {t("agents.runEvals")}<span className="font-medium text-foreground">{props.agent}</span> {t("agents.pullRequestsGetLens")}</DialogDescription>
        </DialogHeader>
        <GitHubSetup {...props} />
      </DialogContent>
    </Dialog>
  );
}

function GitHubSetup({
  agent,
  repository: connectedRepository,
  definition,
  onOpenChange,
  onOpenDatasets,
}: GitHubEvalSetupDialogProps) {
  const t = useLensTranslate();
  const evals = useEvals();
  const datasets = useDatasets();
  const [step, setStep] = useState<"repository" | "workflow" | "verify">("repository");
  const [creating, setCreating] = useState(false);
  const [repoInput, setRepoInput] = useState<string | null>(connectedRepository ?? null);
  const [evalName, setEvalName] = useState(definition?.name ?? "");
  const [baseUrl, setBaseUrl] = useState(
    () => getRequestBaseUrl() || (typeof window === "undefined" ? "" : window.location.origin),
  );
  const [task, setTask] = useState("");
  const [installCommand, setInstallCommand] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [target, setTarget] = useState<ConnectTarget | null>(null);
  const available = (evals.data ?? []).filter((item) => item.spec.agent === agent);
  const selected = available.find((item) => item.name === evalName) ?? definition ?? available[0];
  const runs = useEvalRuns({
    agent,
    eval: selected?.name,
    include_ci: true,
    limit: 100,
  });
  const observed = runs.data?.map((run) => githubRunRepository(run.ci_url)).find((repo) => repo !== null);
  const repository = repoInput ?? observed?.fullName ?? "";
  const prepare = () => {
    const repo = parseGitHubRepository(repository);
    if (!repo.ok) return setError(repo.error);
    if (!selected) return setError(t("agents.chooseCreateEvalAgent"));
    const dataset = datasets.data?.find((item) => item.id === selected.spec.dataset_id);
    if (!dataset) return setError(t("agents.evalSDatasetUnavailable"));
    const parsedTask = task.trim() ? parseTaskImport(task) : null;
    if (parsedTask && !parsedTask.ok) return setError(parsedTask.error);
    try {
      const url = new URL(baseUrl);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
      ) {
        return setError(
          t("agents.enterReachableHTTPSLens"),
        );
      }
      setTarget({
        definition: selected,
        dataset: dataset.name,
        revision: selected.spec.revision ?? dataset.revision,
        baseUrl: url.href.replace(/\/+$/, ""),
        repository: repo.value,
        taskImport: parsedTask?.ok ? parsedTask.value : undefined,
        installCommand,
        reportViaApp: Boolean(connectedRepository),
      });
      setError(null);
      setStep("workflow");
    } catch {
      setError(t("agents.enterHTTPSAddressLens"));
    }
  };
  if (creating)
    return (
      <NewEval
        initialAgent={agent}
        onCancel={() => setCreating(false)}
        onSaved={(name) => {
          setEvalName(name);
          setCreating(false);
        }}
      />
    );
  return (
    <div className="min-w-0 space-y-5">
      <ol aria-label={t("agents.gitHubSetupProgress")} className="flex items-center gap-3 border-b pb-4 text-xs">
        {(["repository", "workflow", "verify"] as const).map((item, index) => (
          <li
            key={item}
            aria-current={step === item ? "step" : undefined}
            className={`flex items-center gap-2 ${step === item ? "font-medium text-foreground" : "text-muted-foreground"}`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full border ${step === item ? "border-foreground bg-foreground text-background" : ""}`}
            >
              {index + 1}
            </span>
            {
              {
                repository: t("agents.chooseRepository2"),
                workflow: t("agents.setUpWorkflow"),
                verify: t("agents.verifyPREval"),
              }[item]
            }
          </li>
        ))}
      </ol>
      {step === "repository" ? (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            prepare();
          }}
        >
          <Field label={t("agents.gitHubRepository")} id="github-repository">
            <Input
              id="github-repository"
              autoFocus
              placeholder={t("agents.ownerRepositoryGitHubURL")}
              value={repository}
              readOnly={Boolean(connectedRepository)}
              onChange={(event) => setRepoInput(event.target.value)}
              required
            />
          </Field>
          <Field label={t("agents.evalRun")} id="github-eval">
            {evals.isPending ? (
              <p role="status" className="text-sm text-muted-foreground">
                {t("agents.loadingEvals")}</p>
            ) : evals.error ? (
              <p role="alert" className="text-sm text-destructive">
                {t("agents.couldLoadEvals")}{" "}
                <Button type="button" variant="link" onClick={() => void evals.refetch()}>
                  {t("agents.tryAgain")}</Button>
              </p>
            ) : selected ? (
              <Select value={selected.name} onValueChange={(name) => name && setEvalName(name)}>
                <SelectTrigger id="github-eval" className="w-full">
                  <SelectValue>{selected.name}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {available.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-lg border border-dashed p-4 text-sm">
                <p className="font-medium">{t("agents.addEvalValue0", { value0: agent })}</p>
                <p className="mt-1 text-muted-foreground">{t("agents.chooseSavedCasesChecks")}</p>
                {datasets.data?.length ? (
                  <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setCreating(true)}>
                    {t("agents.createEval")}</Button>
                ) : onOpenDatasets ? (
                  <Button type="button" variant="outline" size="sm" className="mt-3" onClick={onOpenDatasets}>
                    {t("agents.createDatasetFirst")}</Button>
                ) : (
                  <p className="mt-2 text-muted-foreground">{t("agents.createDatasetDatasetsReturn")}</p>
                )}
              </div>
            )}
          </Field>
          <Field label={t("agents.lensURL")} id="github-lens-url">
            <Input
              id="github-lens-url"
              type="url"
              placeholder="https://lens.example.com"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {t("agents.useLensAPIAddress")}</p>
          </Field>
          <details className="rounded-lg border p-3 text-sm">
            <summary className="cursor-pointer font-medium">{t("agents.agentRuntime")}</summary>
            <div className="mt-3 space-y-3">
              <Field label={t("agents.existingEvalTaskOptional")} id="github-task">
                <Input
                  id="github-task"
                  placeholder="my_agent.evals:task"
                  value={task}
                  onChange={(event) => setTask(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("agents.asyncPythonFunctionAccepts")}</p>
              </Field>
              <Field label={t("agents.installStartAgentOptional")} id="github-install">
                <Input
                  id="github-install"
                  placeholder="e.g. npm ci"
                  value={installCommand}
                  onChange={(event) => setInstallCommand(event.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {t("agents.runsBeforeEvalGitHub")}</p>
              </Field>
            </div>
          </details>
          {datasets.error && (
            <p role="alert" className="text-sm text-destructive">
              {t("agents.couldLoadDatasets")}{" "}
              <Button type="button" variant="link" onClick={() => void datasets.refetch()}>
                {t("agents.tryAgain")}</Button>
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between gap-4 border-t pt-4">
            <p className="max-w-xs text-xs text-muted-foreground">
              {t("agents.runsRepositorySGitHub")}</p>
            <Button type="submit" disabled={!selected || datasets.isPending || Boolean(evals.error || datasets.error)}>
              {t("agents.continue")}<ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </form>
      ) : (
        target && (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Github aria-hidden="true" className="size-4" />
              <span className="font-medium">{target.repository?.fullName}</span>
              <span className="text-muted-foreground">/ {target.definition.name}</span>
            </div>
            {step === "workflow" ? (
              <WorkflowSetup target={target} />
            ) : (
              <VerifyGitHub target={target} runs={runs} onOpenChange={onOpenChange} />
            )}
            <div className="flex justify-between border-t pt-4">
              <Button variant="ghost" onClick={() => setStep(step === "verify" ? "workflow" : "repository")}>
                <ArrowLeft aria-hidden="true" className="size-4" /> {t("agents.back")}</Button>
              {step === "workflow" && (
                <Button
                  onClick={() => {
                    setStep("verify");
                    void runs.refetch();
                  }}
                >
                  {t("agents.iVeAddedWorkflow")}<ArrowRight aria-hidden="true" className="size-4" />
                </Button>
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}
