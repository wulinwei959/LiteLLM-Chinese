"use client";

import { useTranslations } from "next-intl";
import React, { useMemo } from "react";
import type { DailyData } from "@/components/UsagePage/types";
import { cn } from "@/lib/cva.config";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { dailyTotals, formatCompact, formatLatency, formatUsd, type OverviewTotals } from "./overviewData";
import { PANEL_INSET_X, Sparkline, Stat } from "./Primitives";

const BRAND = "#2b3fd6";

interface UsageStatStripProps {
  results: readonly DailyData[];
  totals: OverviewTotals;
  loading: boolean;
  requestCountsPending: boolean;
  budget: number | null;
}

/** Spend, requests, tokens and averages for a range, each with a daily sparkline. */
export default function UsageStatStrip({
  results,
  totals,
  loading,
  requestCountsPending,
  budget,
}: UsageStatStripProps) {
  const t = useTranslations("usage.overview");
  const daily = useMemo(() => dailyTotals(results), [results]);
  return (
    <div className="grid grid-cols-1 overflow-hidden rounded-xl border bg-card sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
      <StatCell trend={<Sparkline data={daily} dataKey="spend" color={BRAND} className="h-14" />}>
        <Stat
          label={t("statStrip.spend")}
          value={formatUsd(totals.spend)}
          pending={loading}
          hint={budget ? t("statStrip.ofBudget", { amount: formatUsd(budget) }) : t("statStrip.noBudgetSet")}
        />
      </StatCell>
      <StatCell trend={<Sparkline data={daily} dataKey="requests" color={BRAND} className="h-14" />}>
        <Stat
          label={t("statStrip.totalRequests")}
          value={totals.requests.toLocaleString()}
          pending={requestCountsPending}
        />
        {!requestCountsPending && (
          <div className="mt-0.5 flex gap-3 text-xs leading-4 text-muted-foreground">
            <span>
              <span className="text-success tabular-nums">{totals.successful.toLocaleString()}</span>{" "}
              {t("statStrip.ok")}
            </span>
            <span>
              <span className={totals.failed > 0 ? "text-destructive tabular-nums" : "tabular-nums"}>
                {totals.failed.toLocaleString()}
              </span>{" "}
              {t("statStrip.failed")}
            </span>
          </div>
        )}
      </StatCell>
      <StatCell trend={<Sparkline data={daily} dataKey="tokens" color={BRAND} className="h-14" />}>
        <Stat
          label={t("statStrip.totalTokens")}
          value={loading ? null : formatCompact(totals.tokens)}
          exact={t("statStrip.tokensExact", { count: totals.tokens.toLocaleString() })}
          pending={loading}
          hint={loading ? undefined : t("statStrip.cacheRead", { count: formatCompact(totals.cacheReadTokens) })}
        />
        {!loading && (
          <Popover>
            <PopoverTrigger className="mt-1 text-xs font-medium text-primary underline-offset-4 hover:underline">
              View token breakdown
            </PopoverTrigger>
            <PopoverContent side="right" align="start" className="w-80 gap-3">
              <PopoverTitle>What counts toward total tokens?</PopoverTitle>
              <dl className="space-y-2 text-sm tabular-nums">
                <div className="flex justify-between gap-4">
                  <dt>Input tokens</dt>
                  <dd>{totals.inputTokens.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4 pl-3 text-xs text-muted-foreground">
                  <dt>Cache reads</dt>
                  <dd>{totals.cacheReadTokens.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4 pl-3 text-xs text-muted-foreground">
                  <dt>Cache writes</dt>
                  <dd>{totals.cacheWriteTokens.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt>Output tokens</dt>
                  <dd>{totals.outputTokens.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t pt-2 font-medium">
                  <dt>Total tokens</dt>
                  <dd>{totals.tokens.toLocaleString()}</dd>
                </div>
              </dl>
              <p className="text-xs leading-5 text-muted-foreground">
                Input includes cache reads and writes. Cached input has separate pricing, so total tokens alone cannot
                explain the cost.
              </p>
              <p className="text-xs leading-5 text-muted-foreground">
                A client may show a different subset of tokens. Compare the same person, client and time range before
                comparing counts.
              </p>
            </PopoverContent>
          </Popover>
        )}
      </StatCell>
      <StatCell>
        <div className="grid gap-3">
          <Stat
            label={t("statStrip.avgCostPerRequest")}
            value={formatUsd(totals.avgCostPerRequest, 4)}
            pending={loading}
          />
          <Stat
            label={t("statStrip.avgLatency")}
            value={totals.avgLatencyMs === null ? "—" : formatLatency(totals.avgLatencyMs)}
            pending={loading}
            hint={
              totals.successRate === null
                ? undefined
                : t("statStrip.successRate", { rate: totals.successRate.toFixed(1) })
            }
          />
        </div>
      </StatCell>
    </div>
  );
}

function StatCell({ children, trend }: { children: React.ReactNode; trend?: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col justify-between gap-3 border-b py-4 last:border-b-0 lg:border-b-0",
        PANEL_INSET_X,
      )}
    >
      <div className="min-w-0">{children}</div>
      {trend}
    </div>
  );
}
