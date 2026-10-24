"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

import { Inspector } from "../../../shared/Inspector";
import { Button } from "../../../ui/button";
import { TabsContent } from "../../../ui/tabs";

import { runTime } from "../../model/format";
import { type Job, type Lens } from "../../model/types";
import { EvidenceView } from "../Evidence";
import { FINDING_PANEL_WIDTH_KEY } from "../../storage";
import { useRunEvidenceRoute } from "../../route";
import { useLensTranslate } from "../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../host/lensTranslate";

const PAGE = 50;

interface RunRef {
  readonly id: string;
}

const runKey = (run: RunRef): string => run.id;

function assessmentLabel(assessment: Job["assessments"][number] | undefined): string {
  if (!assessment) return lensTranslate("investigations.reviewed");
  if (assessment.cannot_assess) return lensTranslate("investigations.insufficientEvidence");
  return assessment.issue_checks?.length ? lensTranslate("investigations.issueObserved") : lensTranslate("investigations.noIssueObserved");
}

export interface RunsTabProps {
  readonly lens: Lens;
  readonly job?: Job;
}

/** The runs a batch reviewed; each opens its original trace or request in the side panel. */
export function RunsTab({ lens, job }: RunsTabProps) {
  const t = useLensTranslate();
  const { runId, selectRun } = useRunEvidenceRoute();
  const [runOffset, setRunOffset] = useState(0);
  const [runFilter, setRunFilter] = useState("all");
  const assessments = new Map(job?.assessments?.map((a) => [a.execution_id, a]));
  const runs = job?.sample?.executions ?? [];
  const visibleRuns = runs.filter((run) => {
    const assessment = assessments.get(run.id);
    if (runFilter === "all") return true;
    if (runFilter === "unknown") return !assessment || assessment.cannot_assess;
    if (runFilter === "clear") return assessment && !assessment.cannot_assess && !assessment.issue_checks?.length;
    return assessment?.issue_checks?.includes(runFilter);
  });
  const page: readonly RunRef[] = visibleRuns.slice(runOffset, runOffset + PAGE);
  const selected: RunRef | null = runId === null ? null : runs.find((run) => run.id === runId) ?? { id: runId };
  return (
    <Inspector.Root
      items={page}
      itemKey={runKey}
      selected={selected}
      onSelectedChange={(run) => selectRun(run?.id ?? null)}
      noun="run"
      storageKey={FINDING_PANEL_WIDTH_KEY}
    >
      <TabsContent value="runs" className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {t("investigations.value0SelectedValue1Matching", { value0: runs.length, value1: job?.sample?.eligible ?? 0 })}</p>
          <select
            aria-label={t("investigations.filterReviewedRuns")}
            className="h-8 max-w-full rounded-md border bg-background px-2 text-xs sm:max-w-64"
            value={runFilter}
            onChange={(e) => {
              setRunFilter(e.target.value);
              setRunOffset(0);
            }}
          >
            <option value="all">{t("investigations.allOutcomes")}</option>
            <option value="clear">{t("investigations.noIssueObserved")}</option>
            <option value="unknown">{t("investigations.insufficientEvidenceReviewed")}</option>
            {job?.settings?.context && <option value="expected_behavior">{t("investigations.expectedBehaviorDeviation")}</option>}
            {job?.settings?.checks.map((check) => (
              <option key={check.id} value={check.id}>
                {check.instruction}
              </option>
            ))}
          </select>
        </div>
        <div className="divide-y border-y">
          {visibleRuns.slice(runOffset, runOffset + PAGE).map((run) => (
            <Inspector.Row
              key={run.id}
              item={run}
              render={
                <button
                  type="button"
                  title={run.trace_id}
                  className="group grid w-full grid-cols-[minmax(0,1fr)_16px] items-center gap-x-4 gap-y-1 py-4 text-left hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-ring data-[state=selected]:bg-trace-row-selected data-[state=selected]:shadow-[inset_2px_0_0_var(--trace-brand)] sm:grid-cols-[minmax(0,1fr)_180px_130px_16px]"
                />
              }
            >
              <span className="col-start-1 row-start-1 min-w-0 truncate text-sm font-medium">{run.name}</span>
              <span className="col-start-1 row-start-2 text-xs text-muted-foreground sm:col-start-2 sm:row-start-1">
                {runTime(run.start_time)}
              </span>
              <span className="col-start-1 row-start-3 text-xs text-muted-foreground sm:col-start-3 sm:row-start-1">
                {assessmentLabel(assessments.get(run.id))}
              </span>
              <ChevronRight
                aria-hidden="true"
                className="col-start-2 row-start-1 size-4 text-muted-foreground group-hover:text-foreground sm:col-start-4"
              />
            </Inspector.Row>
          ))}
          {!visibleRuns.length && (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {runs.length
                ? t("investigations.runsMatchOutcome")
                : t("investigations.selectedActivityAppearsWorker")}
            </p>
          )}
        </div>
        {(runOffset > 0 || visibleRuns.length > PAGE) && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Button
              size="sm"
              variant="ghost"
              disabled={!runOffset}
              onClick={() => setRunOffset(Math.max(0, runOffset - PAGE))}
            >
              {t("investigations.previousRuns")}</Button>
            <span>
              {t("investigations.value0Value1Value2", { value0: runOffset + 1, value1: Math.min(runOffset + PAGE, visibleRuns.length), value2: visibleRuns.length })}</span>
            <Button
              size="sm"
              variant="ghost"
              disabled={runOffset + PAGE >= visibleRuns.length}
              onClick={() => setRunOffset(runOffset + PAGE)}
            >
              {t("investigations.nextRuns")}</Button>
          </div>
        )}
      </TabsContent>
      <Inspector.Panel label={t("investigations.runDetails")} testId="run-panel">
        {(run: RunRef) => <EvidenceView lensId={lens.id} evidence={{ id: run.id, span: "" }} />}
      </Inspector.Panel>
    </Inspector.Root>
  );
}
