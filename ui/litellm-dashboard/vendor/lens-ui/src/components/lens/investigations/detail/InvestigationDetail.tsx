"use client";

import { Button } from "../../../ui/button";
import CopyButton from "../../../shared/CopyButton";
import { getProxyBaseUrl } from "../../../../lib/http/requests";
import { getAuthHeaderName } from "../../../../lib/http/runtime";
import { useTracesLive } from "../../traces/api";
import { investigationHandoffText } from "../agentHandoff";

import { Tabs, TabsList, TabsTrigger } from "../../../ui/tabs";
import { RunsTab } from "./RunsTab";
import { LiveRunLoader } from "../live/LiveRunLoader";
import type { QueueContext } from "../useQueueReason";
import { liveJob } from "../../model/live";
import { InvestigationSummary } from "./InvestigationSummary";
import { RunReport, type RunActionHandlers } from "./RunReport";
import { sourceLabels } from "../../model/format";
import { mergeFeedback } from "../../model/findings";
import type { OwnedFinding } from "../../model/inbox";
import { type Finding, type Lens } from "../../model/types";
import { FindingPanel } from "../FindingDetails";
import { useFindingFilters, useSectionRoute } from "../../route";
import { useRunSnapshot } from "../useRunSnapshot";

import { InvestigationActions, type InvestigationIntents } from "./InvestigationActions";
import { RunPicker } from "./RunPicker";
import { FindingsTab } from "./FindingsTab";
import { CriteriaTab } from "./CriteriaTab";
import { HistoryTab } from "./HistoryTab";
import { useLensTranslate } from "../../../../host/useLensTranslate";

export type InvestigationDetailProps = InvestigationIntents & {
  readonly lens: Lens;
  readonly readOnly: boolean;
  readonly ready: boolean;
  readonly busy: boolean;
  readonly connected: boolean;
  readonly queue: QueueContext;
  readonly onReviewFinding: (owned: OwnedFinding, status: Finding["status"], reason: string) => void;
};

export function InvestigationDetail({
  lens,
  readOnly,
  ready,
  busy,
  connected,
  queue,
  onCancelRun,
  onReviewFinding,
  ...intents
}: InvestigationDetailProps) {
  const t = useLensTranslate();
  const isLive = useTracesLive();
  const { section, setSection } = useSectionRoute();
  const { setKind, setStatus } = useFindingFilters();
  const snapshot = useRunSnapshot(lens);
  const { job, batchId, batchSettings, batchFindings, missingSnapshot } = snapshot;
  const live = liveJob(lens.jobs);
  const runActions: RunActionHandlers = {
    run: intents.onRunNow,
    retry: intents.onRunNow,
    stop: onCancelRun,
    raiseBudget: intents.onEdit,
    connectWorker: intents.onConnectWorker,
    monitor: intents.onEnableMonitoring,
    reviewIssues: () => {
      setSection("findings");
      setKind("issue");
      setStatus("open");
    },
  };
  return (
    <div>
      <section className="min-w-0 space-y-5">
        <div className="flex flex-wrap justify-between gap-3 border-b pb-4">
          <div className="min-w-0">
            <p className="lens-section-label mb-2 font-mono text-[10px] text-muted-foreground">{t("investigations.investigation")}</p>
            <h2 className="font-mono text-lg font-medium break-words">{lens.settings.name}</h2>
            <InvestigationSummary lens={lens} />
          </div>
          <div className="flex items-center gap-2 self-start">
            {isLive && (
              <CopyButton
                variant="action"
                label={t("investigations.copyAgent")}
                copiedLabel={t("investigations.commandCopied")}
                value={investigationHandoffText(getProxyBaseUrl(), lens.id, batchId, getAuthHeaderName())}
              />
            )}
            {!readOnly && <InvestigationActions lens={lens} ready={ready} busy={busy} {...intents} />}
          </div>
        </div>
        <RunReport
          lens={lens}
          job={job}
          findings={job?.findings && mergeFeedback(job.findings, lens.findings ?? [])}
          connected={connected}
          ready={ready}
          busy={busy}
          picker={<RunPicker lens={lens} job={job} />}
          actions={readOnly ? undefined : runActions}
          queue={queue}
        />
        {live && (
          <LiveRunLoader
            key={`${live.id}:${live.attempts}`}
            lensId={lens.id}
            job={live}
            name={lens.settings.name}
            queue={queue}
          />
        )}
        <Tabs value={section} onValueChange={setSection} key={lens.id}>
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b">
            <TabsList variant="line">
              <TabsTrigger value="findings">{t("tabs.findings")}</TabsTrigger>
              <TabsTrigger value="checks">{t("investigations.criteria")}</TabsTrigger>
              <TabsTrigger value="runs">{sourceLabels[batchSettings?.source ?? "traces"]}</TabsTrigger>
              <TabsTrigger value="activity">{t("investigations.history")}</TabsTrigger>
            </TabsList>
          </div>
          {snapshot.error && (
            <p role="alert" className="text-sm text-destructive">
              {t("investigations.couldLoadRun")}{" "}
              <Button variant="link" onClick={snapshot.refetch}>
                {t("investigations.retry")}</Button>
            </p>
          )}
          {missingSnapshot && section !== "activity" && (
            <p className="text-sm text-muted-foreground">
              {t("investigations.olderBatchPredatesSaved")}</p>
          )}
          <FindingsTab lens={lens} job={job} findings={batchFindings}>
            <FindingPanel
              readOnly={readOnly}
              busy={busy}
              sampledRuns={job?.sample?.executions}
              onReview={onReviewFinding}
            />
          </FindingsTab>
          <CriteriaTab settings={batchSettings} readOnly={readOnly} onEditCriteria={intents.onEdit} />
          <RunsTab key={job?.id ?? batchId} lens={lens} job={job} />
          <HistoryTab lens={lens} />
        </Tabs>
      </section>
    </div>
  );
}
