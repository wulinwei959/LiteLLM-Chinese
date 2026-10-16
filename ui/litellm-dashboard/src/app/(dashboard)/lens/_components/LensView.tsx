"use client";

import type { components } from "@/lib/http/schema";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Info,
  Pause,
  Play,
  Plus,
  Settings2,
  MoreHorizontal,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { LensFinding } from "./LensFinding";
import { apiClient } from "@/components/networking";
import { TracePanel } from "./TracePanel";
import { LensSetup } from "./LensSetup";
import { LensRuns } from "./LensRuns";
import { LensProgress, ScanDuration } from "./LensProgress";
import { WorkerSetup } from "./WorkerSetup";
import { useAnalysisKeyInfo } from "./AnalysisKeyDetails";
import { uiHref } from "@/utils/uiHref";
import { ApiError } from "@/lib/http/client";
import {
  InvestigationList,
  InvestigationExample,
  MonitoringSetup,
  InvestigationSummary,
  InvestigationFailure,
} from "./LensOverview";
import { LensWelcome } from "./LensWelcome";
import type { LensTranslator } from "@/lib/i18n/translators";
import {
  workerConnected,
  scopeLabel,
  evidenceTarget,
  sortedFindings,
  runTime,
  priorityLabelKeys,
  type Lens,
  type LensList,
  type Finding,
  type Settings,
  type Job,
} from "./lensData";

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 3 }).format(n);
const when = (value: string | null | undefined, t: LensTranslator) => (value ? runTime(value) : t("notYet"));

const sourceLabels = { both: "tracesAndRequests", requests: "llmRequests", traces: "agentTraces" } as const;
const priorityColors = { high: "bg-red-500", medium: "bg-amber-500", low: "bg-slate-400" };
function emptyFindingTitle(active: boolean, scanned: boolean, status: string | undefined, t: LensTranslator) {
  if (status === "failed" || status === "cancelled") return t("noFindingsFromRun");
  if (active) return t("findingsWillAppear");
  return scanned ? t("noMatchingFindings") : t("readyFirstAnalysis");
}

export function LensView({ accessToken, readOnly = false }: { accessToken: string; readOnly?: boolean }) {
  const t = useTranslations("lens");
  const commonT = useTranslations("common");
  const client = useQueryClient();
  const [workerSetup, setWorkerSetup] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 2000);
    return () => window.clearInterval(timer);
  }, []);
  const key = ["lenses", accessToken];
  const query = useQuery({
    queryKey: key,
    queryFn: () => apiClient.get<LensList>("/lens", { accessToken }),
    refetchInterval: (current) => {
      const running = current.state.data?.lenses.some((item) =>
        item.jobs.some((job) => ["queued", "running"].includes(job.status)),
      );
      return workerSetup || running ? 2000 : 10000;
    },
  });
  const models = useQuery({
    queryKey: ["lens-models", accessToken],
    queryFn: () => apiClient.get<{ data: { id: string }[] }>("/models", { accessToken }),
  });
  const modelDetails = useQuery({
    queryKey: ["lens-model-details", accessToken],
    queryFn: () =>
      apiClient.get<{ data: import("./lensData").AnalysisModelInfo[] }>("/model_group/info", { accessToken }),
  });
  const [selected, setSelected] = useQueryState("lens", parseAsString.withOptions({ history: "push" }));
  const [editing, setEditing] = useState<"new" | "edit" | "duplicate" | null>(null);
  const [batchId, setBatchId] = useState("latest");
  const [historyOffset, setHistoryOffset] = useState(0);
  const [tab, setTab] = useState("findings");
  const [findingId, setFindingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("open");
  const [kind, setKind] = useState<"issue" | "pattern">("issue");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [evidence, setEvidence] = useState<{ id: string; span: string } | null>(null);
  const selectLens = (id: string | null) => {
    void setSelected(id);
    setBatchId("latest");
    setHistoryOffset(0);
    setFindingId(null);
    setTab("findings");
  };
  useEffect(() => {
    const restoreLocation = () => {
      setEditing(null);
      setBatchId("latest");
      setHistoryOffset(0);
      setFindingId(null);
      setTab("findings");
    };
    window.addEventListener("popstate", restoreLocation);
    return () => window.removeEventListener("popstate", restoreLocation);
  }, []);
  const lenses = [...(query.data?.lenses ?? [])].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  const showEmpty = !query.isLoading && !query.error && lenses.length === 0;
  const loaded = !query.isLoading && !query.error;
  const showActions = !readOnly && !!query.data && !showEmpty;
  const showReadiness = loaded && !showEmpty && !readOnly;
  const missingSelection = !!selected && loaded;
  const lens = lenses.find((e) => e.id === selected);
  const connected = query.data?.workers?.some((w) => workerConnected(w, now)) ?? false;
  const activeWorkers = query.data?.workers.filter((worker) => !worker.revoked) ?? [];
  const defaultKeyId = activeWorkers.length === 1 ? activeWorkers[0].analysis_key_id : undefined;
  const analysisAccess = useAnalysisKeyInfo(accessToken, defaultKeyId ?? undefined);
  const defaultModel = analysisAccess.data?.models.length === 1 ? analysisAccess.data.models[0] : undefined;
  const activityOptions = {
    queryKey: ["lens-activity-available", accessToken],
    queryFn: () => apiClient.get<{ traces: boolean; requests: boolean }>("/lens/activity/available", { accessToken }),
    enabled: loaded,
    refetchInterval: 5000,
  };
  const activity = useQuery(activityOptions);
  const tracesReady = activity.data?.traces === true && !activity.error;
  const requestsReady = activity.data?.requests === true && !activity.error;
  const activityReady = tracesReady || requestsReady;
  const ready = activityReady && connected && !query.error;
  const historyQuery = {
    queryKey: ["lens-history", lens?.id, historyOffset, accessToken],
    enabled: !!lens,
    queryFn: () => apiClient.get<Job[]>(`/lens/${lens?.id}/runs`, { accessToken, query: { offset: historyOffset } }),
    refetchInterval: 10000,
  };
  const history = useQuery(historyQuery);
  const historical = useQuery({
    queryKey: ["lens-batch", lens?.id, batchId, accessToken],
    enabled: !!lens && !["latest", "all"].includes(batchId),
    queryFn: () => apiClient.get<Job>(`/lens/${lens?.id}/runs/${batchId}`, { accessToken }),
  });
  const job = ["latest", "all"].includes(batchId) ? lens?.jobs?.[0] : historical.data;
  const missingSnapshot = job?.status === "completed" && job.findings == null && batchId !== "all";
  const selectedOutsideHistory = !["latest", "all"].includes(batchId) && !history.data?.some((j) => j.id === batchId);
  const batchSettings = job?.settings ?? lens?.settings;
  const batchFindings = (batchId === "all" ? lens?.findings ?? [] : job?.findings ?? []).map((f) => {
    const feedback = lens?.findings?.find((current) => current.id === f.id);
    return feedback ? { ...f, status: feedback.status, reason: feedback.reason } : f;
  });
  const finding = batchFindings.find((f) => f.id === findingId);
  const openBatch = (id: string) => {
    setBatchId(id);
    setTab("findings");
    setFindingId(null);
  };
  const setupSettings = () => {
    if (editing === "new") return undefined;
    if (editing === "duplicate" && lens)
      return { ...lens.settings, name: `${lens.settings.name} copy`, enabled: false };
    return lens?.settings;
  };
  const active = lens?.jobs?.find((j) => j.status === "queued" || j.status === "running");
  const visibleFindings = sortedFindings(
    batchFindings.filter((f) => (filter === "all" || f.status === filter) && f.kind === kind),
  );
  const sampledRuns = job?.sample?.executions ?? [];
  const target = evidence ? evidenceTarget(evidence.id) : null;
  const [requestOffset, setRequestOffset] = useState(0);
  const requestEvidence = useQuery({
    queryKey: ["lens-evidence", lens?.id, evidence?.id, requestOffset, accessToken],
    enabled: !!lens && target?.source === "requests",
    queryFn: () =>
      apiClient.get<components["schemas"]["ExecutionContent"]>(
        `/lens/${lens?.id}/executions/${encodeURIComponent(evidence?.id ?? "")}`,
        { accessToken, query: { offset: requestOffset } },
      ),
  });
  const refresh = () => {
    void client.invalidateQueries({ queryKey: key });
    void client.invalidateQueries({ queryKey: ["lens-history"] });
  };
  const update = async (path: string, body: unknown, method: "post" | "put" | "patch" = "post") => {
    setBusy(true);
    setError("");
    try {
      await apiClient[method](path, { accessToken, body });
      await client.invalidateQueries({ queryKey: key });
    } catch (e) {
      setError(e instanceof Error ? e.message : t("couldNotUpdateLens"));
    } finally {
      setBusy(false);
    }
  };
  const save = async (settings: Settings) => {
    if (editing === "edit" && (!lens || lens.id !== selected)) throw new Error(t("reopenToEdit"));
    if (editing !== "edit" && !ready) throw new Error(t("waitForActivity"));
    const saved = await apiClient.request<Lens>(
      editing === "edit" ? "PUT" : "POST",
      editing === "edit" ? `/lens/${lens?.id}` : "/lens",
      { accessToken, body: settings },
    );
    selectLens(saved.id);
    setEditing(null);
    refresh();
  };
  const changeFinding = async (status: Finding["status"]) => {
    if (!lens || !finding) return;
    await update(`/lens/${lens.id}/findings/${finding.id}`, { status, reason }, "patch");
  };

  return (
    <section aria-label={t("investigations")} className="w-full min-w-0 space-y-6">
      {!showEmpty && (
        <header className="flex flex-wrap items-center justify-between gap-3">
          {lens ? (
            <Button variant="ghost" size="sm" className="-ml-3" onClick={() => selectLens(null)}>
              <ArrowLeft className="size-4" /> {t("allInvestigations")}
            </Button>
          ) : (
            <h2 className="text-lg font-semibold">{t("investigations")}</h2>
          )}
          {showActions && (
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" disabled={!activityReady} onClick={() => setWorkerSetup(true)}>
                <Circle
                  className={`size-2 ${connected ? "fill-emerald-500 text-emerald-500" : "fill-amber-500 text-amber-500"}`}
                />
                {connected ? t("workerConnected") : t("connectWorker")}
              </Button>
              <Button variant={lens ? "outline" : "default"} disabled={!ready} onClick={() => setEditing("new")}>
                <Plus className="size-4" /> {t("newInvestigation")}
              </Button>
            </div>
          )}
        </header>
      )}
      {(error || query.error) && (
        <div role="alert" className="rounded-lg border border-destructive/30 p-4 text-sm text-destructive">
          {query.error instanceof ApiError && query.error.status === 404
            ? t("lensApiUnavailable")
            : error || query.error?.message}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              query.error instanceof ApiError && query.error.status === 404 ? window.location.reload() : refresh()
            }
          >
            {query.error instanceof ApiError && query.error.status === 404 ? t("reloadPage") : commonT("retry")}
          </Button>
        </div>
      )}
      {query.isLoading && (
        <p role="status" className="py-8 text-sm text-muted-foreground">
          {t("loadingInvestigations")}
        </p>
      )}
      {loaded && showEmpty && (
        <LensWelcome
          tracesReady={tracesReady}
          requestsReady={requestsReady}
          checking={activity.isPending}
          traceError={activity.error?.message}
          connected={connected}
          readOnly={!!readOnly}
          onRetry={() => {
            void activity.refetch();
            refresh();
          }}
          onConnect={() => setWorkerSetup(true)}
          onCreate={() => setEditing("new")}
          onExample={() => setShowExample(true)}
        />
      )}
      {showReadiness && !ready && (
        <div role="status" className="flex flex-wrap items-center gap-2 border-y py-3 text-sm text-muted-foreground">
          {activityReady ? t("connectWorkerReadiness") : t("activityNotReady")}
          {!activityReady && (
            <a className="font-medium underline" href={uiHref("lens/?tab=traces")}>
              {t("checkTraces")}
            </a>
          )}
        </div>
      )}
      {!selected && lenses.length > 0 && (
        <InvestigationList lenses={lenses} connected={connected} onSelect={selectLens} />
      )}
      {missingSelection && !lens && (
        <div role="alert" className="text-sm">
          {t("investigationNotFound")}{" "}
          <Button variant="link" onClick={() => selectLens(null)}>
            {t("viewAllInvestigations")}
          </Button>
        </div>
      )}
      {lens && (
        <div>
          <section className="min-w-0 space-y-5">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{lens.settings.name}</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t(sourceLabels[lens.settings.source ?? "traces"])} · {scopeLabel(lens.settings, t)}
                </p>
              </div>
              {!readOnly && (
                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon" aria-label={t("investigationActions")} />}
                    >
                      <MoreHorizontal className="size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => setEditing("edit")}>
                        <Settings2 />
                        {t("editInvestigation")}
                      </DropdownMenuItem>
                      <DropdownMenuItem disabled={!ready} onClick={() => setEditing("duplicate")}>
                        <Copy />
                        {commonT("duplicate")}
                      </DropdownMenuItem>
                      {lens.settings.enabled ? (
                        <DropdownMenuItem
                          disabled={busy}
                          onClick={() => update(`/lens/${lens.id}`, { ...lens.settings, enabled: false }, "put")}
                        >
                          <Pause />
                          {t("pauseMonitoring")}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem disabled={!ready || busy} onClick={() => setMonitoring(true)}>
                          <Play />
                          {t("enableMonitoring")}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button disabled={busy || !!active || !ready} onClick={() => update(`/lens/${lens.id}/runs`, {})}>
                    <Play className="size-3" />
                    {t("runNow")}
                  </Button>
                </div>
              )}
            </div>
            <InvestigationSummary lens={lens} connected={connected} />
            {active && (
              <LensProgress
                key={active.id}
                job={active}
                onCancel={
                  readOnly
                    ? undefined
                    : () => {
                        void update(`/lens/${lens.id}/cancel`, {});
                      }
                }
              />
            )}
            {job?.error && <InvestigationFailure job={job} connected={connected} />}
            <Tabs value={tab} onValueChange={setTab} key={lens.id}>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b">
                <TabsList variant="line">
                  <TabsTrigger value="findings">{t("findings")}</TabsTrigger>
                  <TabsTrigger value="checks">{t("criteria")}</TabsTrigger>
                  <TabsTrigger value="runs">
                    {
                      { requests: t("requests"), both: t("tracesAmpRequests"), traces: t("traces") }[
                        batchSettings?.source ?? "traces"
                      ]
                    }
                  </TabsTrigger>
                  <TabsTrigger value="activity">{t("history")}</TabsTrigger>
                </TabsList>
                {tab !== "activity" && (
                  <div className="flex min-w-0 items-center gap-1 pb-1">
                    <select
                      aria-label={t("investigationRun")}
                      className="h-8 w-44 max-w-full truncate rounded-md border-0 bg-transparent px-2 text-xs text-muted-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                      value={batchId}
                      onChange={(e) => {
                        setBatchId(e.target.value);
                        setFindingId(null);
                      }}
                    >
                      <option value="latest">{t("latestRunOption")}</option>
                      {job && selectedOutsideHistory && (
                        <option value={batchId}>
                          {when(job.created_at, t)} · {job.status}
                        </option>
                      )}
                      {(history.data ?? lens.jobs)?.map((j) => (
                        <option key={j.id} value={j.id}>
                          {when(j.created_at, t)} · {j.status}
                        </option>
                      ))}
                      <option value="all">{t("allAccumulatedFindings")}</option>
                    </select>
                    {job && batchId !== "all" && (
                      <Popover key={job.id}>
                        <PopoverTrigger
                          aria-label={t("runDetails")}
                          render={<Button variant="ghost" size="icon" className="size-7 text-muted-foreground" />}
                        >
                          <Info className="size-3.5" />
                        </PopoverTrigger>
                        <PopoverContent align="end" className="gap-3">
                          <PopoverTitle>{t("runDetails")}</PopoverTitle>
                          <p className="text-xs text-muted-foreground">
                            {t("runCoverageDetail", {
                              screened: job.coverage?.screened ?? 0,
                              selected: job.coverage?.selected ?? 0,
                            })}
                            <ScanDuration job={job} />
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t("coverageDetail", {
                              partial: job.coverage?.partial ?? 0,
                              unassessable: job.coverage?.unassessable ?? 0,
                              inconclusive: job.coverage?.inconclusive ?? 0,
                            })}
                          </p>
                          <dl className="space-y-2 text-xs">
                            <div>
                              <dt className="text-muted-foreground">{t("activityWindow")}</dt>
                              <dd className="mt-1">
                                {t("windowRange", { start: when(job.start, t), end: when(job.end, t) })}
                              </dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">{t("analysisCost")}</dt>
                              <dd>{money(job.cost ?? 0)}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                              <dt className="text-muted-foreground">{commonT("status")}</dt>
                              <dd className="capitalize">{job.status}</dd>
                            </div>
                          </dl>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )}
              </div>
              {historical.error && (
                <p role="alert" className="text-sm text-destructive">
                  {t("couldNotLoadRun")}{" "}
                  <Button variant="link" onClick={() => void historical.refetch()}>
                    {commonT("retry")}
                  </Button>
                </p>
              )}
              {missingSnapshot && tab !== "activity" && (
                <p className="text-sm text-muted-foreground">{t("olderBatchSnapshot")}</p>
              )}
              <TabsContent value="findings" className="pt-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-1" aria-label={t("findingCategory")}>
                    <Button
                      size="sm"
                      variant={kind === "issue" ? "secondary" : "ghost"}
                      onClick={() => setKind("issue")}
                    >
                      {t("needsAttentionCount", {
                        count: batchFindings.filter((f) => f.kind === "issue" && f.status === "open").length ?? 0,
                      })}
                    </Button>
                    <Button
                      size="sm"
                      variant={kind === "pattern" ? "secondary" : "ghost"}
                      onClick={() => setKind("pattern")}
                    >
                      {t("patternsCount", {
                        count: batchFindings.filter((f) => f.kind === "pattern" && f.status === "open").length ?? 0,
                      })}
                    </Button>
                  </div>
                  <select
                    aria-label={t("findingStatus")}
                    className="rounded-md border bg-background px-2 py-1 text-xs"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="open">{t("statusOpen")}</option>
                    <option value="resolved">{t("statusResolved")}</option>
                    <option value="dismissed">{t("statusDismissed")}</option>
                    <option value="all">{t("allStatuses")}</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  {kind === "issue" ? t("issuesDescription") : t("patternsDescription")}
                </p>
                <div className="divide-y border-y">
                  {visibleFindings.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setFindingId(f.id);
                        setReason(f.reason ?? "");
                      }}
                      className="flex w-full gap-3 py-4 text-left hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <span
                        className={`mt-1 size-2 shrink-0 rounded-full ${priorityColors[f.priority ?? "medium"]}`}
                        aria-label={t(priorityLabelKeys[f.priority ?? "medium"])}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{f.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{f.description}</p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {t("linkedRuns", { count: f.occurrences?.length ?? 0 })} ·{" "}
                          {f.kind === "issue" ? t(priorityLabelKeys[f.priority ?? "medium"]) : t("pattern")}
                        </p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                  {visibleFindings.length === 0 && (
                    <div className="px-6 py-14 text-center">
                      <CheckCircle2 className="mx-auto mb-3 size-5 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {emptyFindingTitle(!!active, !!lens.last_scan_at, job?.status, t)}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {active ? t("reviewingActivity") : t("findingsGuarantee")}
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="checks" className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{t("usedForThisRun")}</p>
                  {!readOnly && (
                    <Button variant="outline" size="sm" onClick={() => setEditing("edit")}>
                      {t("editCriteria")}
                    </Button>
                  )}
                </div>
                {batchSettings?.context && (
                  <div className="space-y-2 border-b pb-5">
                    <h3 className="text-base font-semibold">{t("whatShouldAgentDo")}</h3>
                    <p className="text-xs text-muted-foreground">{t("agentPurposeHelp")}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm">{batchSettings.context}</p>
                  </div>
                )}
                <div className="pt-2">
                  <h3 className="text-base font-semibold">{t("whatToLookFor")}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{t("problemsHelp")}</p>
                </div>
                {batchSettings?.checks.map((c, index) => (
                  <div key={c.id} className="flex items-start gap-3 border-b py-4">
                    <span className="mt-0.5 text-xs tabular-nums text-muted-foreground">{index + 1}.</span>
                    <p className="text-sm leading-6 flex-1">{c.instruction}</p>
                    {!c.enabled && <span className="text-xs text-muted-foreground">{commonT("disabled")}</span>}
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">{t("changesApplyFuture")}</p>
              </TabsContent>
              <TabsContent value="runs" className="pt-4 space-y-4">
                <LensRuns
                  key={job?.id ?? batchId}
                  job={job}
                  onOpen={(id) => {
                    setRequestOffset(0);
                    setEvidence({ id, span: "" });
                  }}
                />
              </TabsContent>
              <TabsContent value="activity" className="pt-4 space-y-4">
                {history.error && (
                  <p role="alert" className="text-sm text-destructive">
                    {t("couldNotLoadRunHistory")}{" "}
                    <Button variant="link" size="sm" onClick={() => void history.refetch()}>
                      {commonT("retry")}
                    </Button>
                  </p>
                )}
                <div className="divide-y border-y">
                  {(history.data ?? lens.jobs)?.map((j) => (
                    <button
                      key={j.id}
                      onClick={() => openBatch(j.id)}
                      className="flex w-full items-center gap-4 py-4 text-left hover:bg-muted/30 focus-visible:outline-2 focus-visible:outline-ring"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{when(j.created_at, t)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {t("runsReviewedCount", { count: j.coverage?.screened ?? 0 })}
                          {j.findings != null && <> · {t("findingsCount", { count: j.findings.length })}</>}
                          <ScanDuration job={j} />
                        </p>
                        {j.error && <p className="mt-2 line-clamp-2 text-xs text-destructive">{j.error}</p>}
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p className={`capitalize ${j.status === "failed" ? "text-destructive" : ""}`}>{j.status}</p>
                        <p className="mt-1">{money(j.cost ?? 0)}</p>
                      </div>
                      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                  ))}
                </div>
                {(historyOffset > 0 || (history.data?.length ?? 0) >= 50) && (
                  <div className="flex justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={!historyOffset}
                      onClick={() => setHistoryOffset(Math.max(0, historyOffset - 50))}
                    >
                      {t("newerRuns")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={(history.data?.length ?? 0) < 50}
                      onClick={() => setHistoryOffset(historyOffset + 50)}
                    >
                      {t("olderRuns")}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </section>
        </div>
      )}
      {editing && (
        <LensSetup
          ready={ready}
          mode={editing}
          initial={setupSettings()}
          defaultModel={defaultModel}
          defaultSource={!tracesReady && requestsReady ? "requests" : "traces"}
          models={models.data?.data.map((m) => m.id) ?? []}
          modelDetails={modelDetails.data?.data ?? []}
          modelsLoading={models.isLoading}
          modelsError={models.error?.message}
          accessToken={accessToken}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
      {workerSetup && (
        <WorkerSetup
          accessToken={accessToken}
          workers={query.data?.workers ?? []}
          onClose={() => setWorkerSetup(false)}
          onChanged={refresh}
          onReady={
            ready && showEmpty
              ? () => {
                  setWorkerSetup(false);
                  setEditing("new");
                }
              : undefined
          }
        />
      )}
      {showExample && <InvestigationExample onClose={() => setShowExample(false)} />}
      {monitoring && lens && (
        <MonitoringSetup
          settings={lens.settings}
          ready={ready}
          onClose={() => setMonitoring(false)}
          onSave={async (settings) => {
            await apiClient.put(`/lens/${lens.id}`, { accessToken, body: settings });
            refresh();
          }}
        />
      )}
      <LensFinding
        finding={finding}
        sampledRuns={sampledRuns}
        readOnly={readOnly}
        reason={reason}
        busy={busy}
        onClose={() => setFindingId(null)}
        onReason={setReason}
        changeFinding={changeFinding}
        onEvidence={(value) => {
          setRequestOffset(0);
          setEvidence(value);
        }}
      />
      {lens && target?.source === "traces" && (
        <TracePanel
          open={!!evidence}
          traceId={target.id}
          traceRef={target.traceRef}
          initialSpanId={evidence?.span}
          accessToken={accessToken}
          onClose={() => setEvidence(null)}
        />
      )}
      <Sheet
        open={target?.source === "requests"}
        onOpenChange={(open) => {
          if (!open) setEvidence(null);
        }}
      >
        <SheetContent className="overflow-y-auto data-[side=right]:sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{t("requestEvidence")}</SheetTitle>
            <SheetDescription>{t("originalLoggedInputOutput")}</SheetDescription>
          </SheetHeader>
          <div className="p-4 space-y-3">
            {requestEvidence.isLoading && <p role="status">{t("loadingRequest")}</p>}
            {requestEvidence.error && <p role="alert">{requestEvidence.error.message}</p>}
            {requestEvidence.data?.parts.map((p) => (
              <pre className="whitespace-pre-wrap break-words text-xs" key={p.span_id}>
                {p.content}
              </pre>
            ))}
            {requestEvidence.data?.parts.length === 0 && <p>{t("requestNotFound")}</p>}
            <div className="flex flex-wrap gap-2">
              {requestOffset > 0 && (
                <Button variant="outline" onClick={() => setRequestOffset(Math.max(0, requestOffset - 8000))}>
                  {t("previousSection")}
                </Button>
              )}
              {requestEvidence.data?.parts.some((p) => p.truncated) && (
                <Button
                  variant="outline"
                  onClick={() => setRequestOffset(requestOffset === 0 ? 1 : requestOffset + 8000)}
                >
                  {t("nextSection")}
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
