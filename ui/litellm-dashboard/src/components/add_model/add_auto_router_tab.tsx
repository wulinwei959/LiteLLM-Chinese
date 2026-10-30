import { AutoRouterAvailabilityContext, useAutoRouterAvailability } from "./AutoRouterAvailability";
import { decisionDeploymentName } from "./jev_classifier_config";
import DecisionModelSelect from "./DecisionModelSelect";
import ClassifierPrimarySettings from "./ClassifierPrimarySettings";
import AutoRouterClassifierTabs from "./AutoRouterClassifierTabs";
import AutoRouterPresetSelect, { type PresetAvailability } from "./AutoRouterPresetSelect";
import { getForecastConfigError, isForecastClassifier } from "../add_model/forecast_classifier_config";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { useWatch } from "react-hook-form";
import { z } from "zod";
import { FieldGroup } from "@/components/ui/field";
import { FormField } from "@/components/shared/form/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UiLoadingSpinner } from "@/components/ui/ui-loading-spinner";
import { useZodForm } from "@/lib/forms/useZodForm";
import AccessGroupTagsCombobox from "./AccessGroupTagsCombobox";
import { modelAvailableCall, validateAutoRouterConfig, type Team } from "../networking";
import { labelWithHint } from "@/components/shared/form/LabelWithHint";
import { all_admin_roles } from "@/utils/roles";
import { canCreateAutoRouterForTeam, canModifyModel, type ModelWriteScope } from "@/utils/modelPermissions";
import TeamDropdown from "../common_components/team_dropdown";
import { type AddAutoRouterValues, handleAddAutoRouterSubmit } from "./handle_add_auto_router_submit";
import { fetchAutoRouterModels, fetchAvailableModels, type ModelGroup } from "@/components/llm_calls/fetch_models";
import { autoRouterListKey, fetchAllModelDeployments } from "@/app/(dashboard)/hooks/models/useModels";
import ComplexityRouterConfig, {
  ComplexityRouterConfigValue,
  effectiveClassifierType,
  usesLlmClassifier,
  heuristicScoringRole,
} from "./ComplexityRouterConfig";
import { KeywordTierRule } from "./KeywordTierRules";
import { customDimensionsError } from "./custom_dimensions";
import { DEFAULT_ESCALATION_KEYWORDS } from "./EscalationKeywords";
import {
  type AutoRouterCompressionState,
  buildAutoRouterCompressionParams,
  DEFAULT_AUTO_ROUTER_COMPRESSION,
} from "./buildAutoRouterCompression";
import { DEFAULT_MATCH_THRESHOLD } from "./SemanticKeywordMatching";
import {
  BuildComplexityRouterConfigParams,
  buildComplexityRouterConfig,
  getKeywordTierRulesError,
  getClassifierModelError,
  getHeuristicV2SuccessThresholdError,
  getReminderMarkersError,
  getClassifierPluginTimeoutError,
  getClassifierReasoningEffortError,
  getMissingTiersError,
  getPlanModeTierError,
  getSemanticConfigError,
  getTierLabelsError,
  dryRunRejection,
} from "./build_complexity_router_config";
import { builderParamsFromValue } from "./complexity_router_builder_params";
import { activeTierName, activeTierRows, getCustomTierRowsError, resolveComplexityDefaultModel } from "./tier_rows";
import { buildAutoRouterTestTargets, AutoRouterTestTarget } from "./build_auto_router_test_targets";
import { AutoRouterConnectionTestDialog } from "./auto_router_connection_test";
import {
  buildAutoRouterRoutingTestRequest,
  JEV_CONNECTION_TEST_PROMPT,
} from "./build_auto_router_routing_test_request";
import AutoRouterRoutingTest from "./AutoRouterRoutingTest";
import { toast } from "@/lib/toast";
import {
  getMissingModelsInPreset,
  getReferencedModelsError,
  buildEmptyPrefill,
  buildPresetPrefill,
  buildModelAvailability,
  deploymentRefsFromModelInfo,
  ModelAvailability,
  PresetPrefill,
  AutoRouterPreset,
} from "@/lib/autorouter_presets";
import { useAutoRouterPresets } from "@/app/(dashboard)/hooks/autoRouter/useAutoRouterPresets";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AutoRouterSimpleSetup from "./AutoRouterSimpleSetup";
import {
  deployedRouterModels,
  nextRouterName,
  recommendSolverPair,
  solverPairConfig,
  type RouterGoal,
  type FamilyPreference,
} from "./auto_setup";

interface AddAutoRouterTabProps {
  handleOk: () => void;
  accessToken: string;
  userRole: string;
  userId?: string | null;
  /**
   * How this caller must scope what they create. A team admin has to name a team, because
   * POST /model/new rejects an unscoped create from any non-proxy-admin; without the selector
   * their submit is a guaranteed 403.
   */
  createScope?: ModelWriteScope;
  teams?: Team[] | null;
}

type AddModelTranslator = ReturnType<typeof useTranslations<"models.addModel">>;

const NO_PRESETS: AutoRouterPreset[] = [];

// Why the submit is unavailable, or null when it is available. The button reads this to disable
// itself and to say what is missing, so the two can never give different answers. Checks the
// config actually being built, not which preset (if any) it came from: a preset only ever
// prefills once (handlePresetChange), and everything after that is edited exactly like Custom.
export interface SubmitBlockedInputs {
  config: ComplexityRouterConfigValue;
  keywordTierRules: KeywordTierRule[];
  referencedModelsParams: Parameters<typeof getReferencedModelsError>[0];
  availability: ModelAvailability;
  modelInfo?: readonly ModelGroup[];
}

export const getSubmitBlockedReason = (t: AddModelTranslator, inputs: SubmitBlockedInputs): string | null => {
  const { config, keywordTierRules, referencedModelsParams, availability, modelInfo = [] } = inputs;
  return (
    (config.custom_tier_set
      ? getCustomTierRowsError(t, config.custom_tier_set)
      : getTierLabelsError(t, config.tier_labels)) ??
    (isForecastClassifier(config.classifier_type)
      ? getForecastConfigError(t, config)
      : getMissingTiersError(t, activeTierRows(config))) ??
    getPlanModeTierError(t, config.plan_mode_min_tier, activeTierRows(config)) ??
    getKeywordTierRulesError(t, keywordTierRules, activeTierRows(config)) ??
    (effectiveClassifierType(config) === "jev" && !config.jev_classifier_config?.deployment_name
      ? t("selectDecisionModelRequired")
      : null) ??
    getClassifierModelError(t, config) ??
    getHeuristicV2SuccessThresholdError(t, config.heuristic_v2_success_threshold) ??
    getReminderMarkersError(t, config.reminder_markers) ??
    getClassifierPluginTimeoutError(t, config.classifier_type, config.classifier_plugin_timeout_ms) ??
    (heuristicScoringRole(config) === "decides" ? customDimensionsError(t, config.custom_dimensions) : null) ??
    getClassifierReasoningEffortError(t, config, modelInfo) ??
    getReferencedModelsError(referencedModelsParams, availability)
  );
};

const autoRouterSchema = (requiresTeamScope: boolean, t: AddModelTranslator) =>
  z.object({
    auto_router_name: z.string().min(1, t("autoRouterNameRequired")),
    team_id: z
      .string()
      .nullable()
      .refine((teamId) => !requiresTeamScope || Boolean(teamId), t("teamSelectionRequiredToContinue")),
    model_access_group: z.array(z.string()).optional(),
  });

type AddAutoRouterFormValues = z.infer<ReturnType<typeof autoRouterSchema>>;

const EMPTY_FORM_VALUES: AddAutoRouterFormValues = {
  auto_router_name: "",
  team_id: null,
  model_access_group: undefined,
};

const teamScopePayload = (requiresTeamScope: boolean, teamId: string | null): { team_id?: string } =>
  requiresTeamScope && teamId ? { team_id: teamId } : {};

const BlockedReasonTooltip: React.FC<{ reason: string | null; children: React.ReactElement }> = ({
  reason,
  children,
}) =>
  reason === null ? (
    children
  ) : (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent>{reason}</TooltipContent>
    </Tooltip>
  );

const AddAutoRouterTab: React.FC<AddAutoRouterTabProps> = ({
  handleOk,
  accessToken,
  userRole,
  userId,
  createScope = "unscoped-ok",
  teams = null,
}) => {
  const t = useTranslations("models.addModel");
  const requiresTeamScope = createScope === "team-required";
  const form = useZodForm(autoRouterSchema(requiresTeamScope, t), { defaultValues: EMPTY_FORM_VALUES });
  const watchedName = useWatch({ control: form.control, name: "auto_router_name" });
  const watchedTeamId = useWatch({ control: form.control, name: "team_id" });
  const actor = { userRole, userID: userId ?? null, isViewOnly: false };
  const isMemberManaged =
    requiresTeamScope &&
    !canModifyModel(actor, teams, {
      teamId: watchedTeamId,
      isDbModel: true,
    });
  const [modelAccessGroups, setModelAccessGroups] = useState<string[]>([]);

  const [advanced, setAdvanced] = useState(false);
  const [goal, setGoal] = useState<RouterGoal>("balanced");
  const [family, setFamily] = useState<FamilyPreference>("auto");
  const [solverOverrides, setSolverOverrides] = useState<{ everyday?: string; hard?: string }>({});
  const [advancedConfig, setComplexityRouterConfig] = useState<ComplexityRouterConfigValue>({
    tiers: { SIMPLE: [], MEDIUM: [], COMPLEX: [], REASONING: [] },
    classifier_type: "heuristic",
  });

  const [customTechnicalKeywords, setCustomTechnicalKeywords] = useState<string[]>([]);
  const [keywordTierRules, setKeywordTierRules] = useState<KeywordTierRule[]>([]);
  const [semanticMatchingEnabled, setSemanticMatchingEnabled] = useState<boolean>(false);
  const [embeddingModel, setEmbeddingModel] = useState<string | undefined>(undefined);
  const [matchThreshold, setMatchThreshold] = useState<number>(DEFAULT_MATCH_THRESHOLD);
  const [escalationKeywords, setEscalationKeywords] = useState<string[]>(DEFAULT_ESCALATION_KEYWORDS);
  const [autoRouterCompression, setAutoRouterCompression] = useState<AutoRouterCompressionState>(
    DEFAULT_AUTO_ROUTER_COMPRESSION,
  );
  const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
  const [editingTiers, setEditingTiers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(undefined);

  const [isRoutingTestVisible, setIsRoutingTestVisible] = useState<boolean>(false);
  const [isTestModalVisible, setIsTestModalVisible] = useState<boolean>(false);
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionTestId, setConnectionTestId] = useState<number>(0);
  const [testTargets, setTestTargets] = useState<AutoRouterTestTarget[]>([]);

  useEffect(() => {
    const fetchModelAccessGroups = async () => {
      const response = await modelAvailableCall(accessToken, "", "", false, null, true, true);
      setModelAccessGroups(response["data"].map((model: any) => model["id"]));
    };
    fetchModelAccessGroups();
  }, [accessToken]);

  const {
    data,
    isLoading: groupsLoading,
    isError: modelsError,
    refetch: refetchModels,
  } = useQuery({
    queryKey: ["availableModels", "autoRouter", accessToken, ...(isMemberManaged ? [watchedTeamId] : [])],
    queryFn: () =>
      isMemberManaged ? fetchAutoRouterModels(accessToken, watchedTeamId) : fetchAvailableModels(accessToken),
    enabled: Boolean(accessToken && (!isMemberManaged || watchedTeamId)),
  });
  const { data: deployments, isLoading: deploymentsLoading, isError: deploymentsError, refetch: refetchDeployments } = useQuery({
    queryKey: autoRouterListKey(userId ?? "", userRole),
    queryFn: () => fetchAllModelDeployments(accessToken, userId ?? "", userRole),
    enabled: Boolean(accessToken),
  });
  const modelsLoading = groupsLoading || deploymentsLoading;
  useEffect(() => {
    if (!deployments || form.getFieldState("auto_router_name").isDirty) return;
    form.setValue(
      "auto_router_name",
      nextRouterName(deployments.flatMap((row) => (row.model_name ? [row.model_name] : []))),
    );
  }, [deployments, form]);
  const modelInfo = React.useMemo(() => data ?? [], [data]);
  const {
    data: presetsData,
    isPending: presetsPending,
    isError: presetsError,
    refetch: refetchPresets,
  } = useAutoRouterPresets();
  const presets = presetsData ?? NO_PRESETS;
  const presetsUnavailable = presetsError && presetsData === undefined;
  // react-query keeps the last successful list around when a later refetch fails, so isError alone
  // can't tell "never loaded" apart from "loaded, then a background refetch errored" - only the
  // former leaves us with nothing trustworthy to verify a preset's models against.
  const modelsUnverifiable = modelsError && data === undefined;

  const isAdmin = all_admin_roles.includes(userRole);

  const availability = React.useMemo(
    () =>
      buildModelAvailability(
        modelInfo.map((m) => m.model_group),
        deploymentRefsFromModelInfo(deployments ?? []),
      ),
    [modelInfo, deployments],
  );
  const groupsOnlyAvailability = React.useMemo(
    () =>
      buildModelAvailability(
        modelInfo.map((m) => m.model_group),
        [],
      ),
    [modelInfo],
  );
  const solverModels = React.useMemo(() => deployedRouterModels(modelInfo, deployments ?? []), [modelInfo, deployments]);
  const recommended = React.useMemo(() => recommendSolverPair(solverModels, goal, family), [solverModels, goal, family]);
  const everyday = solverOverrides.everyday
    ? solverModels.find((model) => model.name === solverOverrides.everyday)
    : recommended?.everyday;
  const hard = solverOverrides.hard
    ? solverModels.find((model) => model.name === solverOverrides.hard)
    : recommended?.hard;
  const simpleConfig = everyday && hard ? solverPairConfig(everyday.name, hard.name) : null;
  const complexityRouterConfig = advanced
    ? advancedConfig
    : simpleConfig ?? {
        classifier_type: "heuristic" as const,
        classification_mode: "user_turn" as const,
        tiers: { SIMPLE: [], MEDIUM: [], COMPLEX: [], REASONING: [] },
      };
  const openAdvanced = () => {
    setComplexityRouterConfig(complexityRouterConfig);
    setPrefillAttempted(simpleConfig !== null);
    setAdvanced(true);
  };

  // A preset's models can only be trusted against a successfully loaded list. Selection and the
  // greyed-out state derive from this one function, so a preset that cannot be selected can never
  // have been applied: while loading we withhold selection rather than let a caller pick a preset
  // whose models we cannot yet verify, and a failed fetch leaves every preset unverifiable. This
  // makes the load-race (pick during loading, then discover a missing model) unrepresentable.
  const presetAvailability = React.useCallback(
    (preset: AutoRouterPreset): PresetAvailability => {
      if (modelsLoading) return { kind: "loading" };
      if (modelsUnverifiable) return { kind: "unverifiable" };
      const missing = getMissingModelsInPreset(preset, availability);
      if (missing.length > 0) return { kind: "missing_models", models: missing };
      return {
        kind: "available",
        viaDeployments: getMissingModelsInPreset(preset, groupsOnlyAvailability).length > 0,
      };
    },
    [modelsLoading, modelsUnverifiable, availability, groupsOnlyAvailability],
  );

  const applyPrefill = (prefill: PresetPrefill) => {
    setEditingTiers(false);
    setComplexityRouterConfig(prefill.complexityRouterConfig);
    setCustomTechnicalKeywords(prefill.customTechnicalKeywords);
    setKeywordTierRules(prefill.keywordTierRules);
    setSemanticMatchingEnabled(prefill.semanticMatchingEnabled);
    setEmbeddingModel(prefill.embeddingModel);
    setMatchThreshold(prefill.matchThreshold);
    setEscalationKeywords(prefill.escalationKeywords);
  };

  const [prefillAttempted, setPrefillAttempted] = useState(false);
  if (advanced && !prefillAttempted && !modelsLoading && simpleConfig) {
    setPrefillAttempted(true);
    setComplexityRouterConfig((current) =>
      !current.custom_tier_set &&
      !isForecastClassifier(current.classifier_type) &&
      activeTierRows(current).every((row) => row.models.length === 0)
        ? { ...current, tiers: simpleConfig.tiers }
        : current,
    );
  }

  const handlePresetChange = (presetKey: string | undefined) => {
    if (!presetKey || presetKey === "custom") {
      setPrefillAttempted(true);
      setSelectedPreset(presetKey);
      applyPrefill(buildEmptyPrefill());

      return;
    }

    const preset = presets.find((p) => p.key === presetKey);
    // Refuse to apply a preset whose models are not verified available. The dropdown disables
    // these options, so this is a guard against a stale click resolving after the list changed.
    if (!preset) return;
    const presetState = presetAvailability(preset);
    if (presetState.kind !== "available") return;

    setPrefillAttempted(true);
    setSelectedPreset(presetKey);
    applyPrefill(buildPresetPrefill(preset.complexity_router_config, availability));
  };

  const referencedModelsParams = {
    tiers: Object.fromEntries(activeTierRows(complexityRouterConfig).map((row) => [activeTierName(row), row.models])),
    classifierType: effectiveClassifierType(complexityRouterConfig),
    classifierLlmConfig: complexityRouterConfig.classifier_llm_config,
    decisionDeploymentName: decisionDeploymentName(complexityRouterConfig.jev_classifier_config),
    semanticMatchingEnabled,
    embeddingModel,
    defaultModel: complexityRouterConfig.default_model,
  };

  const submitBlockedInputs: SubmitBlockedInputs = {
    config: complexityRouterConfig,
    keywordTierRules,
    referencedModelsParams,
    availability: groupsOnlyAvailability,
    modelInfo,
  };
  const submitBlockedReason = getSubmitBlockedReason(t, submitBlockedInputs);

  const complexityRouterConfigParams: BuildComplexityRouterConfigParams = {
    ...builderParamsFromValue(complexityRouterConfig),
    customTechnicalKeywords,
    keywordTierRules,
    semanticMatchingEnabled,
    embeddingModel,
    matchThreshold,
    escalationKeywords,
  };
  const routerAvailability = useAutoRouterAvailability(
    accessToken,
    {
      team_id: requiresTeamScope ? watchedTeamId : undefined,
      complexity_router_config:
        submitBlockedReason === null ? { ...buildComplexityRouterConfig(complexityRouterConfigParams) } : null,
    },
    !requiresTeamScope || Boolean(watchedTeamId),
  );
  const saveBlockedReason = submitBlockedReason ?? routerAvailability.saveBlockedReason;
  const handleClassifierChange = (config: ComplexityRouterConfigValue) => {
    setSelectedPreset(undefined);
    setComplexityRouterConfig(config);
  };
  const jevRequestParams =
    effectiveClassifierType(complexityRouterConfig) === "jev"
      ? {
          prompt: JEV_CONNECTION_TEST_PROMPT,
          config: buildComplexityRouterConfig(complexityRouterConfigParams),
          defaultModel: resolveComplexityDefaultModel(complexityRouterConfig, complexityRouterConfig.default_model),
          routerName: watchedName,
          teamId: requiresTeamScope ? watchedTeamId ?? undefined : undefined,
        }
      : undefined;
  const jevRequest = jevRequestParams ? buildAutoRouterRoutingTestRequest(jevRequestParams) : undefined;

  const submitRecommendedRouter = async (name: string) => {
    // The one answer the submit button reads, so a disabled button and a refused submit cannot
    // disagree about why. The handler needs it in its own right: the form fires this on Enter
    // regardless of the button's disabled state.
    const blockedReason =
      saveBlockedReason ??
      getSubmitBlockedReason(t, submitBlockedInputs) ??
      getSemanticConfigError(t, { semanticMatchingEnabled, embeddingModel, keywordTierRules });
    if (blockedReason) {
      setShowValidationErrors(true);
      toast.fromError(blockedReason);
      return;
    }

    const defaultModel = resolveComplexityDefaultModel(complexityRouterConfig, complexityRouterConfig.default_model);
    const validatedFields = requiresTeamScope
      ? (["auto_router_name", "team_id"] as const)
      : (["auto_router_name"] as const);

    if (!(await form.trigger(validatedFields))) {
      toast.fromError(t("requiredFieldsMissing"));
      return;
    }

    // auto_router_default_model (-> litellm_params, read by the backend at init) and
    // complexity_router_config.default_model (-> the pin marker read back on edit, see
    // hydratePinnedDefaultModel in edit_auto_router_modal.tsx) must both come from the same
    // `defaultModel`, or the two fields diverge and hydration's divergence check misfires.
    const complexityRouterConfigPayload = buildComplexityRouterConfig(complexityRouterConfigParams);
    const serverVerdict = await validateAutoRouterConfig(
      accessToken,
      complexityRouterConfigPayload as unknown as Record<string, unknown>,
      requiresTeamScope ? form.getValues("team_id") ?? undefined : undefined,
    );
    const dryRunError = dryRunRejection(t, serverVerdict);
    if (dryRunError) {
      setShowValidationErrors(true);
      toast.fromError(dryRunError);
      return;
    }

    const submitValues: AddAutoRouterValues = {
      auto_router_name: name,
      ...teamScopePayload(requiresTeamScope, form.getValues("team_id")),
      auto_router_default_model: defaultModel,
      model_type: "complexity_router",
      complexity_router_config: complexityRouterConfigPayload,
      ...(isMemberManaged
        ? {}
        : {
            model_access_group: form.getValues("model_access_group"),
            ...buildAutoRouterCompressionParams(autoRouterCompression),
          }),
    };

    await handleAddAutoRouterSubmit(submitValues, accessToken, {
      resetForm: () => form.reset(EMPTY_FORM_VALUES),
      onSuccess: handleOk,
    }, t);
  };

  const handleAutoRouterSubmit = async () => {
    if (isSubmitting) return;
    const name = form.getValues("auto_router_name");
    if (!name) {
      setShowValidationErrors(true);
      void form.trigger("auto_router_name");
      toast.fromError(t("autoRouterNameRequiredToast"));
      return;
    }

    setIsSubmitting(true);
    try {
      await submitRecommendedRouter(name);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestConnection = () => {
    const testTargetParams = {
      tiers: activeTierRows(complexityRouterConfig).map(
        (row) => [activeTierName(row), row.models] as [string, string[]],
      ),
      semanticMatchingEnabled,
      embeddingModel,
      defaultModel: resolveComplexityDefaultModel(complexityRouterConfig, complexityRouterConfig.default_model),
      classifier: usesLlmClassifier(effectiveClassifierType(complexityRouterConfig))
        ? {
            model: complexityRouterConfig.classifier_llm_config?.model ?? "",
            reasoningEffort: complexityRouterConfig.classifier_llm_config?.reasoning_effort,
          }
        : undefined,
    };
    const targets = buildAutoRouterTestTargets(testTargetParams);

    if (targets.length === 0) {
      toast.fromError(t("tierModelRequired"));
      return;
    }

    setTestTargets(targets);
    setConnectionTestId((id) => id + 1);
    setIsTestingConnection(true);
    setIsTestModalVisible(true);
  };

  const tierSetup = (
    <AutoRouterPresetSelect
      selectedPreset={selectedPreset}
      presets={presets}
      presetAvailability={presetAvailability}
      onPresetChange={handlePresetChange}
      pending={presetsPending}
      unavailable={presetsUnavailable}
      onRetry={() => void refetchPresets()}
    />
  );

  const configurationForm = (
    <ComplexityRouterConfig
      creationFlow
      tierSetup={tierSetup}
      editingTiers={editingTiers}
      onEditingTiersChange={setEditingTiers}
      modelInfo={modelInfo}
      value={complexityRouterConfig}
      onChange={setComplexityRouterConfig}
      customTechnicalKeywords={customTechnicalKeywords}
      onCustomTechnicalKeywordsChange={setCustomTechnicalKeywords}
      keywordTierRules={keywordTierRules}
      onKeywordTierRulesChange={setKeywordTierRules}
      keywordRulesError={getKeywordTierRulesError(t, keywordTierRules, activeTierRows(complexityRouterConfig))}
      semanticMatchingEnabled={semanticMatchingEnabled}
      onSemanticMatchingEnabledChange={setSemanticMatchingEnabled}
      embeddingModel={embeddingModel}
      onEmbeddingModelChange={setEmbeddingModel}
      matchThreshold={matchThreshold}
      onMatchThresholdChange={setMatchThreshold}
      escalationKeywords={escalationKeywords}
      onEscalationKeywordsChange={setEscalationKeywords}
      autoRouterCompression={autoRouterCompression}
      onAutoRouterCompressionChange={isMemberManaged ? undefined : setAutoRouterCompression}
      showValidationErrors={showValidationErrors}
    />
  );

  return (
    <AutoRouterAvailabilityContext.Provider value={routerAvailability}>
      <TooltipProvider>
        <Card>
          <CardContent>
            <form onSubmit={form.handleSubmit(() => handleAutoRouterSubmit())} noValidate>
              <div className="mb-4">
                <FormField
                  control={form.control}
                  name="auto_router_name"
                  label={labelWithHint(t("autoRouterNameLabel"), t("autoRouterNameHint"))}
                >
                  {({ ref, ...field }) => (
                    <Input {...field} ref={ref} placeholder={t("autoRouterNamePlaceholder")} />
                  )}
                </FormField>
              </div>
              <div className={advanced ? "mb-6 border-b pb-6" : ""}>
                {isAdmin && advanced && (
                  <div>
                    <FormField
                      control={form.control}
                      name="model_access_group"
                      label={labelWithHint(t("modelAccessGroup"), t("autoRouterAccessGroupHint"))}
                    >
                      {({ id, value, onChange, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }) => (
                        <AccessGroupTagsCombobox
                          id={id}
                          value={value}
                          onChange={onChange}
                          options={modelAccessGroups}
                          ariaInvalid={ariaInvalid}
                          ariaDescribedBy={ariaDescribedBy}
                        />
                      )}
                    </FormField>
                  </div>
                )}
              </div>
              {requiresTeamScope && (
                <FormField
                  control={form.control}
                  name="team_id"
                  label={labelWithHint(t("selectTeam"), t("autoRouterTeamHint"))}
                >
                  {({ id, value, onChange }) => (
                    <TeamDropdown
                      id={id}
                      value={value}
                      onChange={onChange}
                      filterTeam={(team) => canCreateAutoRouterForTeam(actor, team)}
                    />
                  )}
                </FormField>
              )}

              {!advanced && (
                <AutoRouterSimpleSetup
                  customized={Boolean(solverOverrides.everyday || solverOverrides.hard)}
                  hasSuggestions={Boolean(recommended || recommendSolverPair(solverModels, goal, "auto"))}
                  onReset={() => setSolverOverrides({})}
                  goal={goal}
                  family={family}
                  models={solverModels}
                  everyday={everyday}
                  hard={hard}
                  waitingForTeam={requiresTeamScope && !watchedTeamId}
                  loading={modelsLoading}
                  error={modelsUnverifiable || (deploymentsError && deployments === undefined)}
                  notice={
                    Object.keys(solverOverrides).length > 0
                      ? "kept"
                      : recommended?.notice ?? null
                  }
                  onGoalChange={setGoal}
                  onFamilyChange={(next) => {
                    setFamily(next);
                    setSolverOverrides({});
                  }}
                  onModelChange={(role, model) =>
                    setSolverOverrides({ everyday: everyday?.name, hard: hard?.name, [role]: model })
                  }
                  onAdvanced={openAdvanced}
                  onRetry={() => {
                    void refetchModels();
                    void refetchDeployments();
                  }}
                />
              )}
              {advanced && (
              <AutoRouterClassifierTabs
                value={complexityRouterConfig}
                onChange={handleClassifierChange}
                decisionModel={
                  <DecisionModelSelect
                    value={complexityRouterConfig}
                    onChange={setComplexityRouterConfig}
                    modelInfo={modelInfo}
                    deployments={deployments}
                  />
                }
                judgeModel={
                  <ClassifierPrimarySettings
                    section="judge"
                    value={complexityRouterConfig}
                    onChange={setComplexityRouterConfig}
                    modelOptions={modelInfo
                      .filter((model) => model.mode !== "embedding")
                      .map((model) => ({ value: model.model_group, label: model.model_group }))}
                    showValidationErrors={showValidationErrors}
                  />
                }
              >
                <FieldGroup>
                  {modelsUnverifiable && (
                    <p className="text-sm text-destructive">
                      {t("autoRouterModelsLoadFailed")}{" "}
                      <button type="button" className="underline" onClick={() => void refetchModels()}>
                        {t("retryLabel")}
                      </button>
                    </p>
                  )}
                  {configurationForm}
                </FieldGroup>
              </AutoRouterClassifierTabs>
              )}
              {!advanced && routerAvailability.isError && (
                <p className="mt-3 text-sm text-destructive" role="alert">
                  {t("couldNotCheckAvailability")}{" "}
                  <Button type="button" variant="link" onClick={() => void routerAvailability.refetch()}>
                    {t("retryLabel")}
                  </Button>
                </p>
              )}
              {!advanced && routerAvailability.data?.error && (
                <p className="mt-3 text-sm text-destructive" role="alert">
                  {routerAvailability.data.error}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <a
                            href="https://github.com/BerriAI/litellm/issues"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                          >
                            {t("needHelp")}
                          </a>
                        }
                      />
                      <TooltipContent>{t("getHelpGithub")}</TooltipContent>
                    </Tooltip>
                    <div className="flex flex-wrap gap-2">
                      <BlockedReasonTooltip reason={submitBlockedReason}>
                        <Button
                          type="button"
                          variant="outline"
                          data-testid="auto-router-test-routing-btn"
                          disabled={submitBlockedReason !== null || isSubmitting}
                          onClick={() => setIsRoutingTestVisible(true)}
                        >
                          {t("testRouting")}
                        </Button>
                      </BlockedReasonTooltip>
                      <Button
                        type="button"
                        variant="outline"
                        data-testid="auto-router-test-connect-btn"
                        onClick={handleTestConnection}
                        disabled={isTestingConnection}
                      >
                        {isTestingConnection && <UiLoadingSpinner className="size-4" />}
                        {t("testConnection")}
                      </Button>
                      <BlockedReasonTooltip reason={saveBlockedReason}>
                        <Button
                          type="button"
                          disabled={saveBlockedReason !== null || isSubmitting}
                          onClick={() => {
                            void handleAutoRouterSubmit();
                          }}
                        >
                          {t("addAutoRouter")}
                        </Button>
                      </BlockedReasonTooltip>
                    </div>
                  </div>
            </form>
          </CardContent>
        </Card>

        <Dialog open={isRoutingTestVisible} onOpenChange={(open) => !open && setIsRoutingTestVisible(false)}>
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[760px]">
            <DialogHeader>
              <DialogTitle>{t("testRouting")}</DialogTitle>
            </DialogHeader>
            {isRoutingTestVisible && (
              <AutoRouterRoutingTest
                accessToken={accessToken}
                config={buildComplexityRouterConfig(complexityRouterConfigParams)}
                defaultModel={resolveComplexityDefaultModel(
                  complexityRouterConfig,
                  complexityRouterConfig.default_model,
                )}
                routerName={watchedName}
                teamId={requiresTeamScope ? watchedTeamId ?? undefined : undefined}
              />
            )}
            <DialogFooter>
              {" "}
              <Button variant="outline" onClick={() => setIsRoutingTestVisible(false)}>
                {t("closeLabel")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AutoRouterConnectionTestDialog
          open={isTestModalVisible}
          onClose={() => {
            setIsTestModalVisible(false);
            setIsTestingConnection(false);
          }}
          testId={connectionTestId}
          accessToken={accessToken}
          targets={testTargets}
          jevRequest={jevRequest}
          onTestComplete={() => setIsTestingConnection(false)}
        />
      </TooltipProvider>
    </AutoRouterAvailabilityContext.Provider>
  );
};

export default AddAutoRouterTab;
