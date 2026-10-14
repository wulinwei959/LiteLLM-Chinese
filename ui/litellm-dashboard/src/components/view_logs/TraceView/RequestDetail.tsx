"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { LogDetailsDrawer } from "../LogDetailsDrawer";
import { formatCost } from "./AgentTracesTable";
import { DetailGroup } from "./AttributesDetail";
import { CopyButton } from "./CopyButton";
import { type KeyValue, KeyValueRows } from "./KeyValueRows";
import type { Span } from "./traceTypes";
import { fmtMs, fmtTok } from "./traceUtils";
import { useSpanRequestLog } from "./useSpanRequestLog";

interface RequestDetailProps {
  span: Span;
  accessToken: string;
  /** The run's start, so the request log is looked up at the span's time, whatever range the tabs show. */
  traceStartMs: number;
}

/** Request tab for LLM spans; "Open request log" opens the LiteLLM request drawer over the run. */
export function RequestDetail({ span, accessToken, traceStartMs }: RequestDetailProps) {
  const t = useTranslations("logs");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const spanStartMs = traceStartMs + span.start_offset_ms;
  const logQuery = useSpanRequestLog(accessToken, span.litellm_request_id, spanStartMs, drawerOpen);
  const lookupDone = drawerOpen && logQuery.isSuccess;
  const logNotFound = lookupDone && logQuery.data === null;

  if (span.type !== "llm") {
    return <div className="py-16 text-center text-[13px] text-trace-duration">{t("trace.notModelRequest")}</div>;
  }

  const usage: KeyValue[] = [
    [t("trace.usageModel"), span.model ?? "—"],
    [t("trace.usageCost"), span.spend == null ? "—" : formatCost(span.spend)],
    [t("trace.usageInputTokens"), fmtTok(span.input_tokens)],
    [t("trace.usageOutputTokens"), fmtTok(span.output_tokens)],
    [t("trace.usageTotalTokens"), fmtTok(span.input_tokens + span.output_tokens)],
    [t("trace.usageLatency"), fmtMs(span.duration_ms)],
  ];

  return (
    <div className="flex flex-col gap-4 px-7 pt-1 pb-4">
      <DetailGroup title={t("trace.sectionUsage")}>
        <KeyValueRows entries={usage} />
      </DetailGroup>
      <DetailGroup title={t("trace.litellmRequest")}>
        {span.litellm_request_id ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex min-w-0 items-center gap-1">
              <KeyValueRows entries={[["request_id", span.litellm_request_id]]} mono className="min-w-0 flex-1" />
              <CopyButton value={span.litellm_request_id} label={t("trace.copyRequestId")} iconOnly />
            </div>
            <Button
              variant="outline"
              size="xs"
              className="self-start border-trace-border text-[13px] text-trace-text-2 shadow-trace-xs"
              onClick={() => setDrawerOpen(true)}
            >
              {t("trace.openRequestLog")} <ArrowUpRight className="size-3.5" />
            </Button>
            {logNotFound && <p className="text-[13px] text-trace-duration">{t("trace.noRequestLog")}</p>}
          </div>
        ) : (
          <p className="text-[13px] text-trace-duration">{t("trace.notLinked")}</p>
        )}
      </DetailGroup>
      <LogDetailsDrawer
        open={drawerOpen && Boolean(logQuery.data)}
        onClose={() => setDrawerOpen(false)}
        logEntry={logQuery.data ?? null}
        accessToken={accessToken}
      />
    </div>
  );
}
