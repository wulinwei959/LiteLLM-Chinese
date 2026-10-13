import React from "react";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/shared/MultiSelect";
import TierRowSelect from "./TierRowSelect";
import type { ComplexityRouterConfigValue } from "./ComplexityRouterConfig";

const PlanModeOverrideControls: React.FC<{
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
  planModeTierOptions: { value: string; label: string }[];
}> = ({ value, onChange, planModeTierOptions }) => {
  const t = useTranslations("models.addModel");
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Switch
          checked={value.plan_mode_min_tier !== undefined}
          disabled={planModeTierOptions.length === 0}
          onCheckedChange={(enabled) =>
            onChange({
              ...value,
              plan_mode_min_tier: enabled ? planModeTierOptions.at(-1)?.value : undefined,
            })
          }
          aria-label={t("planModeToggle")}
        />
        <strong className="font-semibold">{t("planModeToggle")}</strong>
      </div>
      <span className="block text-xs mb-3 text-muted-foreground">
        {t("planModeHelp")}
        {planModeTierOptions.length === 0 && t("planModeNeedsModels")}
      </span>
      {value.plan_mode_min_tier !== undefined && (
        <div style={{ maxWidth: 320 }}>
          <TierRowSelect
            label={t("planModeMinTierLabel")}
            options={planModeTierOptions}
            value={value.plan_mode_min_tier ?? null}
            onValueChange={(tier) => onChange({ ...value, plan_mode_min_tier: tier })}
          />
        </div>
      )}
      <div className="mt-4">
        <strong className="mb-1 block font-semibold">{t("planModeSentinelsLabel")}</strong>
        <MultiSelect
          options={(value.plan_mode_patterns ?? []).map((pattern) => ({ label: pattern, value: pattern }))}
          value={value.plan_mode_patterns ?? []}
          onValueChange={(patterns) =>
            onChange({ ...value, plan_mode_patterns: patterns.length > 0 ? patterns : undefined })
          }
          placeholder={t("planModeSentinelsPlaceholder")}
          emptyText={t("typeToAddSentinel")}
          allowCustomValues
          className="w-full"
        />
        <span className="mt-1 block text-xs text-muted-foreground">{t("planModeSentinelsHelp")}</span>
      </div>
    </>
  );
};

export default PlanModeOverrideControls;
