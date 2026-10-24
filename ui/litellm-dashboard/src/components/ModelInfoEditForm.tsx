"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CircleHelp } from "lucide-react";
import type { Dayjs } from "dayjs";
import * as React from "react";
import { useForm, type Resolver } from "react-hook-form";
import { TagsInput } from "@/app/(dashboard)/guardrails/_components/content_filter/TagsInput";
import { FormField } from "@/components/shared/form/FormField";
import { UtcDateTimeInput } from "@/components/shared/form/UtcDateTimeInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { credentialOptions } from "@/components/shared/credentialOptions";
import { AttachedCredential, CredentialNameHint } from "@/components/shared/CredentialIdentity";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import CacheControlInjectionPoints, { type CacheControlInjectionPoint } from "./add_model/cache_control_settings";
import type { Team } from "./key_team_helpers/key_list";
import type { CredentialItem } from "./networking";
import NumericalInput from "./shared/numerical_input";
import type { Tag } from "./tag_management/types";
import { ModelTeamSelect } from "./view_model/ModelTeamSelect";
import VectorStoreSelector from "./vector_store_management/VectorStoreSelector";
import { formatPtuUtcDisplay } from "../utils/ptuDatetime";
import {
  PTU_EDIT_FIELDS,
  buildSchema,
  displayCost,
  toModelEditFormValues,
  type ModelEditFieldName,
  type ModelEditFormValues,
  type ModelEditSubmitValues,
  type TouchedPricingField,
} from "./modelInfoEditFields";

interface ModelInfoEditFormProps {
  localModelData: any;
  modelData: { model_info: { team_id?: string | null } };
  teamAlias: string | null;
  accessToken: string | null;
  isEditing: boolean;
  isSaving: boolean;
  isWildcardModel: boolean;
  ptuCostAttributionEnabled: boolean;
  showCacheControl: boolean;
  setShowCacheControl: (checked: boolean) => void;
  onCancel: () => void;
  onSubmit: (values: ModelEditSubmitValues, isFieldTouched: (field: TouchedPricingField) => boolean) => Promise<void>;
  modelAccessGroups: string[] | null;
  guardrailsList: string[];
  tagsList: Record<string, Tag>;
  credentialsList: CredentialItem[];
  healthCheckModelOptions: { value: string; label: string }[];
  teams: Team[] | null;
}

const Display: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-1 rounded-sm bg-muted p-2">{children}</div>
);

const FIELD_LABEL_CLASS = "text-sm font-medium text-foreground";

const FieldLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) =>
  htmlFor === undefined ? (
    <p className={FIELD_LABEL_CLASS}>{children}</p>
  ) : (
    <label htmlFor={htmlFor} className={FIELD_LABEL_CLASS}>
      {children}
    </label>
  );

const Hint: React.FC<{ text: string }> = ({ text }) => (
  <Tooltip>
    <TooltipTrigger
      render={<CircleHelp className="ml-1 inline size-3.5 shrink-0 cursor-help text-muted-foreground" />}
    />
    <TooltipContent className="max-w-xs">{text}</TooltipContent>
  </Tooltip>
);

const DocsHint: React.FC<{ text: string; href: string }> = ({ text, href }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()}>
    <Hint text={text} />
  </a>
);

const ChipList: React.FC<{ values: unknown; emptyLabel: string }> = ({ values, emptyLabel }) => {
  const t = useTranslations("common");
  if (!values) {
    return <>{t("notSet")}</>;
  }
  if (!Array.isArray(values)) {
    return <>{String(values)}</>;
  }
  if (values.length === 0) {
    return <>{emptyLabel}</>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((entry: string, index: number) => (
        <Badge key={index} variant="secondary">
          {entry}
        </Badge>
      ))}
    </div>
  );
};

const ModelInfoEditForm: React.FC<ModelInfoEditFormProps> = ({
  localModelData,
  modelData,
  teamAlias,
  accessToken,
  isEditing,
  isSaving,
  isWildcardModel,
  ptuCostAttributionEnabled,
  showCacheControl,
  setShowCacheControl,
  onCancel,
  onSubmit,
  modelAccessGroups,
  guardrailsList,
  tagsList,
  credentialsList,
  healthCheckModelOptions,
  teams,
}) => {
  const t = useTranslations("common");
  const commonT = useTranslations("common");
  const addModelT = useTranslations("models.addModel");
  // Neither RHF's blur-based touchedFields nor its resettable dirtyFields matches antd's touched-on-change.
  const touchedRef = React.useRef<ReadonlySet<string>>(new Set<string>());
  const isFieldTouched = React.useCallback((field: TouchedPricingField) => touchedRef.current.has(field), []);
  const markTouched = (field: string) => {
    touchedRef.current = new Set([...touchedRef.current, field]);
  };

  // react-hook-form refreshes control._options every render, so this rebuild is what the next submit runs.
  const resolver: Resolver<ModelEditFormValues, unknown, ModelEditSubmitValues> = (values, context, options) =>
    zodResolver(buildSchema(addModelT, ptuCostAttributionEnabled, isFieldTouched))(values, context, options);

  const form = useForm<ModelEditFormValues, unknown, ModelEditSubmitValues>({
    resolver,
    defaultValues: toModelEditFormValues(localModelData, isWildcardModel),
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) =>
    form.handleSubmit(async (values) => {
      await onSubmit(values, isFieldTouched);
    })(event);

  const cancel = () => {
    form.reset(toModelEditFormValues(localModelData, isWildcardModel));
    touchedRef.current = new Set<string>();
    onCancel();
  };

  const textField = (name: ModelEditFieldName, label: string, placeholder: string, stored: unknown) => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {isEditing ? (
        <FormField control={form.control} name={name}>
          {({ value, ...control }) => <Input {...control} value={(value as string) ?? ""} placeholder={placeholder} />}
        </FormField>
      ) : (
        <Display>{(stored as string) || commonT("notSet")}</Display>
      )}
    </div>
  );

  const numberField = (name: ModelEditFieldName, label: string, placeholder: string, stored: unknown) => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {isEditing ? (
        <FormField control={form.control} name={name}>
          {({ value, ...control }) => <NumericalInput {...control} value={value ?? ""} placeholder={placeholder} />}
        </FormField>
      ) : (
        <Display>{(stored as string) || commonT("notSet")}</Display>
      )}
    </div>
  );

  const pricingField = (name: TouchedPricingField, label: string, placeholder: string, description?: string) =>
    isEditing ? (
      <FormField control={form.control} name={name} label={label} description={description}>
        {({ value, onChange, ...control }) => (
          <NumericalInput
            {...control}
            value={value ?? ""}
            placeholder={placeholder}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              markTouched(name);
              onChange(event);
            }}
          />
        )}
      </FormField>
    ) : (
      <div>
        <FieldLabel>{label}</FieldLabel>
        <Display>{displayCost(localModelData, name, commonT("notSet"))}</Display>
      </div>
    );

  const tagsField = (
    name: "model_access_group" | "guardrails" | "tags",
    options: { value: string; label: string }[],
    placeholder: string,
  ) => (
    <FormField control={form.control} name={name}>
      {({ id, value, onChange }) => (
        <TagsInput
          id={id}
          value={(value as string[]) ?? []}
          onValueChange={onChange}
          options={options}
          placeholder={placeholder}
          tokenSeparators={[","]}
        />
      )}
    </FormField>
  );

  return (
    <TooltipProvider>
      <form onSubmit={submit}>
        <div className="space-y-4">
          <div className="space-y-4">
            {textField(
              "model_name",
              addModelT("modelNameLabel"),
              addModelT("modelNamePlaceholder"),
              localModelData.model_name,
            )}
            {textField(
              "litellm_model_name",
              addModelT("litellmModelNameHeader"),
              addModelT("litellmModelNamePlaceholder"),
              localModelData.litellm_model_name,
            )}

            {pricingField(
              "input_cost",
              addModelT("inputCostPerToken"),
              addModelT("inputCostPlaceholder"),
            )}
            {pricingField(
              "output_cost",
              addModelT("outputCostPerToken"),
              addModelT("outputCostPlaceholder"),
            )}

            {ptuCostAttributionEnabled &&
              PTU_EDIT_FIELDS.map((ptuField) => (
                <div key={ptuField.name}>
                  <FieldLabel htmlFor={ptuField.name}>{t(ptuField.labelKey)}</FieldLabel>
                  {isEditing ? (
                    <FormField control={form.control} name={ptuField.name as ModelEditFieldName}>
                      {({ value, onChange, ...control }) =>
                        ptuField.input === "number" ? (
                          <NumericalInput
                            {...control}
                            id={ptuField.name}
                            onChange={onChange}
                            value={value ?? ""}
                            placeholder={ptuField.placeholderKey ? t(ptuField.placeholderKey) : undefined}
                            step={ptuField.isCount ? 1 : undefined}
                            min={ptuField.isCount ? 1 : 0}
                          />
                        ) : (
                          <UtcDateTimeInput
                            {...control}
                            id={ptuField.name}
                            value={value as Dayjs | null}
                            onChange={onChange}
                          />
                        )
                      }
                    </FormField>
                  ) : (
                    <Display>
                      {(ptuField.input === "datetime"
                        ? formatPtuUtcDisplay(localModelData?.model_info?.[ptuField.name])
                        : localModelData?.model_info?.[ptuField.name]) ?? commonT("notSet")}
                    </Display>
                  )}
                </div>
              ))}

            {pricingField(
              "cache_read_cost",
              addModelT("cacheReadCostPerToken"),
              addModelT("defaultsToInputCost"),
              t("cacheReadOnSaveHint"),
            )}
            {pricingField(
              "cache_write_cost",
              addModelT("cacheWriteCostPerToken"),
              addModelT("defaultsToInputCost"),
              t("cacheWriteOnSaveHint"),
            )}
            {pricingField(
              "cache_write_cost_1h",
              addModelT("cacheWriteCost1h"),
              addModelT("cacheWriteCost1hPlaceholder"),
              addModelT("cacheWriteCost1hHint"),
            )}

            {textField(
              "api_base",
              addModelT("apiBaseLabel"),
              addModelT("apiBasePlaceholder"),
              localModelData.litellm_params?.api_base,
            )}
            {textField(
              "custom_llm_provider",
              addModelT("customProviderLabel"),
              addModelT("customProviderPlaceholder"),
              localModelData.litellm_params?.custom_llm_provider,
            )}
            {textField(
              "organization",
              addModelT("organizationLabel"),
              addModelT("organizationPlaceholder"),
              localModelData.litellm_params?.organization,
            )}

            {numberField(
              "tpm",
              addModelT("tpmLabel"),
              addModelT("tpmPlaceholder"),
              localModelData.litellm_params?.tpm,
            )}
            {numberField(
              "rpm",
              addModelT("rpmLabel"),
              addModelT("rpmPlaceholder"),
              localModelData.litellm_params?.rpm,
            )}
            {numberField(
              "max_retries",
              addModelT("maxRetriesLabel"),
              addModelT("maxRetriesPlaceholder"),
              localModelData.litellm_params?.max_retries,
            )}
            {numberField(
              "timeout",
              addModelT("timeoutSecondsLabel"),
              addModelT("timeoutPlaceholder"),
              localModelData.litellm_params?.timeout,
            )}
            {numberField(
              "stream_timeout",
              addModelT("streamTimeoutLabel"),
              addModelT("streamTimeoutPlaceholder"),
              localModelData.litellm_params?.stream_timeout,
            )}

            <div>
              <FieldLabel>{addModelT("editModelAccessGroupsLabel")}</FieldLabel>
              {isEditing ? (
                tagsField(
                  "model_access_group",
                  (modelAccessGroups ?? []).map((group) => ({ value: group, label: group })),
                  addModelT("accessGroupsPlaceholder"),
                )
              ) : (
                <Display>
                  <ChipList
                    values={localModelData.model_info?.access_groups}
                    emptyLabel={addModelT("noGroupsAssigned")}
                  />
                </Display>
              )}
            </div>

            <div>
              <FieldLabel>
                {addModelT("guardrails")}
                <DocsHint
                  text={addModelT("guardrailsModelTooltip")}
                  href="https://docs.litellm.ai/docs/proxy/guardrails/quick_start"
                />
              </FieldLabel>
              {isEditing ? (
                tagsField(
                  "guardrails",
                  guardrailsList.map((name) => ({ value: name, label: name })),
                  t("guardrailsPlaceholder"),
                )
              ) : (
                <Display>
                  <ChipList values={localModelData.litellm_params?.guardrails} emptyLabel={t("noGuardrailsAssigned")} />
                </Display>
              )}
            </div>

            <div>
              <FieldLabel>
                {t("attachedKnowledgeBases")}
                <DocsHint
                  text={t("knowledgeBasesTooltip")}
                  href="https://docs.litellm.ai/docs/completion/knowledgebase"
                />
              </FieldLabel>
              {isEditing ? (
                <FormField control={form.control} name="vector_store_ids">
                  {({ value, onChange }) => (
                    <VectorStoreSelector
                      value={value as string[] | undefined}
                      onChange={onChange}
                      accessToken={accessToken || ""}
                      placeholder={t("selectKnowledgeBasesPlaceholder")}
                    />
                  )}
                </FormField>
              ) : (
                <Display>
                  <ChipList
                    values={localModelData.litellm_params?.vector_store_ids}
                    emptyLabel={addModelT("noKnowledgeBasesAttached")}
                  />
                </Display>
              )}
            </div>

            <div>
              <FieldLabel>{addModelT("tags")}</FieldLabel>
              {isEditing ? (
                tagsField(
                  "tags",
                  Object.values(tagsList).map((tag: Tag) => ({ value: tag.name, label: tag.name })),
                  addModelT("tagsPlaceholder"),
                )
              ) : (
                <Display>
                  <ChipList values={localModelData.litellm_params?.tags} emptyLabel={addModelT("noTagsAssigned")} />
                </Display>
              )}
            </div>

            <div>
              <FieldLabel>{addModelT("existingCredentials")}</FieldLabel>
              {isEditing ? (
                <FormField control={form.control} name="litellm_credential_name">
                  {({ id, value, onChange }) => (
                    <>
                      <SearchSelect
                        inputId={id}
                        placeholder={addModelT("selectCredentials")}
                        options={credentialOptions(credentialsList)}
                        value={(value as string | null) ?? ""}
                        allowClear={false}
                        onValueChange={(selected) => {
                          if (selected !== null) onChange(selected === "" ? null : selected);
                        }}
                      />
                      <CredentialNameHint
                        credentialName={value as string | null | undefined}
                        credentials={credentialsList}
                      />
                    </>
                  )}
                </FormField>
              ) : (
                <Display>
                  <AttachedCredential
                    credentialName={localModelData.litellm_params?.litellm_credential_name}
                    credentials={credentialsList}
                  />
                </Display>
              )}
            </div>

            {isWildcardModel && (
              <div>
                <FieldLabel>{addModelT("healthCheckModelLabel")}</FieldLabel>
                {isEditing ? (
                  <FormField control={form.control} name="health_check_model">
                    {({ id, value, onChange, onBlur }) => (
                      <Select
                        items={healthCheckModelOptions}
                        value={(value as string | null) ?? null}
                        onValueChange={onChange}
                      >
                        <SelectTrigger id={id} className="w-full" onBlur={onBlur}>
                          <SelectValue placeholder={t("healthCheckModelPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>{t("none")}</SelectItem>
                          {healthCheckModelOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>
                ) : (
                  <Display>{localModelData.model_info?.health_check_model || commonT("notSet")}</Display>
                )}
              </div>
            )}

            {isEditing ? (
              <>
                <FormField
                  control={form.control}
                  name="cache_control"
                  label={
                    <>
                      {t("cacheControlLabel")}
                      <Hint text={t("cacheControlTooltipDesc")} />
                    </>
                  }
                  orientation="horizontal"
                >
                  {({ id, value, onChange, onBlur }) => (
                    <Switch
                      id={id}
                      onBlur={onBlur}
                      checked={Boolean(value)}
                      onCheckedChange={(checked: boolean) => {
                        onChange(checked);
                        setShowCacheControl(checked);
                      }}
                    />
                  )}
                </FormField>
                {showCacheControl && (
                  <FormField control={form.control} name="cache_control_injection_points">
                    {({ value, onChange }) => (
                      <CacheControlInjectionPoints
                        value={(value as CacheControlInjectionPoint[]) ?? []}
                        onChange={onChange}
                      />
                    )}
                  </FormField>
                )}
              </>
            ) : (
              <div>
                <FieldLabel>{addModelT("cacheControl")}</FieldLabel>
                <Display>
                  {localModelData.litellm_params?.cache_control_injection_points ? (
                    <div>
                      <p>{t("enabled")}</p>
                      <div className="mt-2">
                        {localModelData.litellm_params.cache_control_injection_points.map((point: any, i: number) => (
                          <div key={i} className="mb-1 text-sm text-muted-foreground">
                            {addModelT("cachePointLocation")} {point.location},
                            {point.role && <span> {addModelT("cachePointRole")} {point.role}</span>}
                            {point.index !== undefined && (
                              <span> {addModelT("cachePointIndex")} {point.index}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    t("disabled")
                  )}
                </Display>
              </div>
            )}

            <div>
              <FieldLabel>{addModelT("modelInfoLabel")}</FieldLabel>
              {isEditing ? (
                <FormField control={form.control} name="model_info">
                  {({ value, ...control }) => (
                    <Textarea
                      {...control}
                      rows={4}
                      placeholder={'{"gpt-4": 100, "claude-v1": 200}'}
                      defaultValue={JSON.stringify(modelData.model_info, null, 2)}
                    />
                  )}
                </FormField>
              ) : (
                <Display>
                  <pre className="mt-1 overflow-auto rounded-sm bg-muted p-2 text-xs">
                    {JSON.stringify(localModelData.model_info, null, 2)}
                  </pre>
                </Display>
              )}
            </div>

            <div>
              <FieldLabel>
                {addModelT("litellmParams")}
                <DocsHint
                  text={addModelT("litellmParamsTooltip")}
                  href="https://docs.litellm.ai/docs/completion/input"
                />
              </FieldLabel>
              {isEditing ? (
                <FormField control={form.control} name="litellm_extra_params">
                  {({ value, ...control }) => (
                    <Textarea
                      {...control}
                      value={(value as string) ?? ""}
                      rows={4}
                      placeholder={'{\n  "rpm": 100,\n  "timeout": 0,\n  "stream_timeout": 0\n}'}
                    />
                  )}
                </FormField>
              ) : (
                <Display>
                  <pre className="mt-1 overflow-auto rounded-sm bg-muted p-2 text-xs">
                    {JSON.stringify(localModelData.litellm_params, null, 2)}
                  </pre>
                </Display>
              )}
            </div>

            <div>
              <FieldLabel>{t("teamLabel")}</FieldLabel>
              {isEditing ? (
                <FormField control={form.control} name="team_id">
                  {({ id, value, onChange, onBlur }) => (
                    <ModelTeamSelect id={id} value={value} onChange={onChange} onBlur={onBlur} teams={teams} />
                  )}
                </FormField>
              ) : (
                <Display>
                  {teamAlias
                    ? `${teamAlias} (${localModelData.model_info?.team_id})`
                    : localModelData.model_info?.team_id || t("notSet")}
                </Display>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-2">
              <Button type="submit" variant="secondary" onClick={cancel} disabled={isSaving}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSaving} aria-busy={isSaving}>
                {isSaving && <UiLoadingSpinner className="size-4" />}
                {t("saveChanges")}
              </Button>
            </div>
          )}
        </div>
      </form>
    </TooltipProvider>
  );
};

export default ModelInfoEditForm;
