import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { testPipelineCall } from "@/components/networking";
import { getComplianceDatasetPrompts, getFrameworks } from "@/data/compliancePrompts";
import type { CompliancePrompt } from "@/data/compliancePrompts";
import type { GuardrailPipeline, PipelineTestResult } from "@/components/policies/types";
import { actionLabel } from "./pipeline_labels";

const TEST_SOURCE_QUICK = "quick_chat";
const TEST_SOURCE_ALL = "__all__";

function getPromptsForTestSource(source: string): CompliancePrompt[] {
  if (source === TEST_SOURCE_QUICK) return [];
  if (source === TEST_SOURCE_ALL) return getComplianceDatasetPrompts();
  const fw = getFrameworks().find((f) => f.name === source);
  return fw ? fw.categories.flatMap((c) => c.prompts) : [];
}

interface PipelineTestPanelProps {
  pipeline: GuardrailPipeline;
  accessToken: string | null;
  onClose: () => void;
}

const OUTCOME_STYLES: Record<
  string,
  { bg: string; color: string; labelKey: "flow.outcomePass" | "flow.outcomeFail" | "flow.outcomeError" }
> = {
  pass: {
    bg: "color-mix(in oklab, var(--color-success) 10%, transparent)",
    color: "var(--color-success)",
    labelKey: "flow.outcomePass",
  },
  fail: {
    bg: "color-mix(in oklab, var(--color-destructive) 10%, transparent)",
    color: "var(--color-destructive)",
    labelKey: "flow.outcomeFail",
  },
  error: {
    bg: "color-mix(in oklab, var(--color-warning) 10%, transparent)",
    color: "var(--color-warning)",
    labelKey: "flow.outcomeError",
  },
};

const TERMINAL_STYLES: Record<string, { bg: string; color: string }> = {
  allow: { bg: "color-mix(in oklab, var(--color-success) 10%, transparent)", color: "var(--color-success)" },
  block: { bg: "color-mix(in oklab, var(--color-destructive) 10%, transparent)", color: "var(--color-destructive)" },
  modify_response: { bg: "color-mix(in oklab, var(--color-info) 10%, transparent)", color: "var(--color-info)" },
};

interface ComplianceRunEntry {
  prompt: CompliancePrompt;
  result: PipelineTestResult | null;
  error?: string;
  matched: boolean;
}

function complianceMatchExpected(expected: "pass" | "fail", terminalAction: string): boolean {
  if (expected === "pass") {
    return terminalAction === "allow" || terminalAction === "modify_response";
  }
  return terminalAction === "block";
}

export const PipelineTestPanel: React.FC<PipelineTestPanelProps> = ({ pipeline, accessToken, onClose }) => {
  const t = useTranslations("policies");
  const [testSource, setTestSource] = useState<string>(TEST_SOURCE_QUICK);
  const [testMessage, setTestMessage] = useState(t("flow.defaultTestMessage"));
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<PipelineTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [complianceResults, setComplianceResults] = useState<ComplianceRunEntry[]>([]);

  const isQuickChat = testSource === TEST_SOURCE_QUICK;
  const promptsForSource = getPromptsForTestSource(testSource);
  const isDataset = promptsForSource.length > 0;
  const testSourceOptions = React.useMemo(
    () => [
      { value: TEST_SOURCE_QUICK, label: t("flow.quickChat") },
      ...getFrameworks().map((f) => ({ value: f.name, label: f.name })),
      { value: TEST_SOURCE_ALL, label: t("flow.allData") },
    ],
    [t],
  );

  const handleRunTest = async () => {
    if (!accessToken) return;

    const emptySteps = pipeline.steps.filter((s) => !s.guardrail);
    if (emptySteps.length > 0) {
      setError(t("flow.mustSelect"));
      return;
    }

    setError(null);
    setIsRunning(true);
    setResult(null);
    setComplianceResults([]);

    if (isQuickChat) {
      try {
        const data = await testPipelineCall(accessToken, pipeline, [{ role: "user", content: testMessage }]);
        setResult(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setIsRunning(false);
      }
      return;
    }

    const entries: ComplianceRunEntry[] = [];
    for (const prompt of promptsForSource) {
      try {
        const data = await testPipelineCall(accessToken, pipeline, [{ role: "user", content: prompt.prompt }]);
        const matched = complianceMatchExpected(prompt.expectedResult, data.terminal_action);
        entries.push({ prompt, result: data, matched });
      } catch (e) {
        const errMsg = e instanceof Error ? e.message : String(e);
        entries.push({
          prompt,
          result: null,
          error: errMsg,
          matched: false,
        });
      }
    }
    setComplianceResults(entries);
    setIsRunning(false);
  };

  return (
    <div
      style={{
        width: 400,
        borderLeft: "1px solid var(--color-border)",
        backgroundColor: "var(--color-card)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-foreground)" }}>{t("flow.testTitle")}</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            color: "var(--color-muted-foreground)",
            padding: "0 4px",
          }}
        >
          x
        </button>
      </div>

      {/* Input section */}
      <div style={{ padding: 16, borderBottom: "1px solid var(--color-border)" }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: "var(--color-muted-foreground)",
            display: "block",
            marginBottom: 6,
          }}
        >
          {t("flow.testWith")}
        </label>
        <Select value={testSource} onValueChange={(value) => value !== null && setTestSource(value)}>
          <SelectTrigger className="mb-3 w-full">
            <SelectValue>
              {testSourceOptions.find((option) => option.value === testSource)?.label ?? testSource}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {testSourceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isQuickChat && (
          <>
            <label
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--color-muted-foreground)",
                display: "block",
                marginBottom: 6,
              }}
            >
              {t("flow.message")}
            </label>
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder={t("flow.enterTestMsg")}
              rows={3}
              style={{
                width: "100%",
                border: "1px solid var(--color-border)",
                borderRadius: 6,
                padding: "8px 10px",
                fontSize: 13,
                resize: "vertical",
                fontFamily: "inherit",
                backgroundColor: "var(--color-card)",
                color: "var(--color-foreground)",
              }}
            />
          </>
        )}
        {isDataset && (
          <div
            style={{
              fontSize: 12,
              color: "var(--color-muted-foreground)",
              padding: "8px 10px",
              backgroundColor: "var(--color-muted)",
              borderRadius: 6,
              marginBottom: 8,
            }}
          >
            {testSource === TEST_SOURCE_ALL
              ? t("flow.datasetAll")
              : t("flow.datasetSome", { count: promptsForSource.length, source: testSource })}
          </div>
        )}
        <Button onClick={handleRunTest} disabled={isRunning} style={{ marginTop: 8, width: "100%" }}>
          {t("flow.runTest")}
        </Button>
      </div>

      {/* Results section */}
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {error && (
          <div
            style={{
              padding: "10px 12px",
              backgroundColor: "color-mix(in oklab, var(--color-destructive) 10%, transparent)",
              border: "1px solid color-mix(in oklab, var(--color-destructive) 30%, transparent)",
              borderRadius: 6,
              fontSize: 13,
              color: "var(--color-destructive)",
              marginBottom: 12,
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div>
            {/* Step results */}
            {result.step_results.map((step, i) => {
              const style = OUTCOME_STYLES[step.outcome] || OUTCOME_STYLES.error;
              return (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    marginBottom: 8,
                  }}
                >
                  <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-foreground)" }}>
                      {t("flow.stepResult", { index: i + 1, name: step.guardrail_name })}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: style.bg,
                        color: style.color,
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}
                    >
                      {t(style.labelKey)}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--color-muted-foreground)" }}>
                    {t("flow.actionTaken", { action: actionLabel(t, step.action_taken) })}
                    {step.duration_seconds != null && (
                      <span style={{ marginLeft: 8 }}>({(step.duration_seconds * 1000).toFixed(0)}ms)</span>
                    )}
                  </div>
                  {step.error_detail && (
                    <div style={{ fontSize: 12, color: "var(--color-destructive)", marginTop: 4 }}>
                      {step.error_detail}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Terminal result */}
            <div
              style={{
                borderTop: "1px solid var(--color-border)",
                paddingTop: 12,
                marginTop: 4,
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-foreground)" }}>
                  {t("flow.result")}
                </span>
                {(() => {
                  const ts = TERMINAL_STYLES[result.terminal_action] || TERMINAL_STYLES.block;
                  return (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        backgroundColor: ts.bg,
                        color: ts.color,
                        padding: "3px 10px",
                        borderRadius: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {result.terminal_action === "modify_response" ? t("flow.customResponse") : result.terminal_action}
                    </span>
                  );
                })()}
              </div>
              {result.error_message && (
                <div style={{ fontSize: 12, color: "var(--color-destructive)", marginTop: 6 }}>
                  {result.error_message}
                </div>
              )}
              {result.modify_response_message && (
                <div style={{ fontSize: 12, color: "var(--color-info)", marginTop: 6 }}>
                  {t("flow.response", { message: result.modify_response_message })}
                </div>
              )}
            </div>
          </div>
        )}

        {complianceResults.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--color-foreground)",
                marginBottom: 8,
              }}
            >
              {t("flow.compliance")}
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--color-muted-foreground)",
                marginBottom: 10,
              }}
            >
              {t("flow.matchScore", {
                matched: complianceResults.filter((e) => e.matched).length,
                total: complianceResults.length,
              })}
            </div>
            <div
              style={{
                maxHeight: 320,
                overflowY: "auto",
                border: "1px solid var(--color-border)",
                borderRadius: 8,
              }}
            >
              {complianceResults.map((entry, i) => {
                const actual = entry.result?.terminal_action ?? (entry.error ? "error" : "—");
                const matchStyle = entry.matched
                  ? { bg: "color-mix(in oklab, var(--color-success) 10%, transparent)", color: "var(--color-success)" }
                  : {
                      bg: "color-mix(in oklab, var(--color-destructive) 10%, transparent)",
                      color: "var(--color-destructive)",
                    };
                return (
                  <div
                    key={entry.prompt.id ?? i}
                    style={{
                      padding: "8px 10px",
                      borderBottom: i < complianceResults.length - 1 ? "1px solid var(--color-border)" : "none",
                      fontSize: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "var(--color-foreground)",
                        marginBottom: 4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={entry.prompt.prompt}
                    >
                      {entry.prompt.prompt}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ color: "var(--color-muted-foreground)" }}>
                        {t("flow.expected", { value: entry.prompt.expectedResult })}
                      </span>
                      <span style={{ color: "var(--color-muted-foreground)" }}>→</span>
                      <span style={{ color: "var(--color-muted-foreground)" }}>
                        {t("flow.actual", { value: actual })}
                      </span>
                      <span
                        style={{
                          backgroundColor: matchStyle.bg,
                          color: matchStyle.color,
                          padding: "1px 6px",
                          borderRadius: 4,
                          fontWeight: 600,
                        }}
                      >
                        {entry.matched ? "✓" : "✗"}
                      </span>
                    </div>
                    {entry.error && (
                      <div style={{ color: "var(--color-destructive)", marginTop: 4 }}>{entry.error}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!result && !error && complianceResults.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--color-muted-foreground)", fontSize: 13, marginTop: 24 }}>
            {t("flow.chooseSource", { run: t("flow.runTest") })}
          </div>
        )}
      </div>
    </div>
  );
};
