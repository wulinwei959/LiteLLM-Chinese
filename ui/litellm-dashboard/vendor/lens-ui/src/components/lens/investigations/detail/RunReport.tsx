"use client";

import {
  ChevronRight,
  CircleStop,
  ListChecks,
  Play,
  Plug,
  RefreshCw,
  Repeat,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "../../../ui/button";
import { cn } from "../../../../lib/cva.config";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../../ui/collapsible";
import { useNow } from "../../../../hooks/useNow";

import { analysisElapsed } from "../../model/progress";
import { money } from "../../model/format";
import { modelsUsed, shortTime, windowLabel } from "../../model/inbox";
import {
  NEXT_ACTION,
  openIssues,
  runSituation,
  type RunAction,
  type RunSituation,
  type SituationInput,
} from "../../model/runSituation";
import type { Finding, Job, Lens } from "../../model/types";
import { activeJob, failedTaskSummary } from "../../model/status";
import { InvestigationProgress } from "../InvestigationProgress";
import type { QueueContext } from "../useQueueReason";
import { StepFeed } from "../StepFeed";
import { useLensTranslate } from "../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../host/lensTranslate";

export type RunActionHandlers = Record<RunAction, () => void>;

export interface RunReportProps {
  readonly lens: Lens;
  readonly job: Job | undefined;
  readonly findings: readonly Finding[] | null | undefined;
  readonly connected: boolean;
  readonly ready: boolean;
  readonly busy: boolean;
  readonly picker: ReactNode;
  readonly actions?: RunActionHandlers;
  readonly queue?: QueueContext;
}

interface Facts {
  readonly runs: string;
  readonly found: string;
  readonly openIssues: number;
  readonly reused: number;
}

type Tone = "info" | "success" | "warning" | "destructive" | "muted";

interface SituationView {
  readonly status: string;
  readonly tone: Tone;
  readonly headline: (facts: Facts) => string;
  readonly body: "progress" | "error" | "partial" | null;
}

const completed = ({ found, runs, reused }: Facts) => {
  if (found) return lensTranslate("investigations.foundValue0AcrossValue1", { value0: found, value1: runs });
  if (reused) return lensTranslate("investigations.reusedValue0NewFindings", { value0: plural(reused, "review") });
  return lensTranslate("investigations.nothingFoundAcrossValue0", { value0: runs });
};

const SITUATIONS: Record<RunSituation, SituationView> = {
  never: { get status() { return lensTranslate("investigations.runYet"); }, tone: "muted", headline: () => lensTranslate("investigations.runGetFirstReport"), body: null },
  queued: {
    get status() { return lensTranslate("investigations.queued"); },
    tone: "info",
    headline: () => lensTranslate("investigations.waitingAnalyzerPickUp"),
    body: "progress",
  },
  running: { get status() { return lensTranslate("investigations.running"); }, tone: "info", headline: () => lensTranslate("investigations.investigatingNow"), body: "progress" },
  budget: {
    get status() { return lensTranslate("investigations.stopped"); },
    tone: "destructive",
    headline: () => lensTranslate("investigations.stoppedMoreInvestigationBudget"),
    body: "error",
  },
  offline: {
    get status() { return lensTranslate("investigations.failed"); },
    tone: "destructive",
    headline: () => lensTranslate("investigations.stoppedAnalyzerConnected"),
    body: "error",
  },
  failed: { get status() { return lensTranslate("investigations.failed"); }, tone: "destructive", headline: () => lensTranslate("investigations.stoppedBeforeFinished"), body: "error" },
  cancelled: {
    get status() { return lensTranslate("investigations.cancelled"); },
    tone: "muted",
    headline: ({ runs }) => lensTranslate("investigations.cancelledAfterReviewingValue0", { value0: runs }),
    body: "error",
  },
  partial: {
    get status() { return lensTranslate("investigations.partialResults"); },
    tone: "warning",
    headline: (known) => (known.found ? completed(known) : lensTranslate("investigations.stoppedAfterReviewingValue0", { value0: known.runs })),
    body: "partial",
  },
  unknown: { get status() { return lensTranslate("investigations.completed"); }, tone: "success", headline: ({ runs }) => lensTranslate("investigations.reviewedValue0", { value0: runs }), body: null },
  issues: { get status() { return lensTranslate("investigations.completed"); }, tone: "success", headline: completed, body: null },
  watching: { get status() { return lensTranslate("investigations.completed"); }, tone: "success", headline: completed, body: null },
  clean: { get status() { return lensTranslate("investigations.completed"); }, tone: "success", headline: completed, body: null },
};

interface ActionView {
  readonly label: (facts: Facts) => string;
  readonly icon: LucideIcon;
  readonly variant: ComponentProps<typeof Button>["variant"];
  readonly needsReady: boolean;
}

const ACTIONS: Record<RunAction, ActionView> = {
  run: { label: () => lensTranslate("investigations.runNow"), icon: Play, variant: "default", needsReady: true },
  stop: { label: () => lensTranslate("investigations.stopRun"), icon: CircleStop, variant: "outline", needsReady: false },
  retry: { label: () => lensTranslate("investigations.retry"), icon: RefreshCw, variant: "default", needsReady: true },
  raiseBudget: { label: () => lensTranslate("investigations.raiseBudget"), icon: Wallet, variant: "default", needsReady: false },
  connectWorker: { label: () => lensTranslate("tabs.configureAnalysis"), icon: Plug, variant: "default", needsReady: false },
  reviewIssues: {
    label: ({ openIssues: count }) => lensTranslate("investigations.reviewValue0", { value0: plural(count, "issue") }),
    icon: ListChecks,
    variant: "default",
    needsReady: false,
  },
  monitor: { label: () => lensTranslate("investigations.monitor"), icon: Repeat, variant: "default", needsReady: true },
};

const TONE_CLASS: Record<Tone, string> = {
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
  muted: "text-muted-foreground",
};

const plural = (count: number, noun: string) => `${count.toLocaleString()} ${noun}${count === 1 ? "" : "s"}`;

function facts(job: Job | undefined, findings: readonly Finding[] | null | undefined): Facts {
  const count = (kind: Finding["kind"], noun: string) => {
    const total = findings?.filter((f) => f.kind === kind).length ?? 0;
    return total ? plural(total, noun) : "";
  };
  return {
    runs: plural(job?.coverage?.screened ?? 0, "run"),
    found: [count("issue", "issue"), count("pattern", "pattern")].filter(Boolean).join(" and "),
    openIssues: openIssues(findings),
    reused: job?.coverage?.reused ?? 0,
  };
}

function Stat({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-card p-3">
      <dt className="font-mono text-[10px] text-muted-foreground">{label}</dt>
      <dd className="mt-2 truncate text-xl font-medium tabular-nums">{value}</dd>
      {note && <dd className="mt-1 truncate font-mono text-[10px] text-muted-foreground">{note}</dd>}
    </div>
  );
}

function coverageNote(job: Job): string | undefined {
  const { partial = 0, unassessable = 0, inconclusive = 0, reused = 0 } = job.coverage ?? {};
  const notes = [
    reused && lensTranslate("investigations.value0Reused", { value0: reused }),
    partial && lensTranslate("investigations.value0Partial", { value0: partial }),
    unassessable && lensTranslate("investigations.value0Unreadable", { value0: unassessable }),
    inconclusive && lensTranslate("investigations.value0Inconclusive", { value0: inconclusive }),
  ].filter(Boolean);
  return notes.length ? notes.join(" · ") : undefined;
}

const isActive = (job: Job) => job.status === "queued" || job.status === "running";

function issueStat(job: Job, findings: readonly Finding[] | null | undefined) {
  if (isActive(job)) return { value: "–", note: lensTranslate("investigations.runFinishes") };
  if (job.status !== "completed" || findings == null) return { value: "–" };
  const issues = findings.filter((f) => f.kind === "issue");
  const high = issues.filter((f) => f.priority === "high").length;
  return { value: issues.length.toLocaleString(), note: high ? lensTranslate("investigations.value0HighPriority", { value0: high }) : undefined };
}

function RunDuration({ job }: { job: Job }) {
  const now = useNow(isActive(job) ? 1000 : 60000);
  const end = job.finished_at ? Date.parse(job.finished_at) : now;
  return isActive(job) || job.finished_at ? analysisElapsed(job.created_at, end) : "–";
}

function RunStats({ job, findings }: { job: Job; findings: readonly Finding[] | null | undefined }) {
  const t = useLensTranslate();
  const calls = (job.steps ?? []).filter((step) => step.kind === "model").length;
  const { screened = 0, selected = 0 } = job.coverage ?? {};
  return (
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <Stat label={t("investigations.cost")} value={money(job.cost ?? 0)} note={plural(calls, t("investigations.modelCall"))} />
      <Stat label={t("investigations.duration")} value={<RunDuration job={job} />} note={`Started ${shortTime(job.created_at)}`} />
      <Stat
        label={t("investigations.runsReviewed2")}
        value={`${screened.toLocaleString()} / ${selected.toLocaleString()}`}
        note={coverageNote(job)}
      />
      <Stat label={t("investigations.issues")} {...issueStat(job, findings)} />
    </dl>
  );
}

function RunFailure({ job, connected }: { job: Job; connected: boolean }) {
  return (
    <div role="alert" className="space-y-2 rounded-md bg-destructive/5 p-3">
      <RunError job={job} connected={connected} />
    </div>
  );
}

function RunError({ job, connected }: { job: Job; connected: boolean }) {
  const t = useLensTranslate();
  return (
    <>
      <pre
        aria-label={t("investigations.investigationError")}
        className="whitespace-pre-wrap break-words font-mono text-xs text-destructive"
      >
        {job.error}
      </pre>
      <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
        <span>
          {t("evals.run")}<span className="font-mono">{job.id}</span>
        </span>
        <span>
          {t("investigations.model")}<span>{job.settings.model}</span>
        </span>
        <span>{t("investigations.worker")}{connected ? t("investigations.connectedNow") : t("investigations.connected")}</span>
      </p>
    </>
  );
}

function RunPartial({ job, connected }: { job: Job; connected: boolean }) {
  const t = useLensTranslate();
  return (
    <div role="status" className="space-y-2 rounded-md bg-warning/5 p-3 text-sm">
      <p>{t("investigations.value0ValidResultsPreserved", { value0: failedTaskSummary(job) })}</p>
      <details>
        <summary className="cursor-pointer text-xs text-muted-foreground">{t("investigations.runDetails")}</summary>
        <div className="mt-2 space-y-2">
          <RunError job={job} connected={connected} />
        </div>
      </details>
    </div>
  );
}

function RunLog({ job }: { job: Job }) {
  const t = useLensTranslate();
  const models = modelsUsed(job.steps ?? []);
  return (
    <Collapsible className="border-t pt-3">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <CollapsibleTrigger className="group flex items-center gap-1 font-medium text-foreground hover:underline">
          <ChevronRight className="size-3.5 transition-transform group-data-[panel-open]:rotate-90" />
          {t("investigations.activityLog")}</CollapsibleTrigger>
        <span className="truncate">
          {job.trigger === "manual" ? t("investigations.manual") : t("investigations.scheduled")} · {windowLabel(job)}
          {models.length > 0 && ` · ${models.join(", ")}`}
        </span>
      </div>
      <CollapsibleContent className="pt-3">
        <StepFeed job={job} />
      </CollapsibleContent>
    </Collapsible>
  );
}

function NextAction({
  action,
  facts: known,
  ready,
  busy,
  onClick,
}: {
  action: RunAction;
  facts: Facts;
  ready: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  const { label, icon: Icon, variant, needsReady } = ACTIONS[action];
  return (
    <Button variant={variant} disabled={busy || (needsReady && !ready)} onClick={onClick}>
      <Icon className="size-3.5" />
      {label(known)}
    </Button>
  );
}

function nextAction(lens: Lens, job: Job | undefined, situation: RunSituation): RunAction | null {
  if (job === undefined || job.id === lens.jobs[0]?.id) return NEXT_ACTION[situation];
  return activeJob(lens.jobs) ? "stop" : null;
}

export function RunReport({ lens, job, findings, connected, ready, busy, picker, actions, queue }: RunReportProps) {
  const t = useLensTranslate();
  const input: SituationInput = { lens, job, findings, connected };
  const situation = runSituation(input);
  const view = SITUATIONS[situation];
  const known = facts(job, findings);
  const action = nextAction(lens, job, situation);
  return (
    <section aria-label={t("investigations.runReport")} className="space-y-4 rounded-lg border border-t-2 border-t-violet-400 bg-card p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn("font-mono text-[10px] font-medium tracking-wide", TONE_CLASS[view.tone])}>{view.status}</p>
          <h3 className="mt-0.5 text-base font-semibold">{view.headline(known)}</h3>
        </div>
        <div className="flex items-center gap-1">
          {picker}
          {action && actions && (
            <NextAction action={action} facts={known} ready={ready} busy={busy} onClick={actions[action]} />
          )}
        </div>
      </header>
      {job && view.body === "progress" && <InvestigationProgress key={job.id} job={job} queue={queue} />}
      {job?.error && view.body === "partial" && <RunPartial job={job} connected={connected} />}
      {job?.error && view.body === "error" && <RunFailure job={job} connected={connected} />}
      {job && <RunStats job={job} findings={findings} />}
      {job && <RunLog job={job} />}
    </section>
  );
}
