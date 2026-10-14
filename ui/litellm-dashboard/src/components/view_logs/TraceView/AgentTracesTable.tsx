"use client";

import { ArrowDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cva.config";
import { formatActivityTimestamp } from "@/utils/activityTimestamp";

import { StatusMark } from "./StatusMark";
import type { TraceSummary } from "./traceTypes";
import { fmtMs, previewText, traceDisplayName } from "./traceUtils";

interface AgentTracesTableProps {
  traces: TraceSummary[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenTrace: (trace: TraceSummary) => void;
  selectedKey?: string | null;
}

export const formatCost = (cost: number): string => {
  if (cost === 0) return "$0.00";
  if (cost < 0.01) return `$${cost.toFixed(4)}`;
  return `$${cost.toFixed(2)}`;
};

const firstLine = (text: string): string => text.split("\n")[0] ?? text;

const TH = "px-3 font-medium";
const TH_NUM = "px-3 text-right font-medium";
const TD_NUM = "px-3 text-right font-mono tabular-nums text-muted-foreground";

/** Devtool-dense runs list: one row per agent run, newest first. */
export function AgentTracesTable({
  traces,
  isLoading,
  error,
  hasMore,
  onLoadMore,
  onOpenTrace,
  selectedKey = null,
}: AgentTracesTableProps) {
  const t = useTranslations("logs");
  const isEmpty = !isLoading && !error && traces.length === 0;
  return (
    <div className="min-h-0 flex-1 overflow-auto" data-testid="runs-table">
      <table
        aria-label={t("traceList.runsAria")}
        className="w-full min-w-[900px] table-fixed border-collapse text-left"
      >
        <thead className="sticky top-0 z-sticky bg-muted/40 backdrop-blur">
          <tr className="h-8 border-b border-border text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
            <th className={`w-[190px] ${TH}`}>
              <span className="inline-flex items-center gap-1">
                {t("columns.time")} <ArrowDown className="size-2.5" />
              </span>
            </th>
            <th className={`w-[160px] ${TH}`}>{t("traceList.colAgent")}</th>
            <th className={TH}>{t("drawer.input")}</th>
            <th className={`w-[72px] ${TH_NUM}`}>{t("traceList.colAgents")}</th>
            <th className={`w-[74px] ${TH_NUM}`}>{t("traceList.colSteps")}</th>
            <th className={`w-[86px] ${TH_NUM}`}>{t("trace.factDuration")}</th>
            <th className={`w-[80px] ${TH_NUM}`}>{t("cost")}</th>
            <th className={`w-[72px] ${TH_NUM}`}>{t("traceList.failed")}</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {traces.map((run) => (
            <tr
              key={run.trace_ref || run.trace_id}
              data-testid="agent-trace-row"
              onClick={() => onOpenTrace(run)}
              aria-selected={selectedKey === (run.trace_ref || run.trace_id)}
              className={cn(
                "h-9 cursor-pointer border-b border-border/60 text-[12px] transition-colors duration-150 motion-reduce:transition-none",
                selectedKey === (run.trace_ref || run.trace_id)
                  ? "bg-trace-row-selected shadow-[inset_2px_0_0_var(--trace-brand)]"
                  : "hover:bg-trace-row-hover",
              )}
            >
              <td
                className="px-3 font-mono text-[11px] tabular-nums text-muted-foreground"
                title={formatActivityTimestamp(run.start_time)}
              >
                {formatActivityTimestamp(run.start_time)}
              </td>
              <td className="truncate px-3 text-muted-foreground" title={run.service}>
                {run.service}
              </td>
              <td className="px-3">
                <div className="flex min-w-0 items-center gap-2">
                  <StatusMark status={run.error_count > 0 ? "error" : "ok"} subtle />
                  <span className="truncate text-foreground">
                    {firstLine(previewText(run.input_preview)) || traceDisplayName(run)}
                  </span>
                  <span className="hidden shrink-0 font-mono text-[10px] text-muted-foreground 2xl:inline">
                    {run.trace_id}
                  </span>
                </div>
              </td>
              <td className={TD_NUM}>{run.agent_count.toLocaleString()}</td>
              <td className={TD_NUM}>{run.span_count.toLocaleString()}</td>
              <td className="px-3 text-right font-mono tabular-nums text-foreground">{fmtMs(run.duration_ms)}</td>
              <td className="px-3 text-right font-mono tabular-nums text-foreground">
                {run.spend == null ? "—" : formatCost(run.spend)}
              </td>
              <td className="px-3 text-right">
                {run.error_count > 0 ? (
                  <StatusMark status="error" count={run.error_count} />
                ) : (
                  <span className="font-mono text-[11px] text-muted-foreground/60">0</span>
                )}
              </td>
              <td>
                <ChevronRight className="size-3 text-muted-foreground/60" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && (
        <div className="py-16 text-center text-[12px] text-muted-foreground">{t("traceList.loadingRuns")}</div>
      )}
      {error && (
        <div className="py-16 text-center text-[12px] text-muted-foreground">
          {t("traceList.loadRunsError", { message: error.message })}
        </div>
      )}
      {isEmpty && (
        <div className="py-16 text-center text-[12px] text-muted-foreground">{t("traceList.noRunsMatch")}</div>
      )}
      {hasMore && (
        <div className="border-t border-border/60 px-3 py-2">
          <Button size="xs" variant="ghost" onClick={onLoadMore}>
            {t("traceList.loadMore")}
          </Button>
        </div>
      )}
    </div>
  );
}
