"use client";

import { Aperture, ArrowUpRight } from "lucide-react";
import { useState } from "react";

import litellmMonogram from "../../../../../../public/assets/logos/litellm_monogram.svg";
import { Button } from "../../../../ui/button";

import { useLensHost } from "../../../../../host/LensHost";
import { formatCost } from "../../list/AgentTracesTable";
import type { Span } from "../../types";
import { useSpanRequestLog } from "../useSpanRequestLog";
import { useLensTranslate } from "../../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../../host/lensTranslate";

const UNMATCHED_REASON: Record<
  Exclude<NonNullable<Span["spend_match"]>, "matched">,
  string
> = {
  get no_call_id() { return lensTranslate("traces.stepRecordsUsableCall"); },
  get no_spend_log() { return lensTranslate("traces.matchingSpendLogBelongs"); },
  get incomplete_evidence() { return lensTranslate("traces.stepAccountEveryRequest"); },
  get ambiguous() { return lensTranslate("traces.recordedIdentifiersSelectOne"); },
};

const LENS_TRACE = { get label() { return lensTranslate("traces.lensTrace"); }, icon: <Aperture aria-hidden /> };

export const unmatchedReason = (span: Span): string | null =>
  span.spend_match && span.spend_match !== "matched"
    ? UNMATCHED_REASON[span.spend_match]
    : null;

export function SpendLogLink({
  span,
  accessToken,
  traceStartMs,
}: {
  span: Span;
  accessToken: string;
  traceStartMs: number;
}) {
  const t = useLensTranslate();
  const { spendLogs } = useLensHost();
  const [open, setOpen] = useState(false);
  const requestId = span.spend_log_request_id ?? null;
  const logQuery = useSpanRequestLog(
    accessToken,
    requestId,
    traceStartMs + span.start_offset_ms,
    open,
  );
  const reason = unmatchedReason(span);

  if (requestId == null) {
    if (!reason) return null;
    return (
      <span
        className="inline-flex items-center gap-1 text-xs text-muted-foreground"
        title={reason}
      >
        {t("investigations.cost")}<span className="font-medium text-foreground">{t("traces.matched")}</span>
      </span>
    );
  }

  const missing = open && logQuery.isSuccess && logQuery.data === null;
  return (
    <>
      <Button
        variant="outline"
        size="xs"
        onClick={() => setOpen(true)}
        title={spendLogs ? requestId : t("traces.connectLiteLLMOpenSpend")}
        disabled={!spendLogs}
        aria-label={t("traces.openLiteLLMSpendLog", { value0: requestId })}
        className="tabular-nums active:scale-[0.97] motion-reduce:transition-none"
      >
        <img
          src={litellmMonogram.src}
          alt=""
          aria-hidden
          className="size-3.5"
        />
        <span className="font-medium">{t("traces.liteLLMSpendLog")}</span>
        {span.spend != null && (
          <span className="text-muted-foreground">
            {formatCost(span.spend)}
          </span>
        )}
        <ArrowUpRight data-icon="inline-end" />
      </Button>
      {missing && (
        <span className="text-xs text-muted-foreground">
          {t("traces.spendLogVisibleTime")}</span>
      )}
      {spendLogs && (
        <spendLogs.Drawer
          open={open && Boolean(logQuery.data)}
          onClose={() => setOpen(false)}
          logEntry={logQuery.data ?? null}
          accessToken={accessToken}
          backTo={LENS_TRACE}
        />
      )}
    </>
  );
}
