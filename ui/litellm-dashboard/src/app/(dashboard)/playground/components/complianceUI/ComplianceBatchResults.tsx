"use client";

import { AlertTriangle, CheckCircle2, Download, FlaskConical, Loader2, X } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

import type { TestResult, ResultFilter } from "./ComplianceUIShared";

interface ComplianceBatchResultsProps {
  readonly testResults: TestResult[];
  readonly setTestResults: React.Dispatch<React.SetStateAction<TestResult[]>>;
  readonly expandedResults: Set<string>;
  readonly setExpandedResults: React.Dispatch<React.SetStateAction<Set<string>>>;
  readonly resultFilter: ResultFilter;
  readonly setResultFilter: React.Dispatch<React.SetStateAction<ResultFilter>>;
  readonly exportBatchResults: () => void;
}

export function ComplianceBatchResults({
  testResults,
  setTestResults,
  expandedResults,
  setExpandedResults,
  resultFilter,
  setResultFilter,
  exportBatchResults,
}: ComplianceBatchResultsProps) {
  const t = useTranslations("playground");

  const completedResults = testResults.filter((r) => r.status === "complete");
  const matchCount = completedResults.filter((r) => r.isMatch).length;
  const mismatchCount = completedResults.filter((r) => !r.isMatch).length;
  const falsePositiveCount = completedResults.filter(
    (r) => r.expectedResult === "pass" && r.actualResult === "blocked",
  ).length;
  const falseNegativeCount = completedResults.filter(
    (r) => r.expectedResult === "fail" && r.actualResult === "allowed",
  ).length;
  const pendingCount = testResults.filter((r) => r.status !== "complete").length;

  const filteredResults = testResults.filter((r) => {
    if (resultFilter === "matches") return r.status === "complete" && r.isMatch;
    if (resultFilter === "mismatches") return r.status === "complete" && !r.isMatch;
    if (resultFilter === "pending") return r.status !== "complete";
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card min-w-0">
      <div className="px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-foreground">{t("compliance.results")}</h2>
          {testResults.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportBatchResults}
                disabled={filteredResults.length === 0}
                className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-1 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <Download className="w-3 h-3" /> {t("compliance.exportCsv")}
              </button>
              <div className="flex items-center gap-2.5 text-[11px]">
                <span className="flex items-center gap-1 text-success">
                  <CheckCircle2 className="w-3 h-3" />
                  {matchCount}
                </span>
                <span className="flex items-center gap-1 text-warning" title={t("compliance.fnTooltip")}>
                  <AlertTriangle className="w-3 h-3" />
                  {falseNegativeCount} {t("compliance.fn")}
                </span>
                <span className="flex items-center gap-1 text-destructive" title={t("compliance.fpTooltip")}>
                  <X className="w-3 h-3" />
                  {falsePositiveCount} {t("compliance.fp")}
                </span>
                {pendingCount > 0 && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {pendingCount}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        {testResults.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {(["all", "matches", "mismatches", "pending"] as ResultFilter[]).map((filter) => {
              const countMap: Record<ResultFilter, number> = {
                all: testResults.length,
                matches: matchCount,
                mismatches: mismatchCount,
                pending: pendingCount,
              };
              const count = countMap[filter];
              const filterLabel = (() => {
                switch (filter) {
                  case "all":
                    return t("compliance.filterAll");
                  case "matches":
                    return t("compliance.filterMatches");
                  case "mismatches":
                    return t("compliance.filterMismatches");
                  case "pending":
                    return t("compliance.filterPending");
                }
              })();
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setResultFilter(filter)}
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${resultFilter === filter ? "bg-gray-900 text-white" : "text-muted-foreground hover:bg-accent"}`}
                >
                  {filterLabel} ({count})
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        {testResults.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[120px]">
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                <FlaskConical className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground max-w-[240px]">{t("compliance.noResults")}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-1.5">
            {completedResults.length > 0 && (
              <div className="flex items-center gap-4 p-4 bg-muted rounded-xl mb-4 border border-border">
                <div className="flex items-center gap-3 text-sm flex-1">
                  <span>
                    <span className="font-semibold text-foreground">{testResults.length}</span>{" "}
                    <span className="text-muted-foreground">
                      {t("compliance.total", { count: testResults.length })}
                    </span>
                  </span>
                  <div className="w-px h-4 bg-border" />
                  <span>
                    <span className="font-semibold text-success">{matchCount}</span>{" "}
                    <span className="text-muted-foreground">{t("compliance.correct", { count: matchCount })}</span>
                  </span>
                  <div className="w-px h-4 bg-border" />
                  <span title={t("compliance.fnTooltip")}>
                    <span className="font-semibold text-warning">{falseNegativeCount}</span>{" "}
                    <span className="text-muted-foreground">
                      {t("compliance.falseNegativeLabel", { count: falseNegativeCount })}
                    </span>
                  </span>
                  <div className="w-px h-4 bg-border" />
                  <span title={t("compliance.fpTooltip")}>
                    <span className="font-semibold text-destructive">{falsePositiveCount}</span>{" "}
                    <span className="text-muted-foreground">
                      {t("compliance.falsePositiveLabel", { count: falsePositiveCount })}
                    </span>
                  </span>
                </div>
                {(() => {
                  const ratio = completedResults.length > 0 ? matchCount / completedResults.length : 0;
                  let scoreClass: string;
                  if (ratio >= 0.8) {
                    scoreClass = "bg-success/10 border-success/20 text-success";
                  } else if (ratio >= 0.5) {
                    scoreClass = "bg-warning/10 border-warning/20 text-warning";
                  } else {
                    scoreClass = "bg-destructive/10 border-destructive/20 text-destructive";
                  }
                  return (
                    <div
                      className={`flex flex-col items-center justify-center min-w-[88px] py-2.5 px-4 rounded-xl border-2 font-bold text-2xl tabular-nums ${scoreClass}`}
                    >
                      <span className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                        {t("compliance.score")}
                      </span>
                      <span>{Math.round((matchCount / completedResults.length) * 100)}%</span>
                    </div>
                  );
                })()}
              </div>
            )}

            {filteredResults.map((result) => {
              const isExpanded = expandedResults.has(result.promptId);
              let cardClass: string;
              if (result.status !== "complete") {
                cardClass = "border-border bg-muted/50";
              } else if (result.isMatch) {
                cardClass = "border-success/15";
              } else {
                cardClass = "border-destructive/15";
              }
              return (
                <div key={result.promptId} className={`border rounded-lg overflow-hidden ${cardClass}`}>
                  <div className="p-2.5">
                    <div className="flex items-start gap-2">
                      <div className="shrink-0 mt-0.5">
                        {(() => {
                          if (result.status !== "complete") {
                            return <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />;
                          }
                          if (result.isMatch) {
                            return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
                          }
                          return <AlertTriangle className="w-3.5 h-3.5 text-destructive" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-foreground leading-relaxed mb-1.5">{result.prompt}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] text-muted-foreground inline-flex items-center gap-0.5">
                            {result.categoryIcon && <span className="w-3 h-3" />}
                            {result.category}
                          </span>
                          <span
                            className={`text-[9px] font-semibold px-1 py-0.5 rounded-sm ${result.expectedResult === "fail" ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success"}`}
                          >
                            {result.expectedResult === "fail"
                              ? t("compliance.expectBlock")
                              : t("compliance.expectAllow")}
                          </span>
                          {result.status === "complete" && (
                            <span
                              className={`text-[9px] font-bold px-1 py-0.5 rounded-sm ${result.isMatch ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}
                            >
                              {result.isMatch ? t("compliance.match") : t("compliance.gap")}
                            </span>
                          )}
                        </div>
                      </div>
                      {result.status === "complete" && (
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedResults((prev) => {
                              const next = new Set(prev);
                              if (next.has(result.promptId)) next.delete(result.promptId);
                              else next.add(result.promptId);
                              return next;
                            });
                          }}
                          className="shrink-0 p-0.5 text-muted-foreground hover:text-foreground"
                          aria-label={isExpanded ? t("compliance.collapse") : t("compliance.expand")}
                        >
                          {isExpanded ? (
                            <span className="w-3.5 h-3.5">▼</span>
                          ) : (
                            <span className="w-3.5 h-3.5">▶</span>
                          )}
                        </button>
                      )}
                    </div>
                    {isExpanded && result.status === "complete" && (
                      <div className="mt-2 pt-2 border-t border-border text-[11px] space-y-1">
                        {result.triggeredBy && (
                          <div>
                            <span className="text-muted-foreground">{t("compliance.triggeredBy")}</span>{" "}
                            <span className="font-medium text-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                              {result.triggeredBy}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">{t("compliance.verdict")}</span>{" "}
                          <span className={result.isMatch ? "text-success" : "text-destructive"}>
                            {(() => {
                              if (result.isMatch) {
                                return t("compliance.correctlyHandled");
                              }
                              if (result.expectedResult === "fail") {
                                return t("compliance.shouldHaveBeenBlocked");
                              }
                              return t("compliance.incorrectlyBlocked");
                            })()}
                          </span>
                        </div>
                        {result.returnedText != null && result.returnedText !== "" && (
                          <div className="mt-1.5">
                            <span className="text-muted-foreground block mb-0.5">{t("compliance.llmResponse")}</span>
                            <div className="text-foreground bg-muted rounded-sm px-2 py-1.5 border border-border max-h-32 overflow-y-auto whitespace-pre-wrap wrap-break-word">
                              {result.returnedText}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
