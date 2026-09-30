"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useController } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  asText,
  GuardrailField,
  labelWithHint,
  requiredRule,
  type GuardrailCriterion,
  type GuardrailFieldControlProps,
  type GuardrailFormControl,
} from "../GuardrailFormField";

interface LLMJudgeFieldsProps {
  availableModels: string[];
  control: GuardrailFormControl;
}

const DEFAULT_CRITERIA: GuardrailCriterion[] = [{ name: "", weight: 100, description: "" }];

const ON_FAILURE_ITEMS = [
  { labelKey: "judge.blockOption", value: "block" },
  { labelKey: "judge.logOption", value: "log" },
] as const;

const clampToRange = (value: unknown, min: number, max: number): number | null => {
  if (typeof value !== "number" || Number.isNaN(value)) return null;
  return Math.min(max, Math.max(min, value));
};

interface BoundedNumberInputProps {
  control: GuardrailFieldControlProps;
  min: number;
  max: number;
  suffix: string;
  placeholder?: string;
}

const BoundedNumberInput: React.FC<BoundedNumberInputProps> = ({ control, min, max, suffix, placeholder }) => {
  const { id, name, value, onChange, onBlur, ...aria } = control;

  return (
    <InputGroup>
      <InputGroupInput
        id={id}
        name={name}
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        value={asText(value)}
        onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}
        onBlur={() => {
          onChange(clampToRange(value, min, max));
          onBlur();
        }}
        {...aria}
      />
      <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>
    </InputGroup>
  );
};

const LLMJudgeFields: React.FC<LLMJudgeFieldsProps> = ({ availableModels, control }) => {
  const t = useTranslations("guardrails");
  const { field } = useController({ control, name: "criteria", defaultValue: DEFAULT_CRITERIA });
  const criteria: GuardrailCriterion[] = Array.isArray(field.value) ? field.value : [];
  const setCriteria = field.onChange;

  const weightTotal = criteria.reduce((sum, entry) => sum + (Number(entry?.weight) || 0), 0);
  const weightOk = weightTotal === 100;

  return (
    <FieldGroup>
      <div className="rounded-md border border-success/20 bg-success/10 px-3.5 py-2.5 text-[13px] text-success">
        {t.rich("judge.banner", {
          strong: (chunks) => <strong>{chunks}</strong>,
        })}
      </div>

      <GuardrailField
        control={control}
        name="judge_model"
        label={labelWithHint(t("judge.modelName"), t("judge.modelHint"))}
        rules={requiredRule(t("judge.modelRequired"))}
      >
        {({ id, value, onChange, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }) => (
          <Combobox items={availableModels} value={asText(value) || null} onValueChange={onChange}>
            <ComboboxInput
              id={id}
              aria-invalid={ariaInvalid}
              aria-describedby={ariaDescribedBy}
              placeholder={t("judge.modelPlaceholder")}
              className="w-full"
            />
            <ComboboxContent>
              <ComboboxEmpty>{t("judge.noModels")}</ComboboxEmpty>
              <ComboboxList>
                {(model: string) => (
                  <ComboboxItem key={model} value={model} title={model}>
                    {model}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        )}
      </GuardrailField>

      <GuardrailField
        control={control}
        name="overall_threshold"
        label={labelWithHint(t("judge.thresholdLabel"), t("judge.thresholdHint"))}
        defaultValue={80}
      >
        {(fieldControl) => <BoundedNumberInput control={fieldControl} min={0} max={100} suffix="/ 100" />}
      </GuardrailField>

      <GuardrailField
        control={control}
        name="on_failure"
        label={labelWithHint(t("judge.failureLabel"), t("judge.failureHint"))}
        defaultValue="block"
      >
        {({ id, value, onChange, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }) => (
          <Select
            items={ON_FAILURE_ITEMS.map((item) => ({ value: item.value, label: t(item.labelKey) }))}
            value={asText(value) || null}
            onValueChange={onChange}
          >
            <SelectTrigger id={id} aria-invalid={ariaInvalid} aria-describedby={ariaDescribedBy} className="w-full">
              <SelectValue placeholder={t("judge.selectAction")} />
            </SelectTrigger>
            <SelectContent>
              {ON_FAILURE_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </GuardrailField>

      <Field>
        <FieldLabel>{labelWithHint(t("judge.criteriaLabel"), t("judge.criteriaHint"))}</FieldLabel>

        {criteria.map((_, index) => (
          <div key={index} className="mb-2 rounded-md border border-border p-3">
            <div className="flex items-end gap-2">
              <GuardrailField
                control={control}
                name={`criteria.${index}.name`}
                rules={requiredRule(t("judge.nameRequired"))}
                className="flex-2"
              >
                {({ ref, value, ...field }) => (
                  <Input
                    {...field}
                    ref={ref}
                    value={asText(value)}
                    placeholder={t("judge.namePlaceholder")}
                  />
                )}
              </GuardrailField>
              <GuardrailField
                control={control}
                name={`criteria.${index}.weight`}
                label={labelWithHint(
                  <span className="text-xs text-muted-foreground">{t("judge.weightLabel")}</span>,
                  t("judge.weightHint"),
                )}
                rules={requiredRule(t("judge.weightRequired"))}
                className="flex-1"
              >
                {(fieldControl) => (
                  <BoundedNumberInput control={fieldControl} min={0} max={100} suffix="%" placeholder={t("judge.weightPlaceholder")} />
                )}
              </GuardrailField>
              <Button
                variant="ghost"
                size="sm"
                aria-label={t("judge.removeCriterion")}
                className="mb-1 text-destructive hover:text-destructive/80"
                onClick={() => setCriteria(criteria.filter((_, position) => position !== index))}
              >
                <X className="size-4" />
              </Button>
            </div>
            <GuardrailField
              control={control}
              name={`criteria.${index}.description`}
              rules={requiredRule(t("judge.descRequired"))}
              className="mt-2"
            >
              {({ ref, value, ...field }) => (
                <Input
                  {...field}
                  ref={ref}
                  value={asText(value)}
                  placeholder={t("judge.descPlaceholder")}
                />
              )}
            </GuardrailField>
          </div>
        ))}

        <Button
          variant="outline"
          className="mt-1 w-full border-dashed"
          onClick={() => setCriteria([...criteria, { name: "", weight: 0, description: "" }])}
        >
          <Plus className="size-4" />
          {t("judge.addCriterion")}
        </Button>

        {criteria.length > 0 && (
          <div className={`mt-1.5 text-xs ${weightOk ? "text-success" : "text-warning"}`}>
            {t("judge.weightsTotal", { total: weightTotal })}
            {weightOk ? " ✓" : t("judge.weightsWarn")}
          </div>
        )}
      </Field>
    </FieldGroup>
  );
};

export default LLMJudgeFields;
