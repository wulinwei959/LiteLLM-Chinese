"use client";

import { PanelRightClose } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cva.config";

import { AttributesDetail } from "./AttributesDetail";
import { CopyButton } from "./CopyButton";
import { DetailContent, errorHeadline, useSpanDetail } from "./DetailContent";
import { IdChip } from "./IdChip";
import { RequestDetail } from "./RequestDetail";
import { SpanIcon } from "./SpanIcon";
import { agentHandoffText } from "./TraceDrawer";
import type { GroupRowData, TreeRow } from "./traceTree";
import type { Span, SpanType, Trace } from "./traceTypes";
import { fmtMs, fmtTok } from "./traceUtils";

interface DetailPaneProps {
  trace: Trace;
  row: TreeRow | undefined;
  accessToken: string;
  onClose: () => void;
}

type Tab = "content" | "request" | "attributes";

type TabLabelKey = "trace.tabContent" | "trace.tabRequest" | "trace.tabAttributes";

const TABS: { id: Tab; labelKey: TabLabelKey }[] = [
  { id: "content", labelKey: "trace.tabContent" },
  { id: "request", labelKey: "trace.tabRequest" },
  { id: "attributes", labelKey: "trace.tabAttributes" },
];

function PaneHeader({
  type,
  model,
  failed,
  title,
  idValue,
  onClose,
}: {
  type: SpanType;
  model: string | null;
  failed: boolean;
  title: React.ReactNode;
  idValue?: string;
  onClose: () => void;
}) {
  const t = useTranslations("logs");
  return (
    <div className="flex h-6 shrink-0 items-center justify-between gap-4 px-7">
      <div className="flex min-w-0 items-center">
        <span className="mr-2 shrink-0">
          <SpanIcon type={type} model={model} error={failed} size="md" />
        </span>
        <h2 className="min-w-0 truncate text-[14px] leading-5 font-medium tracking-[-0.56px] text-trace-text">
          {title}
        </h2>
        {idValue && (
          <span className="ml-2 flex shrink-0">
            <IdChip value={idValue} label={t("trace.copySpanId")} />
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        onClick={onClose}
        aria-label={t("trace.closeDetails")}
        className="size-6 shrink-0 rounded-[4px] text-trace-text-2"
      >
        <PanelRightClose className="size-4" />
      </Button>
    </div>
  );
}

function PaneFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-2 border-t border-trace-border bg-trace-surface px-7">
      {children}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-trace-key">{label} </span>
      {value}
    </span>
  );
}

function SpanPane({
  trace,
  span,
  accessToken,
  onClose,
}: {
  trace: Trace;
  span: Span;
  accessToken: string;
  onClose: () => void;
}) {
  const t = useTranslations("logs");
  const [tab, setTab] = useState<Tab>("content");
  const traceId = trace.summary.trace_id;
  const detailQuery = useSpanDetail(
    accessToken,
    traceId,
    tab === "attributes" ? span.span_id : null,
    trace.summary.trace_ref,
  );
  const tokens = span.input_tokens + span.output_tokens;
  return (
    <aside
      className="flex h-full min-w-0 animate-view-fade-in flex-col bg-trace-surface pt-4 text-[13px] text-trace-text motion-reduce:animate-none"
      aria-label={t("trace.spanDetails")}
    >
      <PaneHeader
        type={span.type}
        model={span.model}
        failed={span.status === "error"}
        title={span.type === "llm" ? span.model || span.name : span.name}
        idValue={span.span_id}
        onClose={onClose}
      />
      <div
        role="tablist"
        aria-label={t("trace.spanSections")}
        className="flex shrink-0 items-center gap-2 py-2 pr-2 pl-6"
      >
        {TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            role="tab"
            aria-selected={tab === tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={cn(
              "rounded-[4px] px-2 py-1 text-[13px] leading-[18px] font-medium transition-colors duration-100 focus-visible:outline-2 focus-visible:outline-trace-brand motion-reduce:transition-none",
              tab === tabItem.id
                ? "bg-trace-tab-active text-trace-text hover:bg-trace-tab-hover"
                : "text-trace-key hover:bg-trace-tab-active",
            )}
          >
            {t(tabItem.labelKey)}
          </button>
        ))}
      </div>
      <div key={tab} role="tabpanel" className="min-h-0 flex-1 overflow-auto">
        {tab === "content" && (
          <DetailContent accessToken={accessToken} traceId={traceId} traceRef={trace.summary.trace_ref} span={span} />
        )}
        {tab === "request" && (
          <RequestDetail span={span} accessToken={accessToken} traceStartMs={Date.parse(trace.summary.start_time)} />
        )}
        {tab === "attributes" && (
          <AttributesDetail
            traceId={traceId}
            span={span}
            attributes={detailQuery.data?.attributes}
            isLoading={detailQuery.isLoading}
          />
        )}
      </div>
      <PaneFooter>
        <CopyButton
          value={agentHandoffText(t, traceId, span.span_id, trace.summary.trace_ref)}
          label={t("trace.copyStep")}
          copiedLabel={t("trace.commandCopied")}
        />
        <div className="ml-auto flex items-center gap-3 text-[13px] text-trace-duration tabular-nums">
          <Meta label={t("trace.metaTime")} value={fmtMs(span.duration_ms)} />
          {tokens > 0 && <Meta label={t("tokens")} value={fmtTok(tokens)} />}
        </div>
      </PaneFooter>
    </aside>
  );
}

function GroupMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-r border-b border-trace-card-border p-3">
      <div className="text-[13px] font-medium text-trace-key">{label}</div>
      <div className="mt-1 text-[13px] text-trace-text tabular-nums">{value}</div>
    </div>
  );
}

/** ×N group: rollup of every invocation plus the first failure's message. */
function GroupPane({ trace, row, onClose }: { trace: Trace; row: GroupRowData; onClose: () => void }) {
  const t = useTranslations("logs");
  const tokens = row.members.reduce((sum, m) => sum + m.input_tokens + m.output_tokens, 0);
  const firstFailure = row.members.find((m) => m.status === "error" && m.error);
  return (
    <aside
      className="flex h-full min-w-0 animate-view-fade-in flex-col bg-trace-surface pt-4 text-[13px] text-trace-text motion-reduce:animate-none"
      aria-label={t("trace.groupDetails")}
    >
      <PaneHeader
        type={row.type}
        model={row.members[0]?.model ?? null}
        failed={row.failedCount > 0}
        title={
          <>
            {row.name} <span className="text-trace-duration">×{row.members.length}</span>
          </>
        }
        onClose={onClose}
      />
      <div className="min-h-0 flex-1 overflow-auto px-7 py-3">
        <div className="grid grid-cols-2 overflow-hidden rounded-[4px] border border-trace-card-border bg-trace-surface">
          <GroupMetric label={t("trace.groupInvocations")} value={row.members.length.toLocaleString()} />
          <GroupMetric label={t("trace.groupFailed")} value={row.failedCount.toLocaleString()} />
          <GroupMetric label={t("trace.groupP50Latency")} value={fmtMs(row.p50Duration)} />
          <GroupMetric label={t("tokens")} value={fmtTok(tokens)} />
          <GroupMetric label={t("trace.groupAgent")} value={row.agent || "—"} />
          <GroupMetric label={t("trace.groupType")} value={row.type} />
        </div>
        {firstFailure?.error && (
          <section className="mt-3 rounded-[4px] border border-destructive/30 px-3.5 py-3">
            <div className="text-[12px] font-medium text-destructive">{t("trace.failurePattern")}</div>
            <p className="mt-2 font-mono text-[12px] leading-5 text-foreground">{errorHeadline(firstFailure.error)}</p>
          </section>
        )}
      </div>
      <PaneFooter>
        <CopyButton
          value={agentHandoffText(t, trace.summary.trace_id, (firstFailure ?? row.members[0]).span_id)}
          label={t("trace.copyGroupSample")}
        />
      </PaneFooter>
    </aside>
  );
}

/** Right pane of the run view: switches on the selected tree row. */
export function DetailPane({ trace, row, accessToken, onClose }: DetailPaneProps) {
  const t = useTranslations("logs");
  if (!row || row.kind === "load-more") {
    return (
      <div className="grid h-full place-items-center bg-trace-surface text-[13px] text-trace-duration">
        {t("trace.selectSpanHint")}
      </div>
    );
  }
  if (row.kind === "group") return <GroupPane key={row.id} trace={trace} row={row} onClose={onClose} />;
  return <SpanPane key={row.id} trace={trace} span={row.span} accessToken={accessToken} onClose={onClose} />;
}
