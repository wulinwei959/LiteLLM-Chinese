import React from "react";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { SimpleTooltip } from "@/components/ui/tooltip";
import type { ComplexityRouterConfigValue } from "./ComplexityRouterConfig";
import { isForecastClassifier } from "./forecast_classifier_config";
import { resolveComplexityDefaultModel } from "./tier_rows";

type AddModelTranslator = ReturnType<typeof useTranslations<"models.addModel">>;

interface DefaultModelFieldProps {
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
  modelOptions: { value: string; label: string }[];
}

const defaultModelPlaceholderFor = (
  t: AddModelTranslator,
  derivedDefaultModel: string | undefined,
  isCustomSet: boolean,
): string => {
  if (derivedDefaultModel) return t("derivedFromTiers", { model: derivedDefaultModel });
  return isCustomSet ? t("addModelToFallbackTier") : t("addModelToSimpleOrMedium");
};

const DefaultModelField = ({ value, onChange, modelOptions }: DefaultModelFieldProps) => {
  const t = useTranslations("models.addModel");
  const defaultModelPlaceholder = defaultModelPlaceholderFor(
    t,
    resolveComplexityDefaultModel(value),
    Boolean(value.custom_tier_set),
  );
  // Clearing the select drops the key entirely rather than storing "", so an emptied pin reads as
  // "track the tiers" everywhere downstream instead of as a blank model name.
  const handleDefaultModelChange = (model: string | null | undefined) => {
    onChange({ ...value, default_model: model || undefined });
  };

  return (
    <div className="mt-4 mb-2" role="group" aria-label={t("defaultModelGroupAria")}>
      <div className="flex items-center gap-2 mb-2">
        <strong className="text-base font-semibold">{t("defaultModelHeading")}</strong>
        <SimpleTooltip content={t("defaultModelHint")}>
          <Info className="size-4 text-muted-foreground" />
        </SimpleTooltip>
      </div>
      <SearchSelect
        options={modelOptions}
        value={value.default_model ?? ""}
        onValueChange={handleDefaultModelChange}
        placeholder={defaultModelPlaceholder}
        emptyText={t("noModelsFound")}
        aria-label={t("defaultModel")}
      />
      <span className="block mt-1 text-xs text-muted-foreground">
        {isForecastClassifier(value.classifier_type) ? t("defaultModelForecastHelp") : t("defaultModelHelp")}
      </span>
    </div>
  );
};

export default DefaultModelField;
