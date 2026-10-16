"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/cva.config";

type PolicyTranslator = ReturnType<typeof useTranslations<"toolPolicies">>;

const INPUT_POLICY_DEFS = [
  { value: "untrusted", labelKey: "policyUntrusted", dot: "bg-warning" },
  { value: "trusted", labelKey: "policyTrusted", dot: "bg-success" },
  { value: "blocked", labelKey: "policyBlocked", dot: "bg-destructive" },
] as const;

const OUTPUT_POLICY_DEFS = [
  { value: "untrusted", labelKey: "policyUntrusted", dot: "bg-warning" },
  { value: "trusted", labelKey: "policyTrusted", dot: "bg-success" },
] as const;

export type PolicyOption = { value: string; label: string; dot: string };

export const inputPolicyOptions = (t: PolicyTranslator): PolicyOption[] =>
  INPUT_POLICY_DEFS.map(({ value, labelKey, dot }) => ({ value, label: t(labelKey), dot }));

export const outputPolicyOptions = (t: PolicyTranslator): PolicyOption[] =>
  OUTPUT_POLICY_DEFS.map(({ value, labelKey, dot }) => ({ value, label: t(labelKey), dot }));

const policyDot = (value: string): string =>
  INPUT_POLICY_DEFS.find((option) => option.value === value)?.dot ?? INPUT_POLICY_DEFS[0].dot;

export interface PolicySelectProps {
  value: string;
  toolName: string;
  saving: boolean;
  onChange: (toolName: string, policy: string) => void;
  policyType?: "input" | "output";
  size?: "small" | "middle";
  minWidth?: number;
  stopPropagation?: boolean;
}

export const PolicySelect: React.FC<PolicySelectProps> = ({
  value,
  toolName,
  saving,
  onChange,
  policyType = "input",
  size = "small",
  stopPropagation = true,
}) => {
  const t = useTranslations("toolPolicies");
  const options = policyType === "output" ? outputPolicyOptions(t) : inputPolicyOptions(t);
  const selectedDot = policyDot(value);
  return (
    <Select
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      value={value}
      disabled={saving}
      onValueChange={(v: string | null) => v !== null && onChange(toolName, v)}
    >
      <SelectTrigger
        size={size === "small" ? "sm" : "default"}
        className="w-auto min-w-28"
        data-policy={value}
        onClick={(e) => stopPropagation && e.stopPropagation()}
      >
        <span className={cn("size-2 shrink-0 rounded-full", selectedDot)} />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            <span className="inline-flex items-center gap-1.5">
              <span className={cn("size-2 shrink-0 rounded-full", o.dot)} />
              {o.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
