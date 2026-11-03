"use client";

import { Loader2, Play, RotateCcw, Square, X } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

import PolicySelector from "@/components/policies/PolicySelector";
import { Policy } from "@/components/policies/types";

interface ComplianceConfigBarProps {
  readonly accessToken: string | null;
  readonly disabledPersonalKeyCreation: boolean;
  readonly canViewPolicies: boolean;
  readonly selectedPolicies: string[];
  readonly setSelectedPolicies: React.Dispatch<React.SetStateAction<string[]>>;
  readonly selectedGuardrails: string[];
  readonly setSelectedGuardrails: React.Dispatch<React.SetStateAction<string[]>>;
  readonly showGuardrailDropdown: boolean;
  readonly setShowGuardrailDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  readonly guardrailOptions: Array<{ id: string; name: string; type?: string }>;
  readonly toggleGuardrail: (id: string) => void;
  readonly isRunning: boolean;
  readonly runTests: () => void;
  readonly batchAbortControllerRef: React.RefObject<AbortController | null>;
  readonly resetAll: () => void;
  readonly selectedPromptIds: Set<string>;
  readonly handlePoliciesLoaded: (policies: Policy[]) => void;
}

export function ComplianceConfigBar({
  accessToken,
  disabledPersonalKeyCreation,
  canViewPolicies,
  selectedPolicies,
  setSelectedPolicies,
  selectedGuardrails,
  setSelectedGuardrails,
  showGuardrailDropdown,
  setShowGuardrailDropdown,
  guardrailOptions,
  toggleGuardrail,
  isRunning,
  runTests,
  batchAbortControllerRef,
  resetAll,
  selectedPromptIds,
  handlePoliciesLoaded,
}: ComplianceConfigBarProps) {
  const t = useTranslations("playground");
  const commonT = useTranslations("common");

  const testButtonLabel = (() => {
    const parts: string[] = [];
    if (selectedPolicies.length > 0) parts.push(t("compliance.testBtnPolicies", { count: selectedPolicies.length }));
    if (selectedGuardrails.length > 0)
      parts.push(t("compliance.testBtnGuardrails", { count: selectedGuardrails.length }));
    if (parts.length === 0) return t("compliance.testBtn");
    return t("compliance.testBtnWith", { parts: parts.join(" & ") });
  })();

  return (
    <div className="shrink-0 border-b border-border px-6 py-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">{t("compliance.testConfigTitle")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {canViewPolicies ? t("compliance.testConfigDesc") : t("compliance.testConfigDescNoPolicies")}
        </p>
      </div>

      <div className="flex items-start gap-3 flex-wrap">
        {canViewPolicies && (
          <>
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
                {t("compliance.policies")}
              </label>
              {accessToken && (
                <PolicySelector
                  value={selectedPolicies}
                  onChange={setSelectedPolicies}
                  accessToken={accessToken}
                  onPoliciesLoaded={handlePoliciesLoaded}
                />
              )}
            </div>

            <div className="flex flex-col items-center pt-6 shrink-0">
              <div className="w-px h-4 bg-border" />
              <span className="text-[10px] font-medium text-muted-foreground my-1">{t("compliance.or")}</span>
              <div className="w-px h-4 bg-border" />
            </div>
          </>
        )}

        <div className="flex-1 min-w-[200px]">
          <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1.5 block">
            {t("compare.guardrails")}
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowGuardrailDropdown(!showGuardrailDropdown)}
              className="w-full flex items-center justify-between border border-border rounded-lg px-3 py-2 text-sm text-left hover:border-ring transition-colors"
            >
              <span className={selectedGuardrails.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                {selectedGuardrails.length > 0
                  ? t("compliance.guardrailsDropdown.selected", { count: selectedGuardrails.length })
                  : t("compliance.guardrailsDropdown.noneSelected")}
              </span>
              <span className={showGuardrailDropdown ? "rotate-180" : ""}>
                <span className="w-4 h-4 text-muted-foreground">▼</span>
              </span>
            </button>
            {showGuardrailDropdown && (
              <div className="absolute z-floating top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg py-1 max-h-52 overflow-y-auto">
                {guardrailOptions.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-muted-foreground">{t("compliance.noGuardrails")}</div>
                ) : (
                  guardrailOptions.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGuardrail(g.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-accent"
                    >
                      <div
                        className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ${selectedGuardrails.includes(g.id) ? "bg-info border-info" : "border-border"}`}
                      >
                        {selectedGuardrails.includes(g.id) && <span className="w-3 h-3 text-info-foreground">✓</span>}
                      </div>
                      <div className="min-w-0">
                        <div className="text-foreground">{g.name}</div>
                        {g.type && <div className="text-[10px] text-muted-foreground">{g.type}</div>}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          {selectedGuardrails.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {selectedGuardrails.map((id) => {
                const g = guardrailOptions.find((x) => x.id === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm font-medium dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    {g?.name}
                    <button
                      type="button"
                      onClick={() => toggleGuardrail(id)}
                      className="hover:text-indigo-900 dark:hover:text-indigo-100"
                      aria-label={commonT("remove")}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 pt-6 shrink-0">
          {isRunning ? (
            <button
              type="button"
              onClick={() => batchAbortControllerRef.current?.abort()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap bg-destructive text-destructive-foreground hover:bg-destructive/80"
            >
              <Square className="w-3.5 h-3.5" /> {t("compliance.stop")}
            </button>
          ) : (
            <button
              type="button"
              onClick={runTests}
              disabled={selectedPromptIds.size === 0 || disabledPersonalKeyCreation}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${selectedPromptIds.size === 0 || disabledPersonalKeyCreation ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-info text-info-foreground hover:bg-info/80"}`}
            >
              <Play className="w-3.5 h-3.5" /> {t("compliance.runTests", { count: selectedPromptIds.size })}
            </button>
          )}
          {isRunning && (
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> {t("compliance.running")}
            </span>
          )}
          <button
            type="button"
            onClick={resetAll}
            className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> {t("compliance.reset")}
          </button>
        </div>
      </div>
    </div>
  );
}
