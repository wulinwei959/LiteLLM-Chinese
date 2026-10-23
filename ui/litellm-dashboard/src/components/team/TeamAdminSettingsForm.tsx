"use client";

import { Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useWatch } from "react-hook-form";
import { z } from "zod";

import type { TeamMetadataField } from "@/app/(dashboard)/hooks/teams/useTeamMetadataSchema";

import { FormField } from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { useZodForm } from "@/lib/forms/useZodForm";
import type { TeamsTranslator } from "@/lib/i18n/translators";

import BudgetDurationDropdown, { NEVER_RESETS_BUDGET_DURATION } from "../common_components/budget_duration_dropdown";
import MetadataKeyValueFields, {
  type MetadataPair,
  buildMetadataPairsSchema,
} from "../common_components/MetadataKeyValueFields";
import NumericalInput from "../shared/numerical_input";
import {
  isTeamAdminDurationSettingsField,
  TEAM_ADMIN_METADATA_FIELD,
  type TeamAdminMetadataContext,
  teamAdminMetadataChange,
  teamAdminMetadataPairIssue,
  TEAM_ADMIN_SETTINGS_FIELDS,
  teamAdminFieldLabel,
  teamAdminSettingsChanges,
  type TeamAdminSettingsChanges,
  type TeamAdminSettingsField,
  type TeamAdminSettingsValues,
} from "./teamAdminEditAccess";

const numericInputSchema = z.union([z.string(), z.number()]).nullish();

const teamAdminSettingsShape = {
  tpm_limit: numericInputSchema,
  rpm_limit: numericInputSchema,
  max_budget: numericInputSchema,
  soft_budget: numericInputSchema,
  team_member_budget: numericInputSchema,
  team_member_budget_duration: z.string().nullish(),
  team_member_tpm_limit: numericInputSchema,
  team_member_rpm_limit: numericInputSchema,
};

const teamAdminSettingsSchemaFor = (t: TeamsTranslator, metadataContext: TeamAdminMetadataContext | undefined) =>
  z.object({
    ...teamAdminSettingsShape,
    metadata: buildMetadataPairsSchema(t)
      .superRefine((pairs, ctx) => {
        if (metadataContext === undefined) return;
        pairs.forEach((pair, index) => {
          const issue = teamAdminMetadataPairIssue(t, pair, metadataContext);
          if (issue) ctx.addIssue({ code: "custom", message: issue.message, path: [index, issue.path] });
        });
      })
      .optional(),
  });

export interface TeamAdminMetadataSettings {
  readonly pairs: readonly MetadataPair[];
  readonly context: TeamAdminMetadataContext;
  readonly schemaFields: readonly TeamMetadataField[];
  readonly schemaLoading: boolean;
}

const INPUT_STEP: Readonly<Record<Exclude<TeamAdminSettingsField, "team_member_budget_duration">, number>> = {
  tpm_limit: 1,
  rpm_limit: 1,
  max_budget: 0.01,
  soft_budget: 0.01,
  team_member_budget: 0.01,
  team_member_tpm_limit: 1,
  team_member_rpm_limit: 1,
};

const fieldHint = (
  t: ReturnType<typeof useTranslations<"teams">>,
  name: TeamAdminSettingsField,
  mayRaiseMaxBudget: boolean,
): string | undefined => {
  if (name !== "max_budget") return undefined;
  return mayRaiseMaxBudget ? t("maxBudgetRaiseHint") : t("maxBudgetKeepOrLowerHint");
};

const durationSelectValue = (value: string | number | null | undefined): string | undefined => {
  if (value === null) return NEVER_RESETS_BUDGET_DURATION;
  return typeof value === "string" ? value : undefined;
};

interface TeamAdminSettingsFormProps {
  initialValues: TeamAdminSettingsValues;
  metadata?: TeamAdminMetadataSettings;
  editableFields: ReadonlySet<string>;
  mayRaiseMaxBudget: boolean;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (changes: TeamAdminSettingsChanges) => Promise<void>;
}

export default function TeamAdminSettingsForm(props: TeamAdminSettingsFormProps) {
  const t = useTranslations("teams");
  const waitsForMetadataSchema =
    props.metadata?.schemaLoading === true && props.editableFields.has(TEAM_ADMIN_METADATA_FIELD);
  if (waitsForMetadataSchema) {
    return (
      <div className="flex justify-center py-6">
        <UiLoadingSpinner className="size-5" />
      </div>
    );
  }
  return <TeamAdminSettingsFormFields {...props} />;
}

function TeamAdminSettingsFormFields({
  initialValues,
  metadata,
  editableFields,
  mayRaiseMaxBudget,
  isSaving,
  onCancel,
  onSave,
}: TeamAdminSettingsFormProps) {
  const t = useTranslations("teams");
  const editsMetadata = metadata !== undefined && editableFields.has(TEAM_ADMIN_METADATA_FIELD);
  const [schema] = useState(() => teamAdminSettingsSchemaFor(t, editsMetadata ? metadata.context : undefined));
  const form = useZodForm(schema, { defaultValues: { ...initialValues, metadata: [...(metadata?.pairs ?? [])] } });
  const draft = useWatch({ control: form.control });
  const changesFrom = (values: typeof draft): TeamAdminSettingsChanges => ({
    ...teamAdminSettingsChanges(values, initialValues, editableFields),
    ...(editsMetadata ? teamAdminMetadataChange(values.metadata, metadata.context) : {}),
  });
  const hasChanges = Object.keys(changesFrom(draft)).length > 0;
  const submit = form.handleSubmit((values) => onSave(changesFrom(values)));

  return (
    <form onSubmit={(event) => void submit(event)}>
      <FieldGroup>
        <p className="text-sm text-muted-foreground">{t("settingsAdminOnlyNotice")}</p>
        {TEAM_ADMIN_SETTINGS_FIELDS.filter((name) => editableFields.has(name)).map((name) => (
          <FormField
            key={name}
            control={form.control}
            name={name}
            label={teamAdminFieldLabel(t, name)}
            description={fieldHint(t, name, mayRaiseMaxBudget)}
          >
            {({ ref, id, value, onChange, ...field }) =>
              isTeamAdminDurationSettingsField(name) ? (
                <BudgetDurationDropdown
                  id={id}
                  showNeverResets
                  placeholder={t("settingsInheritTeamResetPeriod")}
                  value={durationSelectValue(value)}
                  onChange={(next) => onChange(next === NEVER_RESETS_BUDGET_DURATION ? null : next ?? undefined)}
                />
              ) : (
                <NumericalInput
                  {...field}
                  ref={ref}
                  id={id}
                  value={value ?? ""}
                  onChange={onChange}
                  step={INPUT_STEP[name]}
                />
              )
            }
          </FormField>
        ))}
        {editsMetadata && (
          <Field>
            <FieldLabel>{teamAdminFieldLabel(t, TEAM_ADMIN_METADATA_FIELD)}</FieldLabel>
            <MetadataKeyValueFields
              control={form.control}
              getValues={form.getValues}
              name="metadata"
              schemaFields={metadata.schemaFields}
              schemaLoading={metadata.schemaLoading}
            />
            <FieldDescription>{t("adminMetadataJsonHint")}</FieldDescription>
          </Field>
        )}
      </FieldGroup>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          {t("infoCancel")}
        </Button>
        <Button type="submit" disabled={isSaving || !hasChanges}>
          {isSaving ? <UiLoadingSpinner className="size-4" /> : <Save className="size-4" />}
          {t("infoSaveChanges")}
        </Button>
      </div>
    </form>
  );
}
