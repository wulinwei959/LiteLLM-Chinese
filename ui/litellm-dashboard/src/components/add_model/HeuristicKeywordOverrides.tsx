import React from "react";
import { useTranslations } from "next-intl";
import { MultiSelect } from "@/components/shared/MultiSelect";
import type { ComplexityRouterConfigValue } from "./ComplexityRouterConfig";

const FIELDS = [
  ["code_keywords", "codeKeywordsLabel", "addCodeKeywords"],
  ["reasoning_keywords", "reasoningKeywordsLabel", "addReasoningKeywords"],
  ["technical_keywords", "technicalKeywordsLabel", "addTechnicalKeywords"],
  ["simple_keywords", "simpleKeywordsLabel", "addSimpleKeywords"],
] as const;

const HeuristicKeywordOverrides: React.FC<{
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
}> = ({ value, onChange }) => {
  const t = useTranslations("models.addModel");
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{t("heuristicKeywordHelp")}</p>
      {FIELDS.map(([key, labelKey, placeholderKey]) => {
        const keywords = value[key] ?? [];
        return (
          <div key={key}>
            <strong className="mb-1 block font-semibold">{t(labelKey)}</strong>
            <MultiSelect
              options={keywords.map((keyword) => ({ label: keyword, value: keyword }))}
              value={keywords}
              onValueChange={(next) => onChange({ ...value, [key]: next.length > 0 ? next : undefined })}
              placeholder={t(placeholderKey)}
              emptyText={t("typeToAddKeyword")}
              allowCustomValues
              className="w-full"
            />
          </div>
        );
      })}
    </div>
  );
};

export default HeuristicKeywordOverrides;
