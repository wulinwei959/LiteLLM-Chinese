import React from "react";
import { MultiSelect } from "@/components/shared/MultiSelect";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SimpleTooltip } from "@/components/ui/tooltip";
import type { Dayjs } from "dayjs";
import { ChevronDown, Info } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Team } from "../key_team_helpers/key_list";
import { validatorRules } from "../common_components/formRules";
import { labelWithHint } from "@/components/shared/form/LabelWithHint";
import { MountedFormField } from "../common_components/MountedFormField";
import { UtcDateTimeInput } from "@/components/shared/form/UtcDateTimeInput";
import CacheControlInjectionPoints, { NEW_CACHE_CONTROL_POINT } from "./cache_control_settings";
import VectorStoreSelector from "../vector_store_management/VectorStoreSelector";
import { Tag } from "../tag_management/types";
import { formItemValidateJSON } from "../../utils/textUtils";
import {
  PTU_COUNT_FIELD,
  PTU_RATE_FIELD,
  PTU_START_FIELD,
  ptuCountRule,
  ptuNoUsageCostRule,
  ptuPairRule,
  ptuRateRule,
  ptuStartRequiredRule,
  ptuWindowOrderRule,
  PTU_END_FIELD,
} from "../../utils/ptuValidation";
import { usePtuCostAttributionEnabled } from "@/app/(dashboard)/hooks/uiSettings/usePtuCostAttributionEnabled";
import { useTranslations } from "next-intl";

interface AdvancedSettingsProps {
  showAdvancedSettings: boolean;
  setShowAdvancedSettings: (show: boolean) => void;
  teams?: Team[] | null;
  guardrailsList: string[];
  tagsList: Record<string, Tag>;
  accessToken: string;
}

const USAGE_COST_FIELDS = [
  "input_cost_per_token",
  "output_cost_per_token",
  "cache_read_input_token_cost",
  "cache_creation_input_token_cost",
  "cache_creation_input_token_cost_above_1hr",
  "input_cost_per_second",
];

const REVALIDATED_WHEN_PTU_COUNT_CHANGES = [PTU_RATE_FIELD, PTU_START_FIELD, ...USAGE_COST_FIELDS];

type AdvancedSettingsTranslator = ReturnType<typeof useTranslations<"models.addModel">>;

const validateNumber = (t: AdvancedSettingsTranslator) => (_: unknown, value: unknown) => {
  if (!value) {
    return Promise.resolve();
  }
  if (isNaN(Number(value)) || Number(value) < 0) {
    return Promise.reject(t("validPositiveNumber"));
  }
  return Promise.resolve();
};

const usageCostRules = (t: AdvancedSettingsTranslator) => ({
  deps: [PTU_COUNT_FIELD],
  validate: validatorRules({ validator: validateNumber(t) }, ptuNoUsageCostRule(PTU_COUNT_FIELD, t)),
});

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  showAdvancedSettings,
  setShowAdvancedSettings,
  teams,
  guardrailsList,
  tagsList,
  accessToken,
}) => {
  const t = useTranslations("models.addModel");

  const PRICING_MODEL_ITEMS = [
    { value: "per_token", label: t("perToken") },
    { value: "per_second", label: t("perSecond") },
  ] as const;

  const [customPricing, setCustomPricing] = React.useState(false);
  const [pricingModel, setPricingModel] = React.useState<"per_token" | "per_second">("per_token");
  const [showCacheControl, setShowCacheControl] = React.useState(false);
  const ptuCostAttributionEnabled = usePtuCostAttributionEnabled();

  const handlePricingModelChange =
    (onChange: (value: string) => void) =>
    (value: "per_token" | "per_second" | null): void => {
      if (value === null) return;
      onChange(value);
      setPricingModel(value);
    };

  return (
    <>
      <Collapsible className="mt-2 mb-4 overflow-hidden rounded-lg border">
        <CollapsibleTrigger className="group/section flex w-full items-center justify-between px-4 py-3 text-left">
          <b>{t("advancedSettings")}</b>
          <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]/section:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pb-3">
          <div className="rounded-lg">
            <MountedFormField name="custom_pricing" label={t("customPricing")} className="mb-4">
              {(control) => (
                <Switch
                  id={control.id}
                  checked={control.value === true}
                  onCheckedChange={(checked) => {
                    control.onChange(checked);
                    setCustomPricing(checked);
                  }}
                />
              )}
            </MountedFormField>

            <MountedFormField
              name="vector_store_ids"
              label={
                <span>
                  {t("attachedKnowledgeBases")}
                  <SimpleTooltip content={t("vectorStoreTooltip")}>
                    <a
                      href="https://docs.litellm.ai/docs/completion/knowledgebase"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Info className="ml-1 inline size-3.5 align-text-bottom" />
                    </a>
                  </SimpleTooltip>
                </span>
              }
              className="mt-4"
              help={t("vectorStoreHelp")}
            >
              {(control) => (
                <VectorStoreSelector
                  onChange={control.onChange}
                  value={control.value as string[] | undefined}
                  accessToken={accessToken}
                  placeholder={t("selectKnowledgeBasesPlaceholder")}
                />
              )}
            </MountedFormField>

            <MountedFormField
              name="guardrails"
              label={
                <span>
                  {t("guardrails")}
                  <SimpleTooltip content={t("guardrailsTooltip")}>
                    <a
                      href="https://docs.litellm.ai/docs/proxy/guardrails/quick_start"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()} // Prevent accordion from collapsing when clicking link
                    >
                      <Info className="ml-1 inline size-3.5 align-text-bottom" />
                    </a>
                  </SimpleTooltip>
                </span>
              }
              className="mt-4"
              help={t("guardrailsHelp")}
            >
              {(control) => (
                <MultiSelect
                  id={control.id}
                  placeholder={t("selectOrEnterGuardrails")}
                  emptyText={t("typeToAddGuardrail")}
                  value={(control.value as string[] | undefined) ?? []}
                  onValueChange={control.onChange}
                  options={guardrailsList.map((name) => ({ value: name, label: name }))}
                  allowCustomValues
                />
              )}
            </MountedFormField>

            <MountedFormField name="tags" label={t("tags")} className="mb-4">
              {(control) => (
                <MultiSelect
                  id={control.id}
                  placeholder={t("selectOrEnterTags")}
                  emptyText={t("typeToAddTag")}
                  value={(control.value as string[] | undefined) ?? []}
                  onValueChange={control.onChange}
                  options={Object.values(tagsList).map((tag) => ({
                    value: tag.name,
                    label: tag.name,
                    description: tag.description || undefined,
                  }))}
                  allowCustomValues
                />
              )}
            </MountedFormField>

            {ptuCostAttributionEnabled && (
              <>
                <MountedFormField
                  name={PTU_COUNT_FIELD}
                  label={labelWithHint(t("ptuCount"), t("ptuCountHint"))}
                  rules={{
                    deps: REVALIDATED_WHEN_PTU_COUNT_CHANGES,
                    validate: validatorRules(
                      { validator: validateNumber(t) },
                      ptuCountRule(t),
                      ptuPairRule(PTU_RATE_FIELD, t),
                    ),
                  }}
                  className="mb-4"
                >
                  {(control) => (
                    <Input
                      id={control.id}
                      value={(control.value as string | undefined) ?? ""}
                      onChange={control.onChange}
                      onBlur={control.onBlur}
                      placeholder={t("ptuCountPlaceholder")}
                    />
                  )}
                </MountedFormField>

                <MountedFormField
                  name={PTU_RATE_FIELD}
                  label={labelWithHint(t("ptuRate"), t("ptuRateHint"))}
                  rules={{
                    deps: [PTU_COUNT_FIELD],
                    validate: validatorRules(
                      { validator: validateNumber(t) },
                      ptuRateRule(t),
                      ptuPairRule(PTU_COUNT_FIELD, t),
                    ),
                  }}
                  className="mb-4"
                >
                  {(control) => (
                    <Input
                      id={control.id}
                      value={(control.value as string | undefined) ?? ""}
                      onChange={control.onChange}
                      onBlur={control.onBlur}
                      placeholder={t("ptuRatePlaceholder")}
                    />
                  )}
                </MountedFormField>

                <MountedFormField
                  name={PTU_START_FIELD}
                  label={labelWithHint(t("ptuStart"), t("ptuStartHint"))}
                  rules={{
                    deps: [PTU_END_FIELD],
                    validate: validatorRules(
                      ptuStartRequiredRule(PTU_COUNT_FIELD, t),
                      ptuWindowOrderRule(PTU_END_FIELD, "start", t),
                    ),
                  }}
                  className="mb-4"
                >
                  {(control) => (
                    <UtcDateTimeInput
                      id={control.id}
                      value={control.value as Dayjs | null}
                      onChange={control.onChange}
                      onBlur={control.onBlur}
                    />
                  )}
                </MountedFormField>

                <MountedFormField
                  name={PTU_END_FIELD}
                  label={labelWithHint(t("ptuEnd"), t("ptuEndHint"))}
                  rules={{
                    deps: [PTU_START_FIELD],
                    validate: validatorRules(ptuWindowOrderRule(PTU_START_FIELD, "end", t)),
                  }}
                  className="mb-4"
                >
                  {(control) => (
                    <UtcDateTimeInput
                      id={control.id}
                      value={control.value as Dayjs | null}
                      onChange={control.onChange}
                      onBlur={control.onBlur}
                    />
                  )}
                </MountedFormField>
              </>
            )}

            {customPricing && (
              <div className="ml-6 pl-4 border-l-2 border-border">
                <MountedFormField name="pricing_model" label={t("pricingModel")} className="mb-4">
                  {(control) => (
                    <Select
                      items={PRICING_MODEL_ITEMS}
                      value={(control.value as "per_token" | "per_second" | undefined) ?? "per_token"}
                      onValueChange={handlePricingModelChange(control.onChange)}
                    >
                      <SelectTrigger id={control.id} onBlur={control.onBlur} className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PRICING_MODEL_ITEMS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </MountedFormField>

                {pricingModel === "per_token" ? (
                  <>
                    <MountedFormField
                      name="input_cost_per_token"
                      label={t("inputCostPerToken")}
                      rules={usageCostRules(t)}
                      className="mb-4"
                    >
                      {(control) => (
                        <Input
                          id={control.id}
                          value={(control.value as string | undefined) ?? ""}
                          onChange={control.onChange}
                          onBlur={control.onBlur}
                        />
                      )}
                    </MountedFormField>
                    <MountedFormField
                      name="output_cost_per_token"
                      label={t("outputCostPerToken")}
                      rules={usageCostRules(t)}
                      className="mb-4"
                    >
                      {(control) => (
                        <Input
                          id={control.id}
                          value={(control.value as string | undefined) ?? ""}
                          onChange={control.onChange}
                          onBlur={control.onBlur}
                        />
                      )}
                    </MountedFormField>
                    <MountedFormField
                      name="cache_read_input_token_cost"
                      label={labelWithHint(t("cacheReadCostPerToken"), t("cacheReadHint"))}
                      rules={usageCostRules(t)}
                      className="mb-4"
                    >
                      {(control) => (
                        <Input
                          id={control.id}
                          value={(control.value as string | undefined) ?? ""}
                          onChange={control.onChange}
                          onBlur={control.onBlur}
                          placeholder={t("defaultsToInputCost")}
                        />
                      )}
                    </MountedFormField>
                    <MountedFormField
                      name="cache_creation_input_token_cost"
                      label={labelWithHint(t("cacheWriteCostPerToken"), t("cacheWriteHint"))}
                      rules={usageCostRules(t)}
                      className="mb-4"
                    >
                      {(control) => (
                        <Input
                          id={control.id}
                          value={(control.value as string | undefined) ?? ""}
                          onChange={control.onChange}
                          onBlur={control.onBlur}
                          placeholder={t("defaultsToInputCost")}
                        />
                      )}
                    </MountedFormField>
                    <MountedFormField
                      name="cache_creation_input_token_cost_above_1hr"
                      label={labelWithHint(t("cacheWriteCostAbove1hr"), t("cacheWriteCostAbove1hrHint"))}
                      rules={usageCostRules(t)}
                      className="mb-4"
                    >
                      {(control) => (
                        <Input
                          id={control.id}
                          value={(control.value as string | undefined) ?? ""}
                          onChange={control.onChange}
                          onBlur={control.onBlur}
                          placeholder={t("cacheWriteCostAbove1hrPlaceholder")}
                        />
                      )}
                    </MountedFormField>
                  </>
                ) : (
                  <MountedFormField
                    name="input_cost_per_second"
                    label={t("inputCostPerSecond")}
                    rules={usageCostRules(t)}
                    className="mb-4"
                  >
                    {(control) => (
                      <Input
                        id={control.id}
                        value={(control.value as string | undefined) ?? ""}
                        onChange={control.onChange}
                        onBlur={control.onBlur}
                      />
                    )}
                  </MountedFormField>
                )}
              </div>
            )}

            <MountedFormField
              name="use_in_pass_through"
              label={labelWithHint(
                t("useInPassThrough"),
                <span>
                  {t("passThroughAllow")}{" "}
                  <a
                    href="https://docs.litellm.ai/docs/pass_through/vertex_ai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {t("learnMore")}
                  </a>
                </span>,
              )}
              className="mb-4 mt-4"
            >
              {(control) => (
                <Switch id={control.id} checked={control.value === true} onCheckedChange={control.onChange} />
              )}
            </MountedFormField>

            <MountedFormField
              name="kubernetes_pod_discovery"
              label={labelWithHint(
                "Kubernetes pod discovery",
                "Treat the API Base hostname as a Kubernetes headless service: resolve it to its ready pod IPs " +
                  "and spread requests across the pods. LiteLLM must run inside the same cluster.",
              )}
              className="mb-4"
            >
              {(control) => (
                <Switch id={control.id} checked={control.value === true} onCheckedChange={control.onChange} />
              )}
            </MountedFormField>

            <MountedFormField
              name="cache_control"
              label={labelWithHint(t("cacheControl"), t("cacheControlTooltip"))}
              className="mb-4"
            >
              {(control) => (
                <Switch
                  id={control.id}
                  checked={control.value === true}
                  onCheckedChange={(checked) => {
                    control.onChange(checked);
                    setShowCacheControl(checked);
                  }}
                />
              )}
            </MountedFormField>

            {showCacheControl && (
              <MountedFormField name="cache_control_injection_points" defaultValue={[NEW_CACHE_CONTROL_POINT]} bare>
                {(control) => (
                  <CacheControlInjectionPoints
                    value={control.value as React.ComponentProps<typeof CacheControlInjectionPoints>["value"]}
                    onChange={control.onChange}
                  />
                )}
              </MountedFormField>
            )}
            <MountedFormField
              name="litellm_extra_params"
              label={labelWithHint(t("litellmParamsLabel"), t("litellmParamsHint"))}
              className="mb-4 mt-4"
              rules={{
                validate: validatorRules({ validator: (_, value) => formItemValidateJSON(_, value, t("invalidJson")) }),
              }}
            >
              {(control) => (
                <Textarea
                  id={control.id}
                  value={(control.value as string | undefined) ?? ""}
                  onChange={control.onChange}
                  onBlur={control.onBlur}
                  rows={4}
                  placeholder='{
                  "rpm": 100,
                  "timeout": 0,
                  "stream_timeout": 0
                }'
                />
              )}
            </MountedFormField>
            <div className="grid grid-cols-24 mb-4">
              <p className="col-start-11 col-span-10 text-muted-foreground text-sm">
                {t("passJsonHint")}{" "}
                <a
                  href="https://docs.litellm.ai/docs/completion/input"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t("litellmCompletionCall")}
                </a>
              </p>
            </div>
            <MountedFormField
              name="model_info_params"
              label={labelWithHint(t("modelInfoLabel"), t("modelInfoHint"))}
              className="mb-0"
              rules={{
                validate: validatorRules({ validator: (_, value) => formItemValidateJSON(_, value, t("invalidJson")) }),
              }}
            >
              {(control) => (
                <Textarea
                  id={control.id}
                  value={(control.value as string | undefined) ?? ""}
                  onChange={control.onChange}
                  onBlur={control.onBlur}
                  rows={4}
                  placeholder='{
                  "mode": "chat"
                }'
                />
              )}
            </MountedFormField>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};

export default AdvancedSettings;
