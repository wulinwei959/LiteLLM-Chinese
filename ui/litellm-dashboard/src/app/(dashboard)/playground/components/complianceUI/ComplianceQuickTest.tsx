"use client";

import { CheckCircle2, Loader2, MessageSquare, Send, X } from "lucide-react";
import React, { useRef } from "react";
import { useTranslations } from "next-intl";

import type { QuickTestMessage } from "./ComplianceUIShared";

interface ComplianceQuickTestProps {
  readonly hasAnyConfig: boolean;
  readonly selectedPolicies: string[];
  readonly selectedGuardrails: string[];
  readonly policyValueToLabel: Map<string, string>;
  readonly guardrailOptions: Array<{ id: string; name: string; type?: string }>;
  readonly quickTestMessages: QuickTestMessage[];
  readonly setQuickTestMessages: React.Dispatch<React.SetStateAction<QuickTestMessage[]>>;
  readonly quickTestInput: string;
  readonly setQuickTestInput: React.Dispatch<React.SetStateAction<string>>;
  readonly isQuickTesting: boolean;
  readonly runQuickTest: () => void;
  readonly handleQuickTestKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  readonly testButtonLabel: string;
  readonly disabledPersonalKeyCreation: boolean;
}

export function ComplianceQuickTest({
  hasAnyConfig,
  selectedPolicies,
  selectedGuardrails,
  policyValueToLabel,
  guardrailOptions,
  quickTestMessages,
  setQuickTestMessages,
  quickTestInput,
  setQuickTestInput,
  isQuickTesting,
  runQuickTest,
  handleQuickTestKeyDown,
  testButtonLabel,
  disabledPersonalKeyCreation,
}: ComplianceQuickTestProps) {
  const t = useTranslations("playground");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0">
      <div className="px-5 pt-4 pb-2 shrink-0">
        {hasAnyConfig ? (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-muted-foreground">{t("compliance.testingAgainst")}</span>
            {selectedPolicies.map((id) => (
              <span key={id} className="text-[11px] bg-info/10 text-info px-2 py-0.5 rounded-sm font-medium">
                {policyValueToLabel.get(id) ?? id}
              </span>
            ))}
            {selectedGuardrails.map((id) => {
              const g = guardrailOptions.find((x) => x.id === id);
              return (
                <span
                  key={id}
                  className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-sm font-medium dark:bg-indigo-950 dark:text-indigo-300"
                >
                  {g?.name}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground">{t("compliance.noConfigSelected")}</p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3 min-h-0">
        {quickTestMessages.length === 0 && (
          <div className="flex items-center justify-center h-full min-h-[120px]">
            <div className="text-center">
              <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{t("compliance.typeToTest")}</p>
            </div>
          </div>
        )}
        {quickTestMessages.map((msg) => {
          const isUser = msg.type === "user";
          let bubbleClass: string;
          if (isUser) {
            bubbleClass = "bg-info text-info-foreground";
          } else if (msg.result === "blocked") {
            bubbleClass = "bg-destructive/10 border border-destructive/15";
          } else {
            bubbleClass = "bg-success/10 border border-success/15";
          }
          let textClass: string;
          if (isUser) {
            textClass = "text-info-foreground";
          } else if (msg.result === "blocked") {
            textClass = "text-destructive";
          } else {
            textClass = "text-success";
          }
          return (
            <div key={msg.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${bubbleClass}`}>
                <p className={`text-xs leading-relaxed ${textClass}`}>
                  {msg.type === "system" && (
                    <span className="inline-flex items-center gap-1 font-semibold mr-1">
                      {msg.result === "blocked" ? (
                        <X className="w-3 h-3 inline" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3 inline" />
                      )}
                      {msg.result === "blocked" ? t("compliance.blocked") : t("compliance.allowed")}
                      <span className="font-normal mx-0.5">—</span>
                    </span>
                  )}
                  {msg.text}
                  {msg.type === "system" && msg.returnedText != null && (
                    <span className="block mt-1.5 pt-1.5 border-t border-gray-200/60">
                      <span className="text-muted-foreground">{t("compliance.returned")}</span>
                      <span className="font-medium text-foreground break-all">{msg.returnedText}</span>
                    </span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
        {isQuickTesting && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3 py-2">
              <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="shrink-0 px-5 pb-4">
        <div className="border border-border rounded-lg bg-card overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-info">
          <textarea
            ref={textareaRef}
            value={quickTestInput}
            onChange={(e) => setQuickTestInput(e.target.value)}
            onKeyDown={handleQuickTestKeyDown}
            placeholder={t("compliance.enterTextToTest")}
            rows={3}
            className="w-full px-3 pt-3 pb-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden resize-none"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-[10px] text-muted-foreground">{t("compliance.pressEnter")}</span>
            <span className="text-[10px] text-muted-foreground tabular-nums">{quickTestInput.length}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={runQuickTest}
          disabled={!quickTestInput.trim() || isQuickTesting || disabledPersonalKeyCreation}
          className={`w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${!quickTestInput.trim() || isQuickTesting || disabledPersonalKeyCreation ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-info text-info-foreground hover:bg-info/80"}`}
        >
          {isQuickTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}{" "}
          {testButtonLabel}
        </button>
      </div>
    </div>
  );
}
