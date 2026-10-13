import React from "react";
import { useTranslations } from "next-intl";

import { Switch } from "@/components/ui/switch";

import type { ComplexityRouterConfigValue } from "./ComplexityRouterConfig";

export const ModalityRoutingControls: React.FC<{
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
}> = ({ value, onChange }) => {
  const t = useTranslations("models.addModel");
  const modalityRouting = value.modality_routing ?? false;
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Switch
          checked={modalityRouting}
          onCheckedChange={(nextModalityRouting) => onChange({ ...value, modality_routing: nextModalityRouting })}
          aria-label={t("modalityRoutingToggle")}
        />
        <strong className="font-semibold">{t("modalityRoutingToggle")}</strong>
      </div>
      <span className="block text-xs mb-3 text-muted-foreground">{t("modalityRoutingHelp")}</span>
      <div className="flex items-center gap-2 mb-2">
        <Switch
          checked={value.modality_pin_override ?? false}
          onCheckedChange={(modalityPinOverride) => onChange({ ...value, modality_pin_override: modalityPinOverride })}
          disabled={!modalityRouting}
          aria-label={t("modalityPinOverrideToggle")}
        />
        <strong className="font-semibold">{t("modalityPinOverrideToggle")}</strong>
      </div>
      <span className="block text-xs text-muted-foreground">{t("modalityPinOverrideHelp")}</span>
    </>
  );
};
