"use client";

import React from "react";
import { useTranslations } from "next-intl";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/cva.config";
import type { BudgetDurationTranslator } from "@/lib/i18n/translators";

export const NEVER_RESETS_BUDGET_DURATION = "none";

interface BudgetDurationDropdownProps {
  id?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  showNeverResets?: boolean;
  emptyMeansNeverResets?: boolean;
}

const BudgetDurationDropdown: React.FC<BudgetDurationDropdownProps> = ({
  id,
  value,
  onChange,
  className = "",
  style = {},
  placeholder,
  showNeverResets = false,
  emptyMeansNeverResets = false,
}) => {
  const t = useTranslations("common.budgetDuration");
  const emptyOption = placeholder ?? t(emptyMeansNeverResets ? "neverResets" : "notAvailable");
  const items = {
    [NEVER_RESETS_BUDGET_DURATION]: t("neverResets"),
    "1h": t("hourly"),
    "24h": t("daily"),
    "7d": t("weekly"),
    "30d": t("monthly"),
  };

  return (
    <Select items={items} value={value || null} onValueChange={onChange}>
      <SelectTrigger id={id} className={`w-full ${className}`} style={style}>
        <SelectValue placeholder={emptyOption} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={null}>{emptyOption}</SelectItem>
        {showNeverResets ? <SelectItem value={NEVER_RESETS_BUDGET_DURATION}>{t("neverResets")}</SelectItem> : null}
        <SelectItem value="1h">{t("hourly")}</SelectItem>
        <SelectItem value="24h">{t("daily")}</SelectItem>
        <SelectItem value="7d">{t("weekly")}</SelectItem>
        <SelectItem value="30d">{t("monthly")}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const getBudgetDurationLabel = (t: BudgetDurationTranslator, value: string | null | undefined): string => {
  if (!value) return t("notSet");

  switch (value) {
    case "1h":
      return t("hourly");
    case "24h":
      return t("daily");
    case "7d":
      return t("weekly");
    case "30d":
      return t("monthly");
    default:
      return value;
  }
};

export const BudgetDurationText: React.FC<{ value: string | null | undefined; className?: string }> = ({
  value,
  className,
}) => {
  const tDuration = useTranslations("common.budgetDuration");
  return (
    <span className={cn(value ? "whitespace-nowrap" : "text-muted-foreground", className)}>
      {getBudgetDurationLabel(tDuration, value)}
    </span>
  );
};

export default BudgetDurationDropdown;
