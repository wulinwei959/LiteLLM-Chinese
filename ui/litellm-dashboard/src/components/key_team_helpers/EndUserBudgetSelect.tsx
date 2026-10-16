"use client";

import { useTranslations } from "next-intl";
import React from "react";

import { useBudgetOptions } from "@/app/(dashboard)/hooks/budgets/useBudgetOptions";
import type { budgetItem } from "@/app/(dashboard)/hooks/budgets/useBudgets";
import { SearchSelect, type SearchSelectOption } from "@/components/shared/SearchSelect";
import type { BudgetEditorsTranslator } from "@/lib/i18n/translators";

interface EndUserBudgetSelectProps {
  readonly id?: string;
  readonly accessToken: string | null;
  readonly value: string | null;
  readonly onChange: (next: string | null) => void;
  readonly canEdit: boolean;
}

const budgetSublabel = (budget: budgetItem, t: BudgetEditorsTranslator): string | undefined => {
  const parts = [
    budget.max_budget != null ? `$${budget.max_budget}` : null,
    budget.budget_duration ? t("endUserBudget.resetsSublabel", { duration: budget.budget_duration }) : null,
  ].filter((part): part is string => part !== null);
  return parts.length > 0 ? parts.join(", ") : undefined;
};

export const EndUserBudgetSelect: React.FC<EndUserBudgetSelectProps> = ({
  id,
  accessToken,
  value,
  onChange,
  canEdit,
}) => {
  const t = useTranslations("budgetEditors");
  const vkT = useTranslations("virtualKeys.editForm");
  const { data: budgets } = useBudgetOptions(accessToken, canEdit);
  const options: SearchSelectOption[] = (budgets ?? []).map((budget) => ({
    label: budget.budget_id,
    value: budget.budget_id,
    sublabel: budgetSublabel(budget, t),
  }));

  return (
    <SearchSelect
      inputId={id}
      aria-label={vkT("defaultCustomerBudget")}
      placeholder={t("endUserBudget.noDefaultBudget")}
      emptyText={t("endUserBudget.noBudgetsFound")}
      options={options}
      value={value}
      onValueChange={onChange}
      disabled={!canEdit}
    />
  );
};
