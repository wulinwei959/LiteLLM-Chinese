import React from "react";
import { useTranslations } from "next-intl";
import { CUSTOM_TIER_RESTRICTIONS, CustomTierSet, TierRestriction } from "./tier_rows";
import type { AddModelTranslator } from "./complexity_router_tiers";

export const restrictionReason = (t: AddModelTranslator, by: TierRestriction | undefined): string | undefined =>
  by && t(by.reasonKey);

export const restrictedBy = (
  value: { custom_tier_set?: CustomTierSet; classifier_type?: string },
  key: keyof typeof CUSTOM_TIER_RESTRICTIONS,
): TierRestriction | undefined => {
  if (value.custom_tier_set) return CUSTOM_TIER_RESTRICTIONS[key];
  if (value.classifier_type === "llm_v2" && key === "adaptive")
    return {
      omit: ["adaptive", "adaptive_weights", "adaptive_eligible", "tier_distance_penalty"],
      reasonKey: "restrictionFuseV2Adaptive",
    };
  return undefined;
};

export const Restricted: React.FC<{ by: TierRestriction | undefined; children: React.ReactNode }> = ({
  by,
  children,
}) => {
  const t = useTranslations("models.addModel");
  return by ? <span className="block text-sm text-muted-foreground">{t(by.reasonKey)}</span> : <>{children}</>;
};

/** A labelled section whose body is replaced by the reason an edited tier set forbids it. */
export const RestrictedSection: React.FC<{
  heading: string;
  by: TierRestriction | undefined;
  children: React.ReactNode;
}> = ({ heading, by, children }) => {
  const t = useTranslations("models.addModel");
  return (
    <div>
      <strong className="block mb-1 font-semibold">{heading}</strong>
      {by ? <span className="block text-sm text-muted-foreground">{t(by.reasonKey)}</span> : children}
    </div>
  );
};
