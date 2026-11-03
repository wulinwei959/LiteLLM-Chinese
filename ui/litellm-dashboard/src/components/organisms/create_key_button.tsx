"use client";
import { keyKeys } from "@/app/(dashboard)/hooks/keys/useKeys";
import { useOrganizations } from "@/app/(dashboard)/hooks/organizations/useOrganizations";
import { useProjects } from "@/app/(dashboard)/hooks/projects/useProjects";
import { useTags } from "@/app/(dashboard)/hooks/tags/useTags";
import { useUISettings } from "@/app/(dashboard)/hooks/uiSettings/useUISettings";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useCan from "@/app/(dashboard)/hooks/useCan";
import { parseTeamAdminEditableFields } from "@/components/team/teamAdminEditAccess";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { MultiSelect, type MultiSelectOption } from "@/components/shared/MultiSelect";
import { PaginatedSearchSelect } from "@/components/shared/PaginatedSearchSelect";
import { SearchSelect, type SearchSelectOption } from "@/components/shared/SearchSelect";
import { ChevronDown, Info } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { rolesWithWriteAccess } from "../../utils/roles";
import {
  MountedFormField,
  MountedFormProvider,
  projectMountedValues,
  useMountRegistry,
  type MountedFormValues,
} from "../common_components/MountedFormField";
import {
  type RouterSettingsAccordionRef,
  type RouterSettingsAccordionValue,
} from "../common_components/RouterSettingsAccordion";
import TeamDropdown from "../common_components/team_dropdown";
import OrganizationDropdown from "../common_components/OrganizationDropdown";
import ProjectDropdown from "../common_components/ProjectDropdown";
import { CreateUserButton } from "../CreateUserButton";
import { type BudgetWindowEntry } from "../key_team_helpers/BudgetWindowsEditor";
import { type ModelMaxBudget } from "../key_team_helpers/ModelMaxBudgetEditor";
import { type TagRateLimitEntry } from "../key_team_helpers/TagRateLimitEditor";
import {
  excludeProxyWideSentinel,
  getModelDisplayName,
  hasAllModelsSentinel,
} from "../key_team_helpers/fetch_available_models_team_key";
import { Team } from "../key_team_helpers/key_list";
import { toast } from "@/lib/toast";
import {
  getAgentsList,
  getGuardrailsList,
  getPoliciesList,
  getPossibleUserRoles,
  getPromptsList,
  keyCreateCall,
  keyCreateServiceAccountCall,
  modelAvailableCall,
  userFilterUICall,
} from "../networking";
import CreatedKeyDisplay from "../shared/CreatedKeyDisplay";
import {
  administersTeam,
  anotherUserScope,
  effectiveKeyOwner,
  isTeamMemberOwner,
  teamMemberOwnerOptions,
  teamMemberOwnerPlaceholder,
} from "./createKeyOwnerAccess";
import { buildKeyCreatePayload, type KeyCreateInput } from "./createKeyPayload";
import { simplifyKeyGenerateError } from "./utils";
import { CreateKeyAccessFields } from "./CreateKeyAccessFields";
import { CreateKeyAdvancedPanels, SECTION_CHEVRON_CLASS, SECTION_HEADER_CLASS } from "./CreateKeyAdvancedPanels";
import { CreateKeyBudgetFields } from "./CreateKeyBudgetFields";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const KEY_TYPE_OPTIONS = [
  { value: "llm_api", labelKey: "editForm.keyTypeAiApis", hintKey: "editForm.keyTypeAiApisHint" },
  { value: "management", labelKey: "editForm.keyTypeManagement", hintKey: "editForm.keyTypeManagementHint" },
  { value: "default", labelKey: "editForm.keyTypeFullAccess", hintKey: "editForm.keyTypeFullAccessHint" },
] as const;

const KEY_OWNER_LABEL_CLASS = "flex items-center gap-2 text-sm font-normal text-foreground";

type FieldWrite = (value: unknown) => void;

const isBlank = (value: unknown): boolean => value === undefined || value === null || value === "";

const requiredRule = (required: boolean, message: string) => ({
  validate: (value: unknown) => (required && isBlank(value) ? message : true),
});

/**
 * Interface for pre-filling the create key form from URL parameters
 */
export interface CreateKeyPrefillData {
  owned_by?: "you" | "service_account" | "another_user";
  team_id?: string;
  key_alias?: string;
  models?: string[];
  key_type?: "default" | "llm_api" | "management";
}

interface CreateKeyProps {
  team: Team | null;
  data: any[] | null;
  teams: Team[] | null;
  addKey: (data: any) => void;
  autoOpenCreate?: boolean;
  prefillData?: CreateKeyPrefillData;
}

interface User {
  user_id: string;
  user_email: string | null;
  role?: string;
}

export const fetchTeamModels = async (
  userID: string,
  userRole: string,
  accessToken: string,
  teamID: string | null,
): Promise<string[]> => {
  try {
    if (userID === null || userRole === null) {
      return [];
    }

    if (accessToken !== null) {
      const model_available = await modelAvailableCall(accessToken, userID, userRole, true, teamID, true);
      const available_model_names = model_available["data"].map((element: { id: string }) => element.id);
      return available_model_names;
    }
    return [];
  } catch (error) {
    console.error("Error fetching user models:", error);
    return [];
  }
};

export const fetchUserModels = async (
  userID: string,
  userRole: string,
  accessToken: string,
  setUserModels: (models: string[]) => void,
) => {
  try {
    if (userID === null || userRole === null) {
      return;
    }

    if (accessToken !== null) {
      const model_available = await modelAvailableCall(accessToken, userID, userRole);
      const available_model_names = model_available["data"].map((element: { id: string }) => element.id);
      setUserModels(available_model_names);
    }
  } catch (error) {
    console.error("Error fetching user models:", error);
  }
};

/**
 * ─────────────────────────────────────────────────────────────────────────
 * @deprecated
 * This component is being DEPRECATED in favor of src/app/(dashboard)/virtual-keys/components/CreateKey.tsx
 * Please contribute to the new refactor.
 * ─────────────────────────────────────────────────────────────────────────
 */
const CreateKey: React.FC<CreateKeyProps> = ({ team, teams, data, addKey, autoOpenCreate, prefillData }) => {
  const t = useTranslations("virtualKeys");
  const ct = useTranslations("virtualKeys.createForm");
  const commonT = useTranslations("common");
  const usersT = useTranslations("users");
  const selectorT = useTranslations("agents.selector");
  const { accessToken, userId: userID, userRole, premiumUser } = useAuthorized();
  const canEditGuardrails = premiumUser || (userRole != null && rolesWithWriteAccess.includes(userRole));
  const canViewPolicies = useCan("viewPolicies");
  const canViewPrompts = useCan("viewPrompts");
  const { data: organizations, isLoading: isOrganizationsLoading } = useOrganizations();
  const { data: projects, isLoading: isProjectsLoading } = useProjects();
  const { data: uiSettingsData } = useUISettings();
  const { data: tagsData } = useTags();
  const enableProjectsUI = Boolean(uiSettingsData?.values?.enable_projects_ui);
  const disableCustomApiKeys = Boolean(uiSettingsData?.values?.disable_custom_api_keys);
  const tagOptions = tagsData ? Object.values(tagsData).map((tag) => ({ value: tag.name, label: tag.name })) : [];
  const queryClient = useQueryClient();
  const [formDefaults] = useState<MountedFormValues>(() => ({
    team_id: team ? team.team_id : null,
    key_type: "llm_api",
    tpm_limit_type: null,
    rpm_limit_type: null,
    mcp_tool_permissions: {},
    duration: "",
  }));
  const form = useForm<MountedFormValues>({
    mode: "onChange",
    shouldUnregister: false,
    defaultValues: formDefaults,
  });
  const registry = useMountRegistry();
  const mountedForm = useMemo(() => ({ control: form.control, registry }), [form.control, registry]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [userModels, setUserModels] = useState<string[]>([]);
  const [modelsToPick, setModelsToPick] = useState<string[]>([]);
  const [requestedKeyOwner, setKeyOwner] = useState("you");
  const [hasPrefilled, setHasPrefilled] = useState(false);
  const [pendingPrefillModels, setPendingPrefillModels] = useState<string[] | null>(null);
  const [guardrailsList, setGuardrailsList] = useState<string[]>([]);
  const [policiesList, setPoliciesList] = useState<string[]>([]);
  const [promptsList, setPromptsList] = useState<string[]>([]);
  const [loggingSettings, setLoggingSettings] = useState<any[]>([]);
  const [selectedCreateKeyTeam, setSelectedCreateKeyTeam] = useState<Team | null>(team);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isCreateUserModalVisible, setIsCreateUserModalVisible] = useState(false);
  const [possibleUIRoles, setPossibleUIRoles] = useState<Record<string, Record<string, string>>>({});
  const [userOptions, setUserOptions] = useState<SearchSelectOption[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState<boolean>(false);
  const latestUserSearchRef = useRef(0);
  const [disabledCallbacks, setDisabledCallbacks] = useState<string[]>([]);
  const [keyType, setKeyType] = useState<string>("llm_api");
  const [modelAliases, setModelAliases] = useState<{ [key: string]: string }>({});
  const [autoRotationEnabled, setAutoRotationEnabled] = useState<boolean>(false);
  const [rotationInterval, setRotationInterval] = useState<string>("30d");
  const [routerSettings, setRouterSettings] = useState<RouterSettingsAccordionValue | null>(null);
  const routerSettingsRef = useRef<RouterSettingsAccordionRef>(null);
  const [budgetLimits, setBudgetLimits] = useState<BudgetWindowEntry[]>([]);
  const [modelMaxBudget, setModelMaxBudget] = useState<ModelMaxBudget>({});
  const [tagRateLimits, setTagRateLimits] = useState<TagRateLimitEntry[]>([]);
  const [budgetFallbacks, setBudgetFallbacks] = useState<Record<string, string[]>>({});
  const [budgetFallbacksKey, setBudgetFallbacksKey] = useState<number>(0);
  const [routerSettingsKey, setRouterSettingsKey] = useState<number>(0);
  const [agentsList, setAgentsList] = useState<{ agent_id: string; agent_name: string }[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const selectedModels: string[] = (useWatch({ control: form.control, name: "models" }) as string[] | undefined) ?? [];
  const teamAdminEditableFields = parseTeamAdminEditableFields(uiSettingsData?.values);
  const keyOwnerViewer = { userRole, userId: userID, teamAdminEditableFields, teams };
  const ownerScope = anotherUserScope(keyOwnerViewer);
  const keyOwner = effectiveKeyOwner(requestedKeyOwner, ownerScope);
  const ownerLimitedToTeamMembers = keyOwner === "another_user" && ownerScope === "team_members";
  const memberOwnerOptions = teamMemberOwnerOptions(selectedCreateKeyTeam, userID);
  const createKeyOwner = form.watch("user_id");
  useEffect(() => {
    form.setValue("allowed_mcp_servers_and_groups", { servers: [], accessGroups: [] });
    form.setValue("mcp_tool_permissions", {});
  }, [createKeyOwner, form]);
  const ownerRequiresTeam = keyOwner === "service_account" || ownerLimitedToTeamMembers;
  const handleCancel = () => {
    setIsModalVisible(false);
    setApiKey(null);
    setSelectedCreateKeyTeam(null);
    form.reset(formDefaults);
    setLoggingSettings([]);
    setDisabledCallbacks([]);
    setKeyType("llm_api");
    setModelAliases({});
    setAutoRotationEnabled(false);
    setRotationInterval("30d");
    setRouterSettings(null);
    setRouterSettingsKey((prev) => prev + 1);
    setSelectedAgentId(null);
    setSelectedOrganizationId(null);
    setSelectedProjectId(null);
    setBudgetLimits([]);
    setTagRateLimits([]);
    setBudgetFallbacks({});
    setBudgetFallbacksKey((k) => k + 1);
  };

  useEffect(() => {
    if (userID && userRole && accessToken) {
      fetchUserModels(userID, userRole, accessToken, setUserModels);
    }
  }, [accessToken, userID, userRole]);

  useEffect(() => {
    if (accessToken) {
      getAgentsList(accessToken)
        .then((res) => setAgentsList(res?.agents || []))
        .catch(() => setAgentsList([]));
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchGuardrails = async () => {
      try {
        const response = await getGuardrailsList(accessToken);
        const guardrailNames = response.guardrails.map((g: { guardrail_name: string }) => g.guardrail_name);
        setGuardrailsList(guardrailNames);
      } catch (error) {
        console.error("Failed to fetch guardrails:", error);
      }
    };

    const fetchPolicies = async () => {
      try {
        const response = await getPoliciesList(accessToken);
        const policyNames = response.policies.map((p: { policy_name: string }) => p.policy_name);
        setPoliciesList(policyNames);
      } catch (error) {
        console.error("Failed to fetch policies:", error);
      }
    };

    const fetchPrompts = async () => {
      try {
        const response = await getPromptsList(accessToken);
        setPromptsList(Array.from(new Set(response.prompts.map((prompt) => prompt.prompt_id))));
      } catch (error) {
        console.error("Failed to fetch prompts:", error);
      }
    };

    fetchGuardrails();
    if (canViewPolicies) fetchPolicies();
    if (canViewPrompts) fetchPrompts();
  }, [accessToken, canViewPolicies, canViewPrompts]);

  // Fetch possible user roles when component mounts
  useEffect(() => {
    const fetchPossibleRoles = async () => {
      try {
        if (accessToken) {
          // Check if roles are cached in session storage
          const cachedRoles = sessionStorage.getItem("possibleUserRoles");
          if (cachedRoles) {
            setPossibleUIRoles(JSON.parse(cachedRoles));
          } else {
            const availableUserRoles = await getPossibleUserRoles(accessToken);
            sessionStorage.setItem("possibleUserRoles", JSON.stringify(availableUserRoles));
            setPossibleUIRoles(availableUserRoles);
          }
        }
      } catch (error) {
        console.error("Error fetching possible user roles:", error);
      }
    };

    fetchPossibleRoles();
  }, [accessToken]);

  // Auto-open modal and prefill form from URL params (deep link).
  // Guarded by write access so we don't open for read-only users.
  useEffect(() => {
    if (autoOpenCreate && !hasPrefilled && teams && userRole && rolesWithWriteAccess.includes(userRole)) {
      // Open the modal
      setIsModalVisible(true);
      setHasPrefilled(true);

      // Apply prefill data if provided
      if (prefillData) {
        if (prefillData.owned_by) {
          setKeyOwner(prefillData.owned_by);
        }

        // Set team - find the team by ID and set it (only if team exists in user's teams)
        if (prefillData.team_id) {
          const selectedTeam = teams?.find((t) => t.team_id === prefillData.team_id) || null;
          if (selectedTeam) {
            setSelectedCreateKeyTeam(selectedTeam);
            form.setValue("team_id", prefillData.team_id);
          }
          // Silently ignore invalid team_id - don't prefill with a team user doesn't have access to
        }

        // Set key alias
        if (prefillData.key_alias) {
          form.setValue("key_alias", prefillData.key_alias);
        }

        // Defer model selection until we load the allowed model list.
        if (prefillData.models && prefillData.models.length > 0) {
          setPendingPrefillModels(prefillData.models);
        }

        // Set key type
        if (prefillData.key_type) {
          setKeyType(prefillData.key_type);
          form.setValue("key_type", prefillData.key_type);
        }
      }
    }
  }, [autoOpenCreate, prefillData, teams, hasPrefilled, form, userRole]);

  // Check if team selection is required
  const isTeamSelectionRequired = modelsToPick.includes("no-default-models");
  const isFormDisabled = isTeamSelectionRequired && !selectedCreateKeyTeam;

  const handleCreate = async (formValues: MountedFormValues) => {
    try {
      const input: KeyCreateInput = {
        formValues,
        existingKeys: data,
        keyOwner,
        userID,
        selectedAgentId,
        loggingSettings,
        disabledCallbacks,
        autoRotationEnabled,
        rotationInterval,
        modelAliases,
        routerSettings: routerSettingsRef.current?.getValue() ?? routerSettings,
        budgetLimits,
        modelMaxBudget,
        tagRateLimits,
        budgetFallbacks,
      };
      const built = buildKeyCreatePayload(input);
      if (built.kind === "duplicate_alias") {
        throw new Error(ct("duplicateAlias", { alias: built.alias, teamId: String(built.teamId) }));
      }

      toast.info(ct("makingApiCall"));
      setIsModalVisible(true);

      if (built.kind === "agent_not_selected") {
        toast.fromError(ct("agentRequired"));
        return;
      }
      const { payload, endpoint } = built;

      const response =
        endpoint === "service_account"
          ? await keyCreateServiceAccountCall(accessToken, payload)
          : await keyCreateCall(accessToken, userID ?? "", payload);

      // Add the data to the state in the parent component
      // Also directly update the keys list in VirtualKeysTable without an API call
      addKey(response);

      // Invalidate and refetch all keys list queries to update the table
      // This will trigger a refetch of all key list queries regardless of pagination
      queryClient.invalidateQueries({ queryKey: keyKeys.lists() });

      setApiKey(response["key"]);
      toast.success(ct("virtualKeyCreated"));
      form.reset(formDefaults);
      setBudgetLimits([]);
      setTagRateLimits([]);
      setBudgetFallbacks({});
      setBudgetFallbacksKey((k) => k + 1);
      localStorage.removeItem("userData" + userID);
    } catch (error) {
      const simplifiedError = simplifyKeyGenerateError(t, error);
      toast.fromError(simplifiedError);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
    void form.handleSubmit(() => handleCreate(projectMountedValues(registry, form.getValues)))(event);

  // Fetch available models when team or auth changes.
  // Note: Model prefill from URL params is handled by the useEffect below, which
  // watches for pendingPrefillModels + modelsToPick to both be populated.
  useEffect(() => {
    if (selectedProjectId) {
      // When a project is selected, use the project's models
      const project = projects?.find((p) => p.project_id === selectedProjectId);
      const projectModels = project?.models ?? [];
      setModelsToPick(projectModels);
      form.setValue("models", []);
      return;
    }
    if (userID && userRole && accessToken) {
      fetchTeamModels(userID, userRole, accessToken, selectedCreateKeyTeam?.team_id ?? null).then((models) => {
        const allModels = excludeProxyWideSentinel(
          Array.from(new Set([...(selectedCreateKeyTeam?.models ?? []), ...models])),
        );
        setModelsToPick(allModels);
      });
    }
    // Only clear models if we don't have pending prefill models
    if (!pendingPrefillModels) {
      form.setValue("models", []);
    }
    // Clear MCP server selection when team changes (available servers may differ)
    form.setValue("allowed_mcp_servers_and_groups", { servers: [], accessGroups: [] });
    form.setValue("mcp_tool_permissions", {});
  }, [selectedCreateKeyTeam, selectedProjectId, accessToken, userID, userRole, form]);

  // Apply deferred model prefill once the available model list arrives.
  // This handles timing where prefill data arrives before or after models are fetched.
  useEffect(() => {
    if (!pendingPrefillModels || pendingPrefillModels.length === 0) {
      return;
    }
    if (!modelsToPick || modelsToPick.length === 0) {
      return;
    }

    const validModels = pendingPrefillModels.filter((model) => modelsToPick.includes(model));
    if (validModels.length > 0) {
      form.setValue("models", validModels);
    }
    setPendingPrefillModels(null);
  }, [pendingPrefillModels, modelsToPick, form]);

  // Sync team when project is selected but teams loaded later (race condition)
  useEffect(() => {
    if (!selectedProjectId || !teams) return;
    const project = projects?.find((p) => p.project_id === selectedProjectId);
    if (!project?.team_id) return;
    // If team is already set correctly, skip
    if (selectedCreateKeyTeam?.team_id === project.team_id) return;
    const projectTeam = teams.find((t) => t.team_id === project.team_id) || null;
    if (projectTeam) {
      setSelectedCreateKeyTeam(projectTeam);
      form.setValue("team_id", projectTeam.team_id);
    }
  }, [teams, selectedProjectId, projects]);

  // Add a callback function to handle user creation
  const handleUserCreated = (userId: string) => {
    form.setValue("user_id", userId);
    setIsCreateUserModalVisible(false);
  };

  const fetchUsers = async (searchText: string): Promise<void> => {
    const searchId = latestUserSearchRef.current + 1;
    latestUserSearchRef.current = searchId;
    const isLatestSearch = (): boolean => searchId === latestUserSearchRef.current;

    if (!searchText) {
      setUserOptions([]);
      setUserSearchLoading(false);
      return;
    }

    setUserSearchLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("search", searchText);
      if (accessToken == null) {
        return;
      }
      const response = await userFilterUICall(accessToken, params);
      if (!isLatestSearch()) return;

      const data: User[] = response;
      const options: SearchSelectOption[] = data.map((user) => ({
        label: user.user_email ? `${user.user_email} (${user.user_id})` : user.user_id,
        value: user.user_id,
      }));

      setUserOptions(options);
    } catch (error) {
      console.error("Error fetching users:", error);
      if (isLatestSearch()) toast.fromError(ct("userSearchFailed"));
    } finally {
      if (isLatestSearch()) setUserSearchLoading(false);
    }
  };

  const changeOrganization = (write: FieldWrite) => (orgId: string | null) => {
    write(orgId);
    setSelectedOrganizationId(orgId);
    // Clear team and project when org changes
    setSelectedCreateKeyTeam(null);
    setSelectedProjectId(null);
    form.setValue("team_id", null);
    form.setValue("project_id", null);
  };

  const selectTeam = (team: Team | null) => {
    setSelectedCreateKeyTeam(team);
    setSelectedProjectId(null);
    form.setValue("project_id", null);
    // Auto-populate org from team for non-admin users
    if (team?.organization_id) {
      setSelectedOrganizationId(team.organization_id);
      form.setValue("organization_id", team.organization_id);
    } else if (!team) {
      setSelectedOrganizationId(null);
      form.setValue("organization_id", null);
    }
  };

  const changeKeyOwner = (owner: string) => {
    setKeyOwner(owner);
    const limitsOwnerToTeamMembers = owner === "another_user" && ownerScope === "team_members";
    if (limitsOwnerToTeamMembers && selectedCreateKeyTeam && !administersTeam(selectedCreateKeyTeam, userID)) {
      selectTeam(null);
      form.setValue("team_id", null);
    }
  };

  useEffect(() => {
    if (!ownerLimitedToTeamMembers) return;
    const owner = form.getValues("user_id");
    if (owner != null && !isTeamMemberOwner(owner, selectedCreateKeyTeam, userID)) {
      form.setValue("user_id", null);
    }
  }, [ownerLimitedToTeamMembers, selectedCreateKeyTeam, userID, form]);

  const changeProject = (write: FieldWrite) => (projectId: string | null) => {
    write(projectId);
    if (!projectId) {
      setSelectedProjectId(null);
      setSelectedCreateKeyTeam(null);
      form.setValue("team_id", null);
      return;
    }
    setSelectedProjectId(projectId);
  };

  const keyTypeItems = useMemo(
    () =>
      KEY_TYPE_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey),
        hint: t(option.hintKey),
      })),
    [t],
  );

  const allModelsSentinel = hasAllModelsSentinel(selectedModels);
  const modelOptions: MultiSelectOption[] = useMemo(
    () => [
      ...(selectedProjectId === null && selectedCreateKeyTeam
        ? [{ value: "all-team-models", label: t("editForm.allTeamModels") }]
        : []),
      ...(selectedProjectId === null && !selectedCreateKeyTeam
        ? [{ value: "all-proxy-models", label: t("editForm.allProxyModels") }]
        : []),
      ...modelsToPick.map((model) => ({
        value: model,
        label: getModelDisplayName(model),
        disabled: allModelsSentinel,
      })),
    ],
    [allModelsSentinel, modelsToPick, selectedCreateKeyTeam, selectedProjectId, t],
  );

  const changeKeyType = (write: FieldWrite) => (value: string) => {
    write(value);
    setKeyType(value);
    // Clear models field and disable if management or read_only
    if (value === "management" || value === "read_only") {
      form.setValue("models", []);
    }
  };

  const memberOwnerPlaceholder = teamMemberOwnerPlaceholder(memberOwnerOptions, selectedCreateKeyTeam, {
    selectMember: ct("selectTeamMember"),
    noOtherMembers: ct("teamHasNoOtherMembers"),
    selectTeam: ct("selectTeamFirst"),
  });
  const requiredTeamHelp = ownerLimitedToTeamMembers ? ct("memberOwnerRequiredHelp") : ct("requiredHelp");
  const teamFieldHelp = ownerRequiresTeam ? requiredTeamHelp : "";
  const ownerField = keyOwner === "another_user" && (
    <MountedFormField
      label={
        <span>
          {usersT("userID")}{" "}
          <SimpleTooltip content={ct("userIdHint")}>
            <Info className="ml-1 inline size-3.5 align-text-bottom" />
          </SimpleTooltip>
        </span>
      }
      name="user_id"
      className="mt-4"
      required
      rules={requiredRule(keyOwner === "another_user", ct("userIdRequired"))}
    >
      {(control) =>
        ownerLimitedToTeamMembers ? (
          <SearchSelect
            inputId={control.id}
            options={memberOwnerOptions}
            value={typeof control.value === "string" ? control.value : null}
            onValueChange={control.onChange}
            disabled={memberOwnerOptions.length === 0}
            placeholder={memberOwnerPlaceholder}
            emptyText={ct("noTeamMembers")}
          />
        ) : (
          <div>
            <div className="mb-2 flex">
              <PaginatedSearchSelect
                options={userOptions}
                value={typeof control.value === "string" ? control.value : undefined}
                onValueChange={control.onChange}
                onSearchChange={fetchUsers}
                isLoading={userSearchLoading}
                placeholder={ct("userSearchPlaceholder")}
                emptyText={usersT("noUsers")}
                loadingText={commonT("searching")}
                inputId={control.id}
                aria-required={control["aria-required"] === "true" ? true : undefined}
                aria-invalid={control["aria-invalid"] === "true" ? true : undefined}
                aria-describedby={control["aria-describedby"]}
              />
              <Button variant="outline" className="ml-2" onClick={() => setIsCreateUserModalVisible(true)}>
                {usersT("createUser")}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">{ct("userSearchHelp")}</div>
          </div>
        )
      }
    </MountedFormField>
  );

  return (
    <div>
      {userRole && rolesWithWriteAccess.includes(userRole) && (
        <Button className="mx-auto" onClick={() => setIsModalVisible(true)} data-testid="create-key-button">
          {t("createNewKey")}
        </Button>
      )}
      <Dialog open={isModalVisible} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">{t("createNewKey")}</DialogTitle>
          </DialogHeader>
          <MountedFormProvider value={mountedForm}>
            <form onSubmit={handleSubmit}>
              {/* Section 1: Key Ownership */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-foreground mb-4">{ct("sectionOwnership")}</h3>
                <Field className="mb-4">
                  <FieldLabel>
                    <span>
                      {ct("ownedBy")}{" "}
                      <SimpleTooltip content={ct("ownedByHint")}>
                        <Info className="ml-1 inline size-3.5 align-text-bottom" />
                      </SimpleTooltip>
                    </span>
                  </FieldLabel>
                  <RadioGroup
                    className="flex flex-wrap items-center gap-4"
                    value={keyOwner}
                    onValueChange={(value: unknown) => changeKeyOwner(String(value))}
                  >
                    <label className={KEY_OWNER_LABEL_CLASS}>
                      <RadioGroupItem value="you" />
                      {ct("ownerYou")}
                    </label>
                    <label className={KEY_OWNER_LABEL_CLASS}>
                      <RadioGroupItem value="service_account" />
                      {ct("ownerServiceAccount")}
                    </label>
                    {ownerScope !== "none" && (
                      <label className={KEY_OWNER_LABEL_CLASS}>
                        <RadioGroupItem value="another_user" />
                        {ct("ownerAnotherUser")}
                      </label>
                    )}
                    <label className={KEY_OWNER_LABEL_CLASS}>
                      <RadioGroupItem value="agent" />
                      {ct("ownerAgent")} <Badge>{ct("ownerAgentBadge")}</Badge>
                    </label>
                  </RadioGroup>
                </Field>

                {keyOwner === "another_user" && !ownerLimitedToTeamMembers && (
                  <MountedFormField
                    label={
                      <span>
                        {usersT("userID")}{" "}
                        <SimpleTooltip content={ct("userIdHint")}>
                          <Info className="ml-1 inline size-3.5 align-text-bottom" />
                        </SimpleTooltip>
                      </span>
                    }
                    name="user_id"
                    className="mt-4"
                    required
                    rules={requiredRule(keyOwner === "another_user", ct("userIdRequired"))}
                  >
                    {(control) => (
                      <div>
                        <div className="mb-2 flex">
                          <PaginatedSearchSelect
                            options={userOptions}
                            value={typeof control.value === "string" ? control.value : undefined}
                            onValueChange={control.onChange}
                            onSearchChange={fetchUsers}
                            isLoading={userSearchLoading}
                            placeholder={ct("userSearchPlaceholder")}
                            emptyText={usersT("noUsers")}
                            loadingText={commonT("searching")}
                            inputId={control.id}
                            aria-required={control["aria-required"] === "true" ? true : undefined}
                            aria-invalid={control["aria-invalid"] === "true" ? true : undefined}
                            aria-describedby={control["aria-describedby"]}
                          />
                          <Button variant="outline" className="ml-2" onClick={() => setIsCreateUserModalVisible(true)}>
                            {usersT("createUser")}
                          </Button>
                        </div>
                        <div className="text-xs text-muted-foreground">{ct("userSearchHelp")}</div>
                      </div>
                    )}
                  </MountedFormField>
                )}
                {keyOwner === "agent" && (
                  <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md dark:bg-purple-950 dark:border-purple-800">
                    <div className="mb-3">
                      <label htmlFor="create-key-agent" className="text-sm font-medium text-foreground">
                        {ct("selectAgentLabel")} <span className="text-destructive">*</span>
                      </label>
                    </div>
                    <SearchSelect
                      inputId="create-key-agent"
                      placeholder={ct("agentPlaceholder")}
                      emptyText={selectorT("noAgents")}
                      value={selectedAgentId}
                      onValueChange={setSelectedAgentId}
                      options={agentsList.map((a) => ({
                        label: a.agent_name || a.agent_id,
                        value: a.agent_id,
                      }))}
                    />
                    <div className="text-xs text-muted-foreground mt-2">{ct("agentHint")}</div>
                  </div>
                )}
                <MountedFormField
                  label={
                    <span>
                      {t("columns.organization")}{" "}
                      <SimpleTooltip content={t("editForm.organizationHint")}>
                        <Info className="ml-1 inline size-3.5 align-text-bottom" />
                      </SimpleTooltip>
                    </span>
                  }
                  name="organization_id"
                  className="mt-4"
                >
                  {(control) => (
                    <OrganizationDropdown
                      id={control.id}
                      value={typeof control.value === "string" ? control.value : null}
                      organizations={organizations}
                      loading={isOrganizationsLoading}
                      disabled={userRole !== "Admin"}
                      onChange={changeOrganization(control.onChange)}
                    />
                  )}
                </MountedFormField>
                <MountedFormField
                  label={
                    <span>
                      {t("columns.team")}{" "}
                      <SimpleTooltip content={ct("teamHint")}>
                        <Info className="ml-1 inline size-3.5 align-text-bottom" />
                      </SimpleTooltip>
                    </span>
                  }
                  name="team_id"
                  className="mt-4"
                  required={keyOwner === "service_account"}
                  rules={requiredRule(keyOwner === "service_account", ct("teamRequiredServiceAccount"))}
                  help={keyOwner === "service_account" ? ct("requiredHelp") : ""}
                >
                  {(control) => (
                    <TeamDropdown
                      id={control.id}
                      value={typeof control.value === "string" ? control.value : null}
                      onChange={control.onChange}
                      disabled={selectedProjectId !== null}
                      organizationId={selectedOrganizationId}
                      onTeamSelect={selectTeam}
                      filterTeam={ownerLimitedToTeamMembers ? (team) => administersTeam(team, userID) : undefined}
                    />
                  )}
                </MountedFormField>
                {ownerLimitedToTeamMembers && ownerField}
                {enableProjectsUI && (
                  <MountedFormField
                    label={
                      <span>
                        {t("info.projectLabel")}{" "}
                        <SimpleTooltip content={ct("projectHint")}>
                          <Info className="ml-1 inline size-3.5 align-text-bottom" />
                        </SimpleTooltip>
                      </span>
                    }
                    name="project_id"
                    className="mt-4"
                  >
                    {(control) => (
                      <ProjectDropdown
                        id={control.id}
                        value={typeof control.value === "string" ? control.value : null}
                        projects={projects}
                        teamId={selectedCreateKeyTeam?.team_id}
                        loading={isProjectsLoading || !teams}
                        onChange={changeProject(control.onChange)}
                      />
                    )}
                  </MountedFormField>
                )}
              </div>

              {/* Show message when team selection is required */}
              {isFormDisabled && (
                <div className="mb-8 p-4 bg-info/10 border border-info/20 rounded-md">
                  <p className="text-info text-sm">{ct("teamSelectionRequired")}</p>
                </div>
              )}

              {/* Section 2: Key Details */}
              {!isFormDisabled && (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-foreground mb-4">{ct("sectionDetails")}</h3>
                  <MountedFormField
                    label={
                      <span>
                        {ct(keyOwner === "you" || keyOwner === "another_user" ? "keyName" : "serviceAccountId")}{" "}
                        <SimpleTooltip
                          content={ct(
                            keyOwner === "you" || keyOwner === "another_user" ? "keyNameHint" : "serviceAccountIdHint",
                          )}
                        >
                          <Info className="ml-1 inline size-3.5 align-text-bottom" />
                        </SimpleTooltip>
                      </span>
                    }
                    name="key_alias"
                    required
                    rules={requiredRule(true, ct(keyOwner === "you" ? "inputKeyName" : "inputServiceAccountId"))}
                    help={ct("requiredHelp")}
                  >
                    {(control) => <Input {...control} value={(control.value as string | undefined) ?? ""} />}
                  </MountedFormField>

                  <MountedFormField
                    label={
                      <span>
                        {t("columns.models")}{" "}
                        <SimpleTooltip content={ct("modelsHint")}>
                          <Info className="ml-1 inline size-3.5 align-text-bottom" />
                        </SimpleTooltip>
                      </span>
                    }
                    name="models"
                    help={
                      keyType === "management" || keyType === "read_only"
                        ? t("editForm.modelsDisabled")
                        : ct("modelsOptionalHelp")
                    }
                    className="mt-4"
                  >
                    {(control) => (
                      <MultiSelect
                        id={control.id}
                        options={modelOptions}
                        value={(control.value as string[] | undefined) ?? []}
                        placeholder={t("editForm.selectModels")}
                        disabled={keyType === "management" || keyType === "read_only"}
                        onValueChange={(values) => {
                          control.onChange(values);
                          if (values.includes("all-team-models")) {
                            form.setValue("models", ["all-team-models"]);
                          } else if (values.includes("all-proxy-models")) {
                            form.setValue("models", ["all-proxy-models"]);
                          }
                        }}
                      />
                    )}
                  </MountedFormField>

                  <MountedFormField
                    label={
                      <span>
                        {t("editForm.keyType")}{" "}
                        <SimpleTooltip content={ct("keyTypeHint")}>
                          <Info className="ml-1 inline size-3.5 align-text-bottom" />
                        </SimpleTooltip>
                      </span>
                    }
                    name="key_type"
                    className="mt-4"
                  >
                    {(control) => (
                      <Select
                        items={keyTypeItems}
                        value={control.value as string | undefined}
                        onValueChange={(value: string | null) =>
                          value != null && changeKeyType(control.onChange)(value)
                        }
                      >
                        <SelectTrigger
                          id={control.id}
                          className="w-full"
                          aria-invalid={control["aria-invalid"]}
                          aria-describedby={control["aria-describedby"]}
                        >
                          <SelectValue placeholder={t("editForm.selectKeyType")} />
                        </SelectTrigger>
                        <SelectContent>
                          {keyTypeItems.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="py-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="mt-0.5 text-[11px] text-muted-foreground">{option.hint}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </MountedFormField>
                </div>
              )}

              {/* Section 3: Optional Settings */}
              {!isFormDisabled && (
                <div className="mb-8">
                  <Collapsible className="mt-4 mb-4 overflow-hidden rounded-lg border">
                    <h3 className="m-0 text-lg font-medium text-foreground">
                      <CollapsibleTrigger className={SECTION_HEADER_CLASS}>
                        {ct("sectionOptional")}
                        <ChevronDown className={SECTION_CHEVRON_CLASS} />
                      </CollapsibleTrigger>
                    </h3>
                    <CollapsibleContent className="px-4 pb-3">
                      <CreateKeyBudgetFields
                        team={team}
                        keyOwner={keyOwner}
                        userRole={userRole}
                        accessToken={accessToken}
                        premiumUser={premiumUser}
                        modelsToPick={modelsToPick}
                        budgetLimits={budgetLimits}
                        setBudgetLimits={setBudgetLimits}
                        modelMaxBudget={modelMaxBudget}
                        setModelMaxBudget={setModelMaxBudget}
                        tagRateLimits={tagRateLimits}
                        setTagRateLimits={setTagRateLimits}
                        budgetFallbacks={budgetFallbacks}
                        setBudgetFallbacks={setBudgetFallbacks}
                        budgetFallbacksKey={budgetFallbacksKey}
                      />
                      <CreateKeyAccessFields
                        canEditGuardrails={canEditGuardrails}
                        canViewPolicies={canViewPolicies}
                        canViewPrompts={canViewPrompts}
                        premiumUser={premiumUser}
                        userRole={userRole}
                        accessToken={accessToken}
                        guardrailsList={guardrailsList}
                        policiesList={policiesList}
                        promptsList={promptsList}
                        tagOptions={tagOptions}
                        selectedCreateKeyTeam={selectedCreateKeyTeam}
                      />
                      <CreateKeyAdvancedPanels
                        accessToken={accessToken}
                        selectedCreateKeyTeam={selectedCreateKeyTeam}
                        premiumUser={premiumUser}
                        loggingSettings={loggingSettings}
                        setLoggingSettings={setLoggingSettings}
                        disabledCallbacks={disabledCallbacks}
                        setDisabledCallbacks={setDisabledCallbacks}
                        routerSettings={routerSettings}
                        setRouterSettings={setRouterSettings}
                        routerSettingsRef={routerSettingsRef}
                        routerSettingsKey={routerSettingsKey}
                        userModels={userModels}
                        modelAliases={modelAliases}
                        setModelAliases={setModelAliases}
                        autoRotationEnabled={autoRotationEnabled}
                        setAutoRotationEnabled={setAutoRotationEnabled}
                        rotationInterval={rotationInterval}
                        setRotationInterval={setRotationInterval}
                        disableCustomApiKeys={disableCustomApiKeys}
                        control={form.control}
                        setValue={form.setValue}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <Button type="submit" disabled={isFormDisabled}>
                  {t("createKey")}
                </Button>
              </div>
            </form>
          </MountedFormProvider>
        </DialogContent>
      </Dialog>

      {/* Add the Create User Modal */}
      {isCreateUserModalVisible && (
        <Dialog open={isCreateUserModalVisible} onOpenChange={(open) => !open && setIsCreateUserModalVisible(false)}>
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{usersT("createNewUser")}</DialogTitle>
            </DialogHeader>
            <CreateUserButton
              userID={userID ?? ""}
              accessToken={accessToken}
              possibleUIRoles={possibleUIRoles}
              onUserCreated={handleUserCreated}
              isEmbedded={true}
            />
          </DialogContent>
        </Dialog>
      )}

      {apiKey && (
        <Dialog open={isModalVisible} onOpenChange={(open) => !open && handleCancel()}>
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-2xl">
            <div className="grid grid-cols-1 gap-2 w-full">
              <DialogTitle className="text-lg font-medium text-foreground">{ct("saveYourKey")}</DialogTitle>
              {apiKey != null ? (
                <CreatedKeyDisplay apiKey={apiKey} />
              ) : (
                <p className="text-sm">{ct("keyBeingCreated")}</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CreateKey;
