"use client";

import CopyButton from "../../../../shared/CopyButton";

import { AddToDatasetButton } from "../../../datasets/AddToDatasetDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs";

import { useTracesApi } from "../../api";
import { formatCost } from "../../list/AgentTracesTable";
import { SPAN_TABS, type SpanTab } from "../../routing";
import type { Span, Trace } from "../../types";
import { fmtMs, fmtTok } from "../../utils";
import { ContentTab, useSpanDetail } from "../content/ContentTab";
import { AttributesTab } from "./AttributesTab";
import { PaneHeader } from "./PaneHeader";
import { RequestTab } from "./RequestTab";
import { SpendLogLink } from "./SpendLogLink";
import { useLensTranslate } from "../../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../../host/lensTranslate";

const TAB_LABELS: Record<SpanTab, string> = { get content() { return lensTranslate("traces.content"); }, get request() { return lensTranslate("traces.request"); }, get attributes() { return lensTranslate("traces.attributes"); } };

export interface SpanTabProps {
  spanTab: SpanTab;
  onSpanTabChange: (tab: SpanTab) => void;
}

type Fact = readonly [label: string, value: string];

const TURN_TYPES: ReadonlySet<Span["type"]> = new Set(["agent", "llm"]);

const spanFacts = (span: Span): readonly Fact[] => {
  const tokens = span.input_tokens + span.output_tokens;
  const optional: readonly (Fact | null)[] = [
    tokens > 0 ? [lensTranslate("traces.tokens"), fmtTok(tokens)] : null,
    span.spend != null && span.spend_log_request_id == null ? [lensTranslate("investigations.cost"), formatCost(span.spend)] : null,
    span.type === "llm" && span.model ? [lensTranslate("traces.step"), span.name] : null,
  ];
  return [[lensTranslate("investigations.duration"), fmtMs(span.duration_ms)], ...optional.filter((fact): fact is Fact => fact !== null)];
};

export function SpanPane({
  trace,
  span,
  accessToken,
  spanTab: tab,
  onSpanTabChange,
  onClose,
}: SpanTabProps & { trace: Trace; span: Span; accessToken: string; onClose: () => void }) {
  const t = useLensTranslate();
  const { trace_id: traceId, trace_ref: traceRef, start_time: startTime } = trace.summary;
  const handoff = useTracesApi(accessToken).handoff(traceId, span.span_id, traceRef);
  const traceStartMs = Date.parse(startTime);
  const detailQuery = useSpanDetail(accessToken, traceId, tab === "attributes" ? span.span_id : null, traceRef);
  return (
    <aside className="flex h-full min-w-0 flex-col bg-background text-sm text-foreground" aria-label={t("traces.spanDetails")}>
      <PaneHeader
        type={span.type}
        model={span.model}
        failed={span.status === "error"}
        title={span.type === "llm" ? span.model || span.name : span.name}
        idValue={span.span_id}
        facts={spanFacts(span)}
        links={<SpendLogLink span={span} accessToken={accessToken} traceStartMs={traceStartMs} />}
        actions={
          <>
            {TURN_TYPES.has(span.type) && (
              <AddToDatasetButton
                sources={[{ kind: "trace", trace_id: traceId, trace_ref: traceRef ?? "", span_id: span.span_id }]}
                agentName={span.agent}
                label={t("traces.addTurnDataset")}
                className="h-6"
              />
            )}
            <CopyButton variant="action" value={handoff.text} label={t("traces.copyStep")} copiedLabel={handoff.copied} />
          </>
        }
        onClose={onClose}
      />
      <Tabs value={tab} onValueChange={(value) => onSpanTabChange(value as SpanTab)} className="min-h-0 flex-1 gap-0">
        <div className="shrink-0 border-b px-4">
          <TabsList variant="line" aria-label={t("traces.spanDetailSections")} className="h-9 gap-4 px-0">
            {SPAN_TABS.map((id) => (
              <TabsTrigger key={id} value={id} className="flex-none px-0 text-sm">
                {TAB_LABELS[id]}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="content" className="min-h-0 overflow-auto">
          <ContentTab accessToken={accessToken} traceId={traceId} traceRef={traceRef} span={span} />
        </TabsContent>
        <TabsContent value="request" className="min-h-0 overflow-auto">
          <RequestTab span={span} accessToken={accessToken} traceStartMs={traceStartMs} />
        </TabsContent>
        <TabsContent value="attributes" className="min-h-0 overflow-auto">
          <AttributesTab
            traceId={traceId}
            span={span}
            attributes={detailQuery.data?.attributes}
            isLoading={detailQuery.isLoading}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
