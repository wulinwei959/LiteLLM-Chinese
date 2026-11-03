"use client";
import { useTranslations } from "next-intl";
import React from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import { isProxyAdminRole } from "../../utils/roles";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import BudgetDurationDropdown from "../common_components/budget_duration_dropdown";
import RateLimitTypeFormItem from "../common_components/RateLimitTypeFormItem";
import { MountedFormField } from "../common_components/MountedFormField";
import { BudgetFallbacksEditor } from "../key_team_helpers/BudgetFallbacksEditor";
import { EndUserBudgetSelect } from "../key_team_helpers/EndUserBudgetSelect";
import { BudgetWindowEntry, BudgetWindowsEditor } from "../key_team_helpers/BudgetWindowsEditor";
import { ModelMaxBudget, ModelMaxBudgetEditor } from "../key_team_helpers/ModelMaxBudgetEditor";
import { TagRateLimitEditor, TagRateLimitEntry } from "../key_team_helpers/TagRateLimitEditor";
import { Team } from "../key_team_helpers/key_list";
import NumericalInput from "../shared/numerical_input";

const ceilingRule = (ceiling: number | null | undefined, message: (limit: number) => string) => ({
  validate: (value: unknown) =>
    value && ceiling !== null && ceiling !== undefined && (value as number) > ceiling ? message(ceiling) : true,
});

interface CreateKeyBudgetFieldsProps {
  readonly team: Team | null;
  readonly keyOwner: string;
  readonly userRole: string | null;
  readonly accessToken: string | null;
  readonly premiumUser: boolean | null;
  readonly modelsToPick: string[];
  readonly budgetLimits: BudgetWindowEntry[];
  readonly setBudgetLimits: (next: BudgetWindowEntry[]) => void;
  readonly modelMaxBudget: ModelMaxBudget;
  readonly setModelMaxBudget: (next: ModelMaxBudget) => void;
  readonly tagRateLimits: TagRateLimitEntry[];
  readonly setTagRateLimits: (next: TagRateLimitEntry[]) => void;
  readonly budgetFallbacks: Record<string, string[]>;
  readonly setBudgetFallbacks: (next: Record<string, string[]>) => void;
  readonly budgetFallbacksKey: number;
}

export const CreateKeyBudgetFields: React.FC<CreateKeyBudgetFieldsProps> = ({
  team,
  keyOwner,
  userRole,
  accessToken,
  premiumUser,
  modelsToPick,
  budgetLimits,
  setBudgetLimits,
  modelMaxBudget,
  setModelMaxBudget,
  tagRateLimits,
  setTagRateLimits,
  budgetFallbacks,
  setBudgetFallbacks,
  budgetFallbacksKey,
}) => {
  const t = useTranslations("virtualKeys");
  const ct = useTranslations("virtualKeys.createForm");
  const commonT = useTranslations("common");
  const budgetEditorsT = useTranslations("budgetEditors");
  const tDuration = useTranslations("common.budgetDuration");

  return (
    <>
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {t("editForm.maxBudget")}{" "}
            <SimpleTooltip content={ct("maxBudgetHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="max_budget"
        help={ct("budgetCeiling", { budget: team?.max_budget ?? commonT("unlimitedLower") })}
        rules={ceilingRule(team?.max_budget, (limit) =>
          ct("budgetCeiling", { budget: formatNumberWithCommas(limit, 4) }),
        )}
      >
        {(control) => (
          <NumericalInput
            {...control}
            value={control.value as number | string | undefined}
            step={0.01}
            precision={2}
            width={200}
          />
        )}
      </MountedFormField>
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {t("editForm.resetBudget")}{" "}
            <SimpleTooltip content={ct("resetBudgetHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="budget_duration"
        help={ct("teamResetBudget", { duration: team?.budget_duration ?? commonT("none") })}
      >
        {(control) => (
          <BudgetDurationDropdown
            id={control.id}
            value={control.value as string | null | undefined}
            showNeverResets
            placeholder={tDuration("notSet")}
            onChange={(next) => control.onChange(next ?? undefined)}
          />
        )}
      </MountedFormField>
      <Field className="mt-4">
        <FieldLabel>
          <span>
            {t("editForm.budgetWindows")}{" "}
            <SimpleTooltip content={t("editForm.budgetWindowsHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        </FieldLabel>
        <BudgetWindowsEditor value={budgetLimits} onChange={setBudgetLimits} />
      </Field>
      <Field className="mt-4">
        <FieldLabel>
          <span>
            {budgetEditorsT("model.fieldLabel")}{" "}
            <SimpleTooltip content={ct("perModelBudgetHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        </FieldLabel>
        <ModelMaxBudgetEditor
          value={modelMaxBudget}
          onChange={setModelMaxBudget}
          availableModels={modelsToPick}
          premiumUser={premiumUser === true}
        />
      </Field>
      <Field className="mt-4">
        <FieldLabel>
          <span>
            {t("info.budgetFallbacksLabel")}{" "}
            <SimpleTooltip content={ct("budgetFallbacksHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        </FieldLabel>
        <BudgetFallbacksEditor
          key={budgetFallbacksKey}
          value={budgetFallbacks}
          onChange={setBudgetFallbacks}
          availableModels={modelsToPick}
        />
      </Field>
      {keyOwner === "service_account" && isProxyAdminRole(userRole ?? "") && (
        <MountedFormField
          className="mt-4"
          label={
            <span>
              {t("editForm.defaultCustomerBudget")}{" "}
              <SimpleTooltip content={budgetEditorsT("endUserBudget.hint")}>
                <Info className="ml-1 inline size-3.5 align-text-bottom" />
              </SimpleTooltip>
            </span>
          }
          name="end_user_budget_id"
        >
          {(control) => (
            <EndUserBudgetSelect
              id={control.id}
              accessToken={accessToken}
              value={typeof control.value === "string" ? control.value : null}
              onChange={control.onChange}
              canEdit
            />
          )}
        </MountedFormField>
      )}
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {ct("tpmLabel")}{" "}
            <SimpleTooltip content={ct("tpmHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="tpm_limit"
        help={ct("tpmCeilingHelp", { limit: team?.tpm_limit ?? commonT("unlimitedLower") })}
        rules={ceilingRule(team?.tpm_limit, (limit) => ct("tpmCeilingRule", { limit }))}
      >
        {(control) => (
          <NumericalInput {...control} value={control.value as number | string | undefined} step={1} width={400} />
        )}
      </MountedFormField>
      <MountedFormField name="tpm_limit_type" bare>
        {(control) => (
          <RateLimitTypeFormItem
            type="tpm"
            name="tpm_limit_type"
            className="mt-4"
            showDetailedDescriptions
            id={control.id}
            value={control.value as string | null | undefined}
            onChange={control.onChange}
            aria-invalid={control["aria-invalid"] ? true : undefined}
            aria-describedby={control["aria-describedby"]}
          />
        )}
      </MountedFormField>
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {ct("rpmLabel")}{" "}
            <SimpleTooltip content={ct("rpmHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="rpm_limit"
        help={ct("rpmCeilingHelp", { limit: team?.rpm_limit ?? commonT("unlimitedLower") })}
        rules={ceilingRule(team?.rpm_limit, (limit) => ct("rpmCeilingRule", { limit }))}
      >
        {(control) => (
          <NumericalInput {...control} value={control.value as number | string | undefined} step={1} width={400} />
        )}
      </MountedFormField>
      <MountedFormField name="rpm_limit_type" bare>
        {(control) => (
          <RateLimitTypeFormItem
            type="rpm"
            name="rpm_limit_type"
            className="mt-4"
            showDetailedDescriptions
            id={control.id}
            value={control.value as string | null | undefined}
            onChange={control.onChange}
            aria-invalid={control["aria-invalid"] ? true : undefined}
            aria-describedby={control["aria-describedby"]}
          />
        )}
      </MountedFormField>
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {ct("tpdLabel")}{" "}
            <SimpleTooltip content={t("editForm.tpdHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="tpd_limit"
        help={ct("tpdCeilingHelp", { limit: team?.tpd_limit ?? commonT("unlimitedLower") })}
        rules={ceilingRule(team?.tpd_limit, (limit) => ct("tpdCeilingRule", { limit }))}
      >
        {(control) => (
          <NumericalInput {...control} value={control.value as number | string | undefined} step={1} width={400} />
        )}
      </MountedFormField>
      <Field className="mt-4">
        <FieldLabel>
          <span>
            {t("editForm.perTagRateLimits")}{" "}
            <SimpleTooltip content={t("editForm.perTagRateLimitsHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        </FieldLabel>
        <TagRateLimitEditor value={tagRateLimits} onChange={setTagRateLimits} />
      </Field>
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {t("editForm.throttleOnBudgetExceeded")}{" "}
            <SimpleTooltip content={t("editForm.throttleOnBudgetExceededHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="throttle_on_budget_exceeded"
      >
        {(control) => (
          <Switch
            id={control.id}
            checked={control.value === true}
            onCheckedChange={control.onChange}
            aria-describedby={control["aria-describedby"]}
          />
        )}
      </MountedFormField>
      <MountedFormField
        className="mt-4"
        label={
          <span>
            {t("editForm.enablePromptCaching")}{" "}
            <SimpleTooltip content={t("editForm.enablePromptCachingHint")}>
              <Info className="ml-1 inline size-3.5 align-text-bottom" />
            </SimpleTooltip>
          </span>
        }
        name="enable_prompt_caching"
      >
        {(control) => (
          <Switch
            id={control.id}
            checked={control.value === true}
            onCheckedChange={control.onChange}
            aria-describedby={control["aria-describedby"]}
          />
        )}
      </MountedFormField>
    </>
  );
};
