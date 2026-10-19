import React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { AGENT_FORM_CONFIG, configText } from "./agent_config";
import { AgentFormField, labelWithHint } from "./AgentFormKit";

export const COST_FIELD_NAMES: readonly string[] = AGENT_FORM_CONFIG.cost.fields.map((field) => field.name);

const CostConfigFields: React.FC = () => {
  const t = useTranslations("agents");
  return (
    <>
      {AGENT_FORM_CONFIG.cost.fields.map((field) => (
        <AgentFormField
          key={field.name}
          name={field.name}
          label={
            field.tooltip
              ? labelWithHint(configText(t, field.label), configText(t, field.tooltip))
              : configText(t, field.label)
          }
        >
          {({ value, onChange, ref, ...control }) => (
            <Input
              {...control}
              ref={ref}
              type="number"
              step="0.000001"
              placeholder={field.placeholder}
              value={typeof value === "string" || typeof value === "number" ? value : ""}
              onChange={onChange}
            />
          )}
        </AgentFormField>
      ))}
    </>
  );
};

export default CostConfigFields;
