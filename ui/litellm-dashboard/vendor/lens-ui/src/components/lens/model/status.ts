import { formatActivityTimestamp } from "../../../utils/activityTimestamp";
import type { Job, Lens, LensList } from "./types";
import { lensTranslate } from "../../../host/lensTranslate";

export function workerConnected(worker: LensList["workers"][number], now = Date.now()): boolean {
  return !worker.revoked && !!worker.analysis_key_id && now - Date.parse(worker.last_seen) < 120000;
}

export function readingStart(job: Pick<Job, "steps" | "created_at">): string {
  return job.steps.find((step) => step.kind === "stage" && step.label === "Reading executions")?.at ?? job.created_at;
}

export function secondsToFinishReading(
  job: Pick<Job, "steps" | "created_at" | "reviewed" | "coverage">,
  now: number,
): number | null {
  const remaining = job.coverage.selected - job.reviewed;
  const elapsed = (now - Date.parse(readingStart(job))) / 1000;
  if (remaining <= 0 || job.reviewed <= 0 || elapsed <= 0) return null;
  return Math.ceil(remaining / (job.reviewed / elapsed));
}

const PICKUP_GRACE_SECONDS = 6;

export interface WorkerTask {
  lensId: string;
  name: string;
  stage: string;
  reviewed: number;
  selected: number;
  secondsLeft: number | null;
}

export type QueueReason =
  | { kind: "busy"; tasks: readonly WorkerTask[]; startsIn: number | null }
  | { kind: "no_worker" }
  | { kind: "starting"; seconds: number; tasks: readonly WorkerTask[] };

type QueuedJob = Pick<Job, "id" | "worker_id" | "created_at">;

function workerTasks(
  job: QueuedJob,
  lenses: readonly Pick<Lens, "id" | "jobs" | "settings">[],
  workerIds: ReadonlySet<string>,
  now: number,
) {
  return lenses.flatMap((lens) =>
    lens.jobs
      .filter((other) => other.status === "running" && other.id !== job.id && workerIds.has(other.worker_id ?? ""))
      .map((other) => ({
        workerId: other.worker_id ?? "",
        task: {
          lensId: lens.id,
          name: lens.settings.name,
          stage: other.stage,
          reviewed: other.reviewed,
          selected: other.coverage.selected,
          secondsLeft: secondsToFinishReading(other, now),
        },
      })),
  );
}

export function queueReason(
  job: QueuedJob,
  lenses: readonly Pick<Lens, "id" | "jobs" | "settings">[],
  workers: readonly LensList["workers"][number][],
  now: number,
): QueueReason {
  const connected = workers.filter((worker) => workerConnected(worker, now)).map((worker) => worker.id);
  if (!connected.length) return { kind: "no_worker" };
  const eligible = new Set(job.worker_id ? [job.worker_id] : connected);
  const running = workerTasks(job, lenses, eligible, now);
  const tasks = running.map((entry) => entry.task);
  const seconds = Math.max(0, Math.floor((now - Date.parse(job.created_at)) / 1000));
  if (!tasks.length || seconds < PICKUP_GRACE_SECONDS) return { kind: "starting", seconds, tasks };
  const estimates = tasks.flatMap((task) => (task.secondsLeft === null ? [] : [task.secondsLeft]));
  return { kind: "busy", tasks, startsIn: estimates.length ? Math.min(...estimates) : null };
}

function waitLabel(seconds: number): string {
  if (seconds < 60) return `~${Math.max(5, Math.ceil(seconds / 5) * 5)}s`;
  return `~${Math.ceil(seconds / 60)}m`;
}

export function queueReasonText(reason: QueueReason): string {
  switch (reason.kind) {
    case "busy": {
      const count = reason.tasks.length;
      const when = reason.startsIn === null ? "" : lensTranslate("model.startsValue0", { value0: waitLabel(reason.startsIn) });
      return lensTranslate("model.workerBusyValue0Value1value2", { value0: count, value1: count === 1 ? "investigation" : "investigations", value2: when });
    }
    case "no_worker":
      return lensTranslate("model.analysisUnavailableCheckConfigure");
    case "starting":
      return lensTranslate("model.pickingUpValue0s", { value0: reason.seconds });
  }
}

export function workerTaskText(task: WorkerTask): string {
  const progress = task.selected ? lensTranslate("model.value0Value1Traces", { value0: task.reviewed, value1: task.selected }) : "";
  return `${task.name} · ${task.stage || "starting"}${progress}`;
}

export function isActive(job: Pick<Job, "status">): boolean {
  return job.status === "queued" || job.status === "running";
}

export function activeJob(jobs: readonly Job[]): Job | undefined {
  return jobs.find(isActive);
}

export function hasActiveJob(jobs: readonly Job[]): boolean {
  return activeJob(jobs) !== undefined;
}

/** One observer polls `/lens`: fast while work is in flight or a worker is being connected, slow otherwise. */
export function listPollInterval(list: LensList | undefined, settingsOpen: boolean, now: number): number {
  const running = list?.lenses.some((lens) => hasActiveJob(lens.jobs)) ?? false;
  const connected = list?.workers.some((worker) => workerConnected(worker, now)) ?? false;
  return running || (settingsOpen && !connected) ? 2000 : 10000;
}

export function budgetReached(lens: Lens, now = new Date()): boolean {
  const spent = lens.budget_month === now.toISOString().slice(0, 7) ? lens.spent ?? 0 : 0;
  return spent >= (lens.settings.monthly_budget ?? 100);
}

export function lensStatus(lens: Lens, connected: boolean): string {
  const active = lens.jobs?.find((job) => ["queued", "running"].includes(job.status ?? ""));
  if (active) return connected ? active.stage ?? lensTranslate("investigations.queued") : lensTranslate("model.waitingAnalyzer");
  if (budgetReached(lens)) return lensTranslate("model.budgetReached");
  const latest = lens.jobs?.[0];
  return latest ? runStatus(latest) : lensTranslate("model.ready");
}

export function isPartial(job: Pick<Job, "status" | "error">): boolean {
  return job.status === "completed" && !!job.error;
}

export function runStatus(job: Pick<Job, "status" | "error">): string {
  const status = job.status ?? "";
  return isPartial(job) ? lensTranslate("model.partial") : status.charAt(0).toUpperCase() + status.slice(1);
}

export function failedTaskSummary(job: Pick<Job, "coverage">): string {
  const failed = job.coverage.failed_tasks ?? 0;
  const total = job.coverage.screened + job.coverage.investigated;
  return failed > 0 ? lensTranslate("model.value0Value1AnalysisTasks", { value0: failed, value1: total }) : lensTranslate("model.someAnalysisTasksCould");
}

export function nextCheckStatus(lens: Lens, now: number): string | null {
  if (!lens.settings.enabled) return null;
  const active = lens.jobs.find((job) => job.status === "queued" || job.status === "running");
  if (active?.status === "running") return lensTranslate("model.nextCheckScheduledAfter");
  if (active?.status === "queued") return lensTranslate("model.waitingForAnAnalyzer");
  const next = new Date(lens.next_run_at);
  const remaining = next.getTime() - now;
  if (remaining <= 0) return lensTranslate("model.dueNowWaitingAnalyzer");
  const minutes = Math.ceil(remaining / 60000);
  const relative = minutes === 1 ? lensTranslate("model.lessMinute") : lensTranslate("model.value0Minutes", { value0: minutes });
  const time = formatActivityTimestamp(lens.next_run_at);
  return lensTranslate("model.nextCheckValue0Value1", { value0: time, value1: relative });
}

export type InvestigationActivity = "running" | "queued" | "idle";

export function investigationActivity(lenses: readonly Lens[]): InvestigationActivity {
  const statuses = new Set(lenses.flatMap((lens) => lens.jobs.map((job) => job.status)));
  if (statuses.has("running")) return "running";
  if (statuses.has("queued")) return "queued";
  return "idle";
}
