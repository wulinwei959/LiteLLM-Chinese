import React from "react";
import { useTranslations } from "next-intl";

import { type ComplexityRouterConfigValue, usesLlmClassifier } from "./ComplexityRouterConfig";
import { restrictionReason, restrictedBy } from "./TierRestrictions";

const TierConfigIntro: React.FC<{ value: ComplexityRouterConfigValue }> = ({ value }) => {
  const t = useTranslations("models.addModel");
  return (
    <div className="mb-4 space-y-2 text-sm text-muted-foreground">
      <p>{t("tierIntroHeading")}</p>
      <p className="text-xs">
        {restrictionReason(t, restrictedBy(value, "displayNames")) ?? t("tierIntroDisplayNamesFallback")}
        {!value.custom_tier_set && usesLlmClassifier(value.classifier_type) && t("tierIntroJudgeNamesSuffix")}
      </p>
    </div>
  );
};

export default TierConfigIntro;
