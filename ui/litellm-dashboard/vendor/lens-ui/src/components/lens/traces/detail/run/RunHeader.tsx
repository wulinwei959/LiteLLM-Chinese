"use client";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  DatabaseZap,
  Link,
  ListTree,
  MessagesSquare,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useTimeout } from "usehooks-ts";

import { Button } from "../../../../ui/button";
import { ButtonGroup } from "../../../../ui/button-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../ui/dropdown-menu";
import { TabsList, TabsTrigger } from "../../../../ui/tabs";
import { cn } from "../../../../../lib/cva.config";
import { copyToClipboard } from "../../../../../utils/dataUtils";

import { AddToDatasetDialog, useCanAddToDataset } from "../../../datasets/AddToDatasetDialog";
import type { TraceHandoff } from "../../api";
import { runCost } from "../../list/AgentTracesTable";
import { traceRefOf, traceShareUrl } from "../../routing";
import { IdChip } from "../../ui/IdChip";
import { RunSourceLink, RunUser } from "../../ui/RunSource";
import { SpanIcon } from "../../ui/SpanIcon";
import { FrameworkLogo, traceFramework } from "../../ui/TraceFramework";
import type { SignalFlag, Trace } from "../../types";
import { SignalPills } from "../../ui/SignalPills";
import { fmtMs, fmtTok, traceAgentNames, traceDisplayName } from "../../utils";
import styles from "../../TraceAppearance.module.css";
import { useLensTranslate } from "../../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../../host/lensTranslate";

type Summary = Trace["summary"];

function statusLabel(failed: boolean, errors: number): string {
  if (errors === 0) return failed ? lensTranslate("traces.errorsRecorded") : lensTranslate("traces.recorded");
  const stepErrors = lensTranslate("traces.value0StepValue1", { value0: errors.toLocaleString(), value1: errors === 1 ? "error" : "errors" });
  return failed ? stepErrors : lensTranslate("traces.recordedValue0", { value0: stepErrors });
}

/** One pill for how the run went, so a failure is stated once instead of as a pill, a stat and a red icon. */
function StatusPill({ summary }: { summary: Summary }) {
  const t = useLensTranslate();
  const failed = summary.status === "error";
  const label = statusLabel(failed, summary.error_count);
  return (
    <span
      title={t("traces.statusReceivedSpansMore")}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-mono text-[11px] font-medium",
        failed ? "bg-destructive/10 text-destructive" : "bg-trace-ok text-trace-ok-glyph",
      )}
    >
      <span className={cn("size-1.5 rounded-full", failed ? "bg-destructive" : "bg-trace-ok-glyph")} />
      {label}
    </span>
  );
}

/** Duration, steps, tokens and cost as one quiet line; cost is left out when nothing was priced. */
function Totals({ summary }: { summary: Summary }) {
  const t = useLensTranslate();
  const cost = runCost(summary);
  const parts = [
    fmtMs(summary.duration_ms),
    t("traces.value0Steps", { value0: summary.span_count.toLocaleString() }),
    t("traces.value0Tokens", { value0: fmtTok(summary.input_tokens + summary.output_tokens) }),
    cost && [cost.label, cost.partial?.long].filter(Boolean).join(" · "),
  ].filter(Boolean);
  return <span className="font-mono text-[11px] text-foreground tabular-nums">{parts.join(" · ")}</span>;
}

function RunIcon({ summary }: { summary: Summary }) {
  const framework = traceFramework(summary);
  if (!framework) return <SpanIcon type="agent" size="lg" />;
  return (
    <span
      className="inline-flex h-6 shrink-0 items-center gap-1.5 rounded-md border border-border px-1.5 text-xs text-muted-foreground"
      data-testid="run-framework"
      title={framework.label}
    >
      <FrameworkLogo framework={framework} />
      {traceAgentNames(summary).join(", ") || framework.label}
    </span>
  );
}

/** "Copy for agent" up front; the link and dataset actions sit behind its chevron. */
function RunActions({ summary, handoff }: { summary: Summary; handoff: TraceHandoff }) {
  const t = useLensTranslate();
  const canAddToDataset = useCanAddToDataset();
  const [copied, setCopied] = useState(false);
  const [addingToDataset, setAddingToDataset] = useState(false);
  useTimeout(() => setCopied(false), copied ? 1600 : null);
  return (
    <>
      <ButtonGroup>
        <Button
          variant="outline"
          size="xs"
          className="h-7 gap-1.5 border-primary/20 bg-primary/5 font-mono text-[11px] text-primary shadow-none hover:bg-primary/10"
          onClick={async () => setCopied(await copyToClipboard(handoff.text, handoff.copied))}
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? t("onboarding.copied") : t("investigations.copyAgent")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon-xs" className="h-7 w-7 shadow-none" aria-label={t("traces.moreRunActions")} />
            }
          >
            <ChevronDown className="size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() =>
                void copyToClipboard(traceShareUrl(traceRefOf(summary), window.location), t("traces.traceLinkCopied"))
              }
            >
              <Link />
              {t("traces.copyLink")}</DropdownMenuItem>
            {canAddToDataset && (
              <DropdownMenuItem onClick={() => setAddingToDataset(true)}>
                <DatabaseZap />
                {t("traces.addRunDataset")}</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      {addingToDataset && (
        <AddToDatasetDialog
          sources={[{ kind: "trace", trace_id: summary.trace_id, trace_ref: summary.trace_ref ?? "", span_id: "" }]}
          agentName={traceAgentNames(summary)[0]}
          onClose={() => setAddingToDataset(false)}
        />
      )}
    </>
  );
}

interface RunHeaderProps {
  trace: Trace;
  handoff: TraceHandoff;
  onBack: () => void;
  embedded: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  live: boolean;
  canLive: boolean;
  onLiveChange: () => void;
  signals?: readonly SignalFlag[];
}

/** Row one says which agent ran, for whom and from where; row two says how it went. */
export function RunHeader({
  trace,
  handoff,
  onBack,
  embedded,
  refreshing,
  onRefresh,
  live,
  canLive,
  onLiveChange,
  signals = [],
}: RunHeaderProps) {
  const t = useLensTranslate();
  const { summary } = trace;
  return (
    <header className={cn(styles.detailHeader, "flex shrink-0 flex-col gap-2 border-b px-4 pt-3 pb-2.5")}>
      <div className="flex min-w-0 items-center gap-2">
        {!embedded && (
          <Button variant="ghost" size="icon-xs" onClick={onBack} aria-label={t("traces.backRuns")}>
            <ArrowLeft className="size-4" />
          </Button>
        )}
        <RunIcon summary={summary} />
        <h1 className="min-w-0 shrink truncate font-mono text-sm font-semibold">{traceDisplayName(summary)}</h1>
        {summary.source?.user && <RunUser user={summary.source.user} />}
        {summary.source && <RunSourceLink source={summary.source} />}
        <IdChip value={summary.trace_id} label={t("traces.copyTraceID")} />
        <div className="ml-auto flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="xs"
            aria-pressed={live}
            disabled={!canLive}
            onClick={onLiveChange}
            aria-label={t("traces.liveUpdates")}
            title={live ? t("traces.liveRefreshesEvery30s") : t("traces.pausedClickFollowLive")}
            className="font-mono text-[11px] text-muted-foreground"
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                live ? "bg-trace-ok-glyph motion-safe:animate-pulse" : "bg-muted-foreground/50",
              )}
            />
            {t("traces.live")}</Button>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled={refreshing}
            onClick={onRefresh}
            aria-label={t("traces.refreshRun")}
            title={t("traces.refresh")}
            className="mr-1 text-muted-foreground"
          >
            <RefreshCw className={cn("size-3.5", refreshing && "animate-spin")} />
          </Button>
          <RunActions summary={summary} handoff={handoff} />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
        <StatusPill summary={summary} />
        {signals.length > 0 && <SignalPills flags={signals} showScore className="flex-wrap" />}
        <Totals summary={summary} />
        <TabsList
          aria-label={t("traces.traceView")}
          className={cn(styles.viewTabs, "ml-auto rounded-md border bg-background/70 group-data-horizontal/tabs:h-7")}
        >
          <TabsTrigger value="steps" className="gap-1.5 rounded-sm px-2.5 font-mono text-[11px]">
            <ListTree className="size-3.5" />
            {t("traces.steps")}</TabsTrigger>
          <TabsTrigger value="thread" className="gap-1.5 rounded-sm px-2.5 font-mono text-[11px]">
            <MessagesSquare className="size-3.5" />
            {t("traces.thread")}</TabsTrigger>
        </TabsList>
      </div>
    </header>
  );
}
