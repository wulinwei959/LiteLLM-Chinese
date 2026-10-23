"use client";

import { CircleHelp } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";

import { useUISettings } from "@/app/(dashboard)/hooks/uiSettings/useUISettings";
import { useUpdateUISettings } from "@/app/(dashboard)/hooks/uiSettings/useUpdateUISettings";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import {
  parseSupportedTeamAdminEditableFields,
  parseTeamAdminEditableFields,
  TEAM_ADMIN_METADATA_FIELD,
  TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION,
  teamAdminFieldLabel,
  type TeamAdminSettingsField,
} from "@/components/team/teamAdminEditAccess";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/cva.config";
import { useZodForm } from "@/lib/forms/useZodForm";
import { toast } from "@/lib/toast";
import { useTranslations } from "next-intl";

const editableFieldsSchema = z.object({ team_admin_editable_team_fields: z.array(z.string()) });

type SaveEditableFields = ReturnType<typeof useUpdateUISettings>["mutate"];

const MAX_BUDGET_FIELD: TeamAdminSettingsField = "max_budget";

export const RAISE_MAX_BUDGET_HELP_KEY = "aboutRaiseMaxBudget";
export const RAISE_MAX_BUDGET_TOOLTIP_KEY = "raiseMaxBudgetTooltip";
const METADATA_HELP_KEY = "aboutTeamMetadata";
const METADATA_TOOLTIP_KEY = "teamMetadataTooltip";

type TeamAdminEditableMessageKey =
  | typeof RAISE_MAX_BUDGET_HELP_KEY
  | typeof RAISE_MAX_BUDGET_TOOLTIP_KEY
  | typeof METADATA_HELP_KEY
  | typeof METADATA_TOOLTIP_KEY;
export const TEAM_ADMIN_FIELDS_DOCS_URL =
  "https://docs.litellm.ai/docs/proxy/access_control#choosing-what-team-admins-can-edit";

const toggleEditableField = (
  supportedFields: readonly string[],
  draft: readonly string[],
  name: string,
  checked: boolean,
): string[] => {
  const selected = supportedFields.filter((item) => (item === name ? checked : draft.includes(item)));
  return selected.includes(MAX_BUDGET_FIELD)
    ? selected
    : selected.filter((item) => item !== TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION);
};

export default function TeamAdminEditableFieldsSettings() {
  const t = useTranslations("adminPanel");
  const { accessToken } = useAuthorized();
  const { data, isLoading } = useUISettings();
  const { mutate: saveSettings, isPending } = useUpdateUISettings(accessToken);
  const supportedFields = parseSupportedTeamAdminEditableFields(data?.field_schema);
  const savedFields = parseTeamAdminEditableFields(data?.values);
  const enabledFields = supportedFields.filter((field) => savedFields.includes(field));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle>{t("teamAdminEditable.title")}</CardTitle>
          <Badge variant={enabledFields.length > 0 ? "secondary" : "outline"}>
            {enabledFields.length > 0
              ? t("teamAdminEditable.fieldsEnabled", { count: enabledFields.length })
              : t("teamAdminEditable.noFieldsEnabled")}
          </Badge>
        </div>
        <CardDescription>
          {data?.field_schema?.properties?.team_admin_editable_team_fields?.description ??
            t("teamAdminEditable.descriptionFallback")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <TeamAdminEditableFieldsForm
            key={enabledFields.join(",")}
            enabledFields={enabledFields}
            supportedFields={supportedFields}
            isPending={isPending}
            saveSettings={saveSettings}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface TeamAdminEditableFieldsFormProps {
  enabledFields: readonly string[];
  supportedFields: readonly string[];
  isPending: boolean;
  saveSettings: SaveEditableFields;
}

function TeamAdminEditableFieldsForm({
  enabledFields,
  supportedFields,
  isPending,
  saveSettings,
}: TeamAdminEditableFieldsFormProps) {
  const t = useTranslations("adminPanel");
  const commonT = useTranslations("common");
  const form = useZodForm(editableFieldsSchema, {
    defaultValues: { team_admin_editable_team_fields: [...enabledFields] },
  });
  const submit = form.handleSubmit((values) =>
    saveSettings(values, {
      onSuccess: () => {
        form.reset(values);
        toast.success(t("teamAdminEditable.updatedToast"));
      },
      onError: (error) => {
        toast.fromError(error);
      },
    }),
  );

  if (supportedFields.length === 0) {
    return <p className="text-sm italic text-muted-foreground">{t("teamAdminEditable.unsupportedProxy")}</p>;
  }

  const raiseMaxBudgetSupported = supportedFields.includes(TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION);
  const listedFields = supportedFields.filter((name) => name !== TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION);

  return (
    <form onSubmit={(event) => void submit(event)} className="space-y-4">
      <Controller
        control={form.control}
        name="team_admin_editable_team_fields"
        render={({ field }) => {
          const toggle = (name: string) => (checked: boolean) =>
            field.onChange(toggleEditableField(supportedFields, field.value, name, checked));
          return (
            <div className="space-y-2">
              {listedFields.map((name) => (
                <Fragment key={name}>
                  <EditableFieldCheckbox
                    name={name}
                    checked={field.value.includes(name)}
                    disabled={isPending}
                    onCheckedChange={toggle(name)}
                    help={
                      name === TEAM_ADMIN_METADATA_FIELD ? (
                        <FieldHelp labelKey={METADATA_HELP_KEY} textKey={METADATA_TOOLTIP_KEY} />
                      ) : undefined
                    }
                  />
                  {name === MAX_BUDGET_FIELD && raiseMaxBudgetSupported && (
                    <EditableFieldCheckbox
                      name={TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION}
                      checked={field.value.includes(TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION)}
                      disabled={isPending || !field.value.includes(MAX_BUDGET_FIELD)}
                      onCheckedChange={toggle(TEAM_ADMIN_RAISE_MAX_BUDGET_PERMISSION)}
                      className="ml-6"
                      help={<FieldHelp labelKey={RAISE_MAX_BUDGET_HELP_KEY} textKey={RAISE_MAX_BUDGET_TOOLTIP_KEY} />}
                    />
                  )}
                </Fragment>
              ))}
            </div>
          );
        }}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending || !form.formState.isDirty}>
          {isPending ? commonT("saving") : commonT("save")}
        </Button>
      </div>
    </form>
  );
}

interface EditableFieldCheckboxProps {
  name: string;
  checked: boolean;
  disabled: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  help?: ReactNode;
}

function EditableFieldCheckbox({
  name,
  checked,
  disabled,
  onCheckedChange,
  className,
  help,
}: EditableFieldCheckboxProps) {
  const teamsT = useTranslations("teams");
  const checkboxId = `team-admin-editable-${name}`;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <label htmlFor={checkboxId} className="flex cursor-pointer items-center gap-2">
        <Checkbox id={checkboxId} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
        <span className="text-sm text-foreground">{teamAdminFieldLabel(teamsT, name)}</span>
      </label>
      {help}
    </div>
  );
}

interface FieldHelpProps {
  labelKey: TeamAdminEditableMessageKey;
  textKey: TeamAdminEditableMessageKey;
}

function FieldHelp({ labelKey, textKey }: FieldHelpProps) {
  const t = useTranslations("adminPanel.teamAdminEditable");
  const commonT = useTranslations("common");
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          type="button"
          aria-label={t(labelKey)}
          className="inline-flex cursor-help items-center rounded-sm text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <CircleHelp className="size-3.5" />
        </TooltipTrigger>
        <TooltipContent>
          <span>
            {t(textKey)}{" "}
            <a href={TEAM_ADMIN_FIELDS_DOCS_URL} target="_blank" rel="noopener noreferrer" className="underline">
              {commonT("learnMore")}
            </a>
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
