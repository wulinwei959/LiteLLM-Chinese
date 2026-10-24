"use client";

import { Button } from "../../../../ui/button";

import { isRetryableTraceRead, type TraceReadFailure } from "../../list/traceReadFailure";
import { useLensTranslate } from "../../../../../host/useLensTranslate";
import { lensTranslate } from "../../../../../host/lensTranslate";

interface PagingBannerProps {
  readonly loaded: number;
  readonly total: number;
  readonly failure: TraceReadFailure | null;
  readonly busy: boolean;
  readonly onLoadMore: () => void;
  readonly onRefresh: () => void;
}

/** What the loaded steps are still worth after a later page fails, and what the user can do about it. */
function pageFailureMessage(failure: TraceReadFailure): string {
  switch (failure.kind) {
    case "changed":
      return lensTranslate("traces.traceChangedWhileBrowsing");
    case "invalid":
      return lensTranslate("traces.pageCouldContinuedRefresh");
    case "too_large":
      return lensTranslate("traces.stepNextPageToo");
    case "unavailable":
    case "unknown":
      return lensTranslate("traces.couldLoadMoreSteps");
  }
}

/**
 * Progress through the steps, or what the loaded steps are still worth after a later page failed.
 * Retry keeps the loaded pages and asks for the same page again; Refresh starts a new traversal.
 * Only a temporary failure gets a Retry, because a changed, invalid, or oversized read fails the
 * same way every time.
 */
export function PagingBanner({ loaded, total, failure, busy, onLoadMore, onRefresh }: PagingBannerProps) {
  const t = useLensTranslate();
  const retryable = failure !== null && isRetryableTraceRead(failure);
  const nextLabel = failure ? t("investigations.retry") : t("traces.loadMoreSteps");
  return (
    <div
      className="flex items-center justify-between gap-3 border-b bg-muted/40 px-4 py-1.5 text-xs text-muted-foreground"
      role="status"
    >
      <span>
        {failure
          ? pageFailureMessage(failure)
          : t("traces.showingValue0Value1Steps", { value0: loaded.toLocaleString(), value1: total.toLocaleString() })}
      </span>
      <span className="flex items-center gap-2">
        {failure && (
          <Button size="xs" variant={retryable ? "ghost" : "outline"} disabled={busy} onClick={onRefresh}>
            {t("traces.refreshTrace")}</Button>
        )}
        {(!failure || retryable) && (
          <Button size="xs" variant="outline" disabled={busy} onClick={onLoadMore}>
            {busy ? t("traces.loading") : nextLabel}
          </Button>
        )}
      </span>
    </div>
  );
}
