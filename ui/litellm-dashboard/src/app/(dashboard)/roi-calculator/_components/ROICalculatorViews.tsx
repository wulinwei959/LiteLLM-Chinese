"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { coverageLabel, peopleCsv, effortNote, estimateLabel, formatMoney, formatNumber } from "./roiCalculatorData";
import type { ROIPerson, ROIPull, ROISummary } from "./roiCalculatorData";

export function ROIOverview({
  summary,
  pulls,
  query,
  onQueryChange,
  onSelectPull,
  onViewPeople,
}: {
  summary: ROISummary;
  pulls: ROIPull[];
  query: string;
  onQueryChange: (value: string) => void;
  onSelectPull: (pull: ROIPull) => void;
  onViewPeople: () => void;
}) {
  const t = useTranslations("roiCalculator");
  const [pagination, setPagination] = React.useState({ query, visibleCount: 10 });
  const visibleCount = pagination.query === query ? pagination.visibleCount : 10;
  const chartConfig = {
    spend: { label: t("chartMatchedSpend"), color: "var(--chart-1)" },
    hours: { label: t("estimatedHours"), color: "var(--chart-2)" },
  } satisfies ChartConfig;
  const metrics = summary.metrics;
  const unavailableRate = metrics.output_hours > 0 ? t("unavailableRateIncomplete") : t("unavailableRateNoHours");
  const cohortSummaryValues = {
    count: metrics.cohort_people,
    matched: metrics.matched_prs,
    merged: metrics.merged_prs,
    excluded: formatMoney(metrics.excluded_spend),
    total: formatMoney(metrics.total_spend),
  };
  return (
    <div className="space-y-6">
      <section aria-label={t("spendAndEffort")} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title={t("metricCostPerHour")} value={formatMoney(metrics.cost_per_hour)} />
        <MetricCard title={t("metricMatchedSpend")} value={formatMoney(metrics.matched_spend)} />
        <MetricCard
          title={t("estimatedEngineeringHours")}
          value={t("hoursUnit", { value: formatNumber(metrics.output_hours) })}
        />
        <MetricCard title={t("metricPrCoverage")} value={coverageLabel(t, summary)} />
      </section>
      <p className="text-sm text-muted-foreground">
        {t("excludedSpend", { excluded: formatMoney(metrics.excluded_spend), total: formatMoney(metrics.total_spend) })}
      </p>
      <details className="rounded-lg border p-4 text-sm">
        <summary className="cursor-pointer font-medium">{t("calculationDetails")}</summary>
        <div className="space-y-3 pt-3 text-muted-foreground">
          <p>
            {metrics.cost_per_hour != null
              ? t("rateCalculation", {
                  matched: formatMoney(metrics.matched_spend),
                  hours: formatNumber(metrics.output_hours),
                  rate: formatMoney(metrics.cost_per_hour),
                })
              : unavailableRate}
          </p>
          <p>{t("cohortSummary", cohortSummaryValues)}</p>
          <p>{t("spendIncludes")}</p>
          <Button variant="link" className="h-auto p-0" onClick={onViewPeople}>
            {t("reviewEmailMatches")}
          </Button>
        </div>
      </details>

      <Card>
        <CardHeader>
          <CardTitle>{t("spendAndEffort")}</CardTitle>
          <CardDescription>{t("spendAndEffortDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <ComposedChart data={summary.trend} margin={{ left: 8, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={36} />
              <YAxis yAxisId="spend" tickFormatter={(value) => formatMoney(Number(value))} />
              <YAxis yAxisId="hours" orientation="right" domain={[0, "auto"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar yAxisId="spend" dataKey="spend" fill="var(--color-spend)" isAnimationActive={false} />
              <Line
                yAxisId="hours"
                dataKey="hours"
                stroke="var(--color-hours)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle>{t("pullRequests")}</CardTitle>
            <CardDescription>
              {t("pullRequestsSummary", {
                merged: metrics.merged_prs,
                estimated: metrics.estimated_prs,
                pending: metrics.pending_prs,
              })}
            </CardDescription>
          </div>
          <Input
            aria-label={t("searchPullRequests")}
            className="w-full sm:max-w-xs"
            placeholder={t("searchPullRequests")}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("pullRequest")}</TableHead>
                <TableHead className="text-right">{t("estimatedHours")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pulls.slice(0, visibleCount).map((pull) => (
                <TableRow key={`${pull.repo}#${pull.number}`}>
                  <TableCell>
                    <Button
                      aria-label={t("openEstimateAriaLabel", { repo: pull.repo, number: pull.number })}
                      className="h-auto whitespace-normal p-0 text-left"
                      variant="link"
                      onClick={() => onSelectPull(pull)}
                    >
                      <span>
                        <span className="block font-medium">{pull.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {pull.repo} #{pull.number} · {pull.login}
                        </span>
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{estimateLabel(t, pull.estimate)}</TableCell>
                </TableRow>
              ))}
              {pulls.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground" colSpan={2}>
                    {query ? t("noMatchingPullRequests") : t("noMergedPullRequests")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {pulls.length > visibleCount && (
            <Button
              variant="link"
              className="px-0"
              onClick={() =>
                setPagination((current) => ({
                  query,
                  visibleCount: (current.query === query ? current.visibleCount : 10) + 25,
                }))
              }
            >
              {t("loadMorePullRequests")}
            </Button>
          )}
          <Button variant="outline" onClick={onViewPeople}>
            {t("reviewEmailMatches")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="break-words text-2xl tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

export function ROIPeopleView({
  summary,
  identityMap,
  onMatch,
  readOnly = false,
}: {
  summary: ROISummary;
  identityMap: Record<string, string>;
  onMatch: (person: ROIPerson, login: string) => void;
  readOnly?: boolean;
}) {
  const t = useTranslations("roiCalculator");
  const exportCsv = () => {
    const url = URL.createObjectURL(new Blob([peopleCsv(summary)], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "litellm-roi.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={exportCsv}>
          {t("exportCsv")}
        </Button>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {effortNote(t, summary.effort_basis)} {t("peopleSpendNote")}
      </p>
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("person")}</TableHead>
                <TableHead className="text-right">{t("gatewaySpend")}</TableHead>
                <TableHead className="text-right">{t("estimatedHours")}</TableHead>
                <TableHead className="text-right">{t("spendPerEstimatedHour")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.people.map((person) => (
                <TableRow key={person.id}>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      {person.logins.length ? (
                        person.logins.map((login) =>
                          readOnly ? (
                            <span key={login}>{login}</span>
                          ) : (
                            <Button
                              key={login}
                              variant="link"
                              className="h-auto p-0"
                              onClick={() => onMatch(person, login)}
                            >
                              {login}
                            </Button>
                          ),
                        )
                      ) : (
                        <span>{t("unassignedGatewaySpend")}</span>
                      )}
                      {person.match_methods.some(
                        (method) =>
                          ["manual", "commit email", "profile email"].includes(method) && person.spend != null,
                      ) ? (
                        <span className="text-xs text-emerald-700">{t("matched")}</span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("unmatched")}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{person.email || t("emailUnavailable")}</p>
                    {person.logins.some((login) => identityMap[login.toLowerCase()]) && (
                      <p className="text-xs text-muted-foreground">{t("manualEmailMatch")}</p>
                    )}
                    {!person.eligible && <p className="text-xs text-muted-foreground">{t("excludedFromRatio")}</p>}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(person.spend)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {person.estimated_prs > 0 ? t("hoursUnit", { value: formatNumber(person.hours) }) : "—"}
                    <p className="text-xs text-muted-foreground">
                      {t("prCount", { count: person.prs })}
                      {person.pending_prs > 0 ? t("pendingPrsSuffix", { count: person.pending_prs }) : ""}
                    </p>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(person.cost_per_hour)}</TableCell>
                </TableRow>
              ))}
              {summary.people.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground" colSpan={4}>
                    {t("noPeople")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <details className="rounded-lg border p-4 text-sm">
        <summary className="cursor-pointer font-medium">{t("howEmailMatchingWorks")}</summary>
        <p className="mt-3 text-muted-foreground">{t("emailMatchingExplanation")}</p>
      </details>
    </div>
  );
}
