"use client";

import { useState, type ReactNode } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { Check, ExternalLink, GitPullRequest, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { useEvalRuns } from "../evals/runs/api";
import {
  evalFilePath,
  evalSnippet,
  githubRunRepository,
  pyprojectSnippet,
  workflowSnippet,
  type ConnectTarget,
} from "../evals/runs/connectSnippets";
import type { EvalRun } from "../evals/runs/types";
import { CodeBlock } from "../onboarding/tracing/TracingSetupCard";
import { useEvalRunRoute } from "../route";
import { useLensTranslate } from "../../../host/useLensTranslate";
import { lensTranslate } from "../../../host/lensTranslate";

function GitHubLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-sm underline underline-offset-4"
    >
      {children}
      <ExternalLink aria-hidden="true" className="size-3" />
    </a>
  );
}

export function WorkflowSetup({ target }: { target: ConnectTarget }) {
  const t = useLensTranslate();
  const files = [
    { path: ".github/workflows/lens.yml", body: workflowSnippet(target) },
    { path: "pyproject.toml", body: pyprojectSnippet(target) },
    { path: evalFilePath(target), body: evalSnippet(target) },
  ];
  const [file, setFile] = useState(files[0].path);
  const shown = files.find((item) => item.path === file) ?? files[0];
  return (
    <div className="min-w-0 space-y-5 text-sm">
      <section className="space-y-3">
        <h3 className="font-medium">{t("agents.addWorkflowEvalAdapter")}</h3>
        <p className="text-muted-foreground">
          {t("agents.mergeFilesRepositoryKeep")}</p>
        <Tabs.Root value={file} onValueChange={setFile} className="min-w-0 overflow-hidden rounded-lg border">
          <Tabs.List aria-label={t("agents.setupFiles")} className="flex overflow-x-auto border-b bg-muted/30">
            {files.map((item) => (
              <Tabs.Tab
                key={item.path}
                type="button"
                value={item.path}
                className={`whitespace-nowrap px-3 py-2 text-xs ${item.path === shown.path ? "bg-background font-medium" : "text-muted-foreground"}`}
              >
                {item.path}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel
            value={shown.path}
            aria-label={shown.path}
            className="min-w-0 [&_pre]:max-h-56 [&_pre]:overflow-auto"
          >
            <CodeBlock code={shown.body} copyLabel={t("agents.copyValue0", { value0: shown.path })} />
          </Tabs.Panel>
        </Tabs.Root>
        {!target.taskImport && (
          <p className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-5">
            {t("agents.implementTaskEvalAdapter")}</p>
        )}
        <p className="text-xs leading-5 text-muted-foreground">
          {t("agents.runAgentBuiltChecked")}{" "}
          <code>{target.definition.spec.agent}</code>{t("agents.buildSHA")}<code>agent.version</code>, and{" "}
          <code>{t("agents.deploymentEnvironmentLensEval")}</code> on its traces.{" "}
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/BerriAI/lens/blob/main/src/sdk/README.md#complete-http-agent-example"
          >
            {t("agents.agentAdapterGuide")}</a>
        </p>
      </section>
      <section className="space-y-3">
        <h3 className="font-medium">{t("agents.addRepositoryCredentials")}</h3>
        <div className="rounded-lg border p-3 text-xs leading-6">
          <p>
            <code className="font-medium">LENS_API_KEY</code> {t("agents.secretLensCredentialRead")}</p>
          <p>
            <code className="font-medium">LENS_BASE_URL</code> variable:{" "}
            <span className="break-all">{target.baseUrl}</span>
          </p>
          <p className="mt-2 text-muted-foreground">
            {t("agents.mapAgentSModel")}{" "}
            {target.reportViaApp
              ? t("agents.lensPublishesCommentsChecks")
              : t("agents.workflowUsesGitHubS")}
          </p>
        </div>
        <CodeBlock
          code={"env:\n  AGENT_API_KEY: ${{ secrets.AGENT_API_KEY }}"}
          copyLabel={t("agents.copyAgentSecretMapping")}
        />
        <div className="flex flex-wrap gap-4">
          <GitHubLink href={`${target.repository?.url}/settings/secrets/actions`}>{t("agents.openRepositorySecrets")}</GitHubLink>
          <GitHubLink href={`${target.repository?.url}/settings/variables/actions`}>
            {t("agents.openRepositoryVariables")}</GitHubLink>
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          {t("agents.organizationMustAllowRepository")}{" "}
          <a
            className="underline"
            target="_blank"
            rel="noreferrer"
            href="https://docs.github.com/en/actions/how-tos/reuse-automations/share-with-your-organization"
          >
            {t("agents.privateActionAccess")}</a>
        </p>
      </section>
      <section className="space-y-2 border-t pt-4">
        <h3 className="font-medium">{t("agents.runBaselineOpenPR")}</h3>
        <p className="text-xs leading-5 text-muted-foreground">
          {t("agents.commitMainRunLens")}</p>
        <GitHubLink href={`${target.repository?.url}/actions/workflows/lens.yml`}>{t("agents.openLensWorkflow")}</GitHubLink>
      </section>
    </div>
  );
}

export function VerifyGitHub({
  target,
  runs,
  onOpenChange,
}: {
  target: ConnectTarget;
  runs: ReturnType<typeof useEvalRuns>;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useLensTranslate();
  const { openAgentRun } = useEvalRunRoute();
  const matching =
    runs.data?.filter(
      (run) =>
        run.agent === target.definition.spec.agent &&
        run.eval === target.definition.name &&
        githubRunRepository(run.ci_url)?.fullName.toLowerCase() === target.repository?.fullName.toLowerCase(),
    ) ?? [];
  const pull = matching.find((run) => run.pr !== null);
  const baseline = matching.find(
    (run) => run.pr === null && run.branch === target.definition.spec.baseline && run.status === "done",
  );
  const received = pull?.status === "done" && Boolean(pull.summary);
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-muted/20 p-5 text-center">
        {received ? (
          <Check aria-hidden="true" className="mx-auto mb-3 size-7 text-success" />
        ) : (
          <GitPullRequest aria-hidden="true" className="mx-auto mb-3 size-7 text-muted-foreground" />
        )}
        <h3 className="font-medium">
          {received
            ? t("agents.pREvalReceived")
            : pull?.status === "failed"
              ? t("agents.pREvalNeedsAttention")
              : t("agents.waitingFirstPREval")}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {pull ? runStatus(pull) : t("agents.openUpdatePRSelected")}
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        {baseline
          ? t("agents.baselineReceivedMain")
          : t("agents.completedMainBaselineReceived")}
      </p>
      {runs.error && (
        <p role="alert" className="text-sm text-destructive">
          {t("agents.couldCheckEvalRuns")}</p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" disabled={runs.isFetching} onClick={() => void runs.refetch()}>
          {runs.isFetching && <Loader2 aria-hidden="true" className="size-4 animate-spin" />} {t("agents.checkPREval")}</Button>
        {pull && (
          <Button
            onClick={() => {
              openAgentRun(target.definition.spec.agent, target.definition.name, pull.id);
              onOpenChange(false);
            }}
          >
            {t("agents.viewEvalResult")}</Button>
        )}
        <GitHubLink href={`${target.repository?.url}/actions/workflows/lens.yml`}>{t("agents.viewWorkflow")}</GitHubLink>
        {pull && <GitHubLink href={`${target.repository?.url}/pull/${pull.pr}`}>{t("agents.openPRValue0", { value0: pull.pr })}</GitHubLink>}
      </div>
      <div className="space-y-2 rounded-lg border p-4 text-xs leading-5 text-muted-foreground">
        <p className="font-medium text-foreground">{t("agents.appearsPR")}</p>
        <p>
          {t("agents.lensPostsEvalResult")}{" "}
          {target.reportViaApp
            ? t("agents.connectedGitHubAppPosts")
            : t("agents.newCommitsUpdateSame")}
        </p>
        <p>
          {t("agents.afterResultArrivesCheck")}</p>
      </div>
    </div>
  );
}

function runStatus(run: EvalRun): string {
  if (run.status === "failed")
    return run.failure || lensTranslate("agents.evalFailedFinishOpen");
  if (run.status !== "done" || !run.summary)
    return lensTranslate("agents.pRValue0Value1Check", { value0: run.pr, value1: run.status });
  return lensTranslate("agents.pRValue0Value1Value2", { value0: run.pr, value1: run.summary.passed, value2: run.summary.total, value3: run.summary.gate.passed ? lensTranslate("agents.gatePassed") : lensTranslate("agents.gateFailedReviewResult") });
}
