import { useTranslations } from "next-intl";

/**
 * Concrete translator types, one per message namespace.
 *
 * Prefer these over bare `ReturnType<typeof useTranslations>` in prop and
 * parameter positions. The bare form leaves the namespace generic, and once
 * `AppConfig.Messages` is augmented the key union over the whole catalog grows
 * past what the compiler can relate reliably: valid keys such as
 * `"common.save"` fail while invalid ones pass, depending on internal union
 * layout. A namespace-bound translator keeps a small, checkable key union, so
 * a typo or a key that lives in another namespace fails loudly at the call.
 *
 * Each wrapper below exists only to capture the type; call sites keep calling
 * `useTranslations("<ns>")` directly, which is structurally identical.
 */

function useAccessGroupsTranslator() {
  return useTranslations("access-groups");
}
export type AccessGroupsTranslator = ReturnType<typeof useAccessGroupsTranslator>;

function useAdminPanelTranslator() {
  return useTranslations("adminPanel");
}
export type AdminPanelTranslator = ReturnType<typeof useAdminPanelTranslator>;

function useBudgetsTranslator() {
  return useTranslations("budgets");
}
export type BudgetsTranslator = ReturnType<typeof useBudgetsTranslator>;

function useBudgetEditorsTranslator() {
  return useTranslations("budgetEditors");
}
export type BudgetEditorsTranslator = ReturnType<typeof useBudgetEditorsTranslator>;

function useBudgetDurationTranslator() {
  return useTranslations("common.budgetDuration");
}
export type BudgetDurationTranslator = ReturnType<typeof useBudgetDurationTranslator>;

function useChangePasswordTranslator() {
  return useTranslations("changePassword");
}
export type ChangePasswordTranslator = ReturnType<typeof useChangePasswordTranslator>;

function useChatTranslator() {
  return useTranslations("chat");
}
export type ChatTranslator = ReturnType<typeof useChatTranslator>;


function useMcpServersTranslator() {
  return useTranslations("mcpServers");
}
export type McpServersTranslator = ReturnType<typeof useMcpServersTranslator>;

function useTeamsTableTranslator() {
  return useTranslations("teams");
}
export type TeamsTableTranslator = ReturnType<typeof useTeamsTableTranslator>;

function useModelsTranslator() {
  return useTranslations("models");
}
export type ModelsTranslator = ReturnType<typeof useModelsTranslator>;

function usePassThroughTableTranslator() {
  return useTranslations("models.passThrough.table");
}
export type PassThroughTableTranslator = ReturnType<typeof usePassThroughTableTranslator>;

function useCommonTranslator() {
  return useTranslations("common");
}
export type CommonTranslator = ReturnType<typeof useCommonTranslator>;

function useModelsAutoRoutersTranslator() {
  return useTranslations("models.autoRouters");
}
export type ModelsAutoRoutersTranslator = ReturnType<typeof useModelsAutoRoutersTranslator>;

function useNavTranslator() {
  return useTranslations("nav");
}
export type NavTranslator = ReturnType<typeof useNavTranslator>;

function useOrganizationsTranslator() {
  return useTranslations("organizations");
}
export type OrganizationsTranslator = ReturnType<typeof useOrganizationsTranslator>;

function useProjectsTranslator() {
  return useTranslations("projects");
}
export type ProjectsTranslator = ReturnType<typeof useProjectsTranslator>;

function useTeamsTranslator() {
  return useTranslations("teams");
}
export type TeamsTranslator = ReturnType<typeof useTeamsTranslator>;

function useUsersTranslator() {
  return useTranslations("users");
}
export type UsersTranslator = ReturnType<typeof useUsersTranslator>;

function useVirtualKeysTranslator() {
  return useTranslations("virtualKeys");
}
export type VirtualKeysTranslator = ReturnType<typeof useVirtualKeysTranslator>;

function useGuardrailsTranslator() {
  return useTranslations("guardrails");
}
export type GuardrailsTranslator = ReturnType<typeof useGuardrailsTranslator>;

function useGuardrailsMonitorTranslator() {
  return useTranslations("guardrailsMonitor");
}
export type GuardrailsMonitorTranslator = ReturnType<typeof useGuardrailsMonitorTranslator>;

function usePoliciesTranslator() {
  return useTranslations("policies");
}
export type PoliciesTranslator = ReturnType<typeof usePoliciesTranslator>;

function useCostOptimizationTranslator() {
  return useTranslations("costOptimization");
}
export type CostOptimizationTranslator = ReturnType<typeof useCostOptimizationTranslator>;

function usePromptsTranslator() {
  return useTranslations("prompts");
}
export type PromptsTranslator = ReturnType<typeof usePromptsTranslator>;

function useUsageTranslator() {
  return useTranslations("usage");
}
export type UsageTranslator = ReturnType<typeof useUsageTranslator>;

function useUsageAiChatTranslator() {
  return useTranslations("usage.aiChat");
}
export type UsageAiChatTranslator = ReturnType<typeof useUsageAiChatTranslator>;

function useUsageProviderTranslator() {
  return useTranslations("usage.provider");
}
export type UsageProviderTranslator = ReturnType<typeof useUsageProviderTranslator>;

function useUsageTeamUserSpendTranslator() {
  return useTranslations("usage.teamUserSpend");
}
export type UsageTeamUserSpendTranslator = ReturnType<typeof useUsageTeamUserSpendTranslator>;

function useTagManagementTranslator() {
  return useTranslations("tagManagement");
}
export type TagManagementTranslator = ReturnType<typeof useTagManagementTranslator>;

function useSkillsTranslator() {
  return useTranslations("skills");
}
export type SkillsTranslator = ReturnType<typeof useSkillsTranslator>;

function useMemoryTranslator() {
  return useTranslations("memory");
}
export type MemoryTranslator = ReturnType<typeof useMemoryTranslator>;

function useAgentsTranslator() {
  return useTranslations("agents");
}
export type AgentsTranslator = ReturnType<typeof useAgentsTranslator>;

function useModelHubTranslator() {
  return useTranslations("modelHub");
}
export type ModelHubTranslator = ReturnType<typeof useModelHubTranslator>;

function useSearchToolsTranslator() {
  return useTranslations("searchTools");
}
export type SearchToolsTranslator = ReturnType<typeof useSearchToolsTranslator>;

function useVectorStoresTranslator() {
  return useTranslations("vectorStores");
}
export type VectorStoresTranslator = ReturnType<typeof useVectorStoresTranslator>;

function useVectorStoresTableTranslator() {
  return useTranslations("vectorStores.table");
}
export type VectorStoresTableTranslator = ReturnType<typeof useVectorStoresTableTranslator>;

function useCostTrackingTranslator() {
  return useTranslations("costTracking");
}
export type CostTrackingTranslator = ReturnType<typeof useCostTrackingTranslator>;

function useLensTranslator() {
  return useTranslations("lens");
}
export type LensTranslator = ReturnType<typeof useLensTranslator>;

function useCloudZeroTranslator() {
  return useTranslations("cloudZero");
}
export type CloudZeroTranslator = ReturnType<typeof useCloudZeroTranslator>;

function useLogsTranslator() {
  return useTranslations("logs");
}
export type LogsTranslator = ReturnType<typeof useLogsTranslator>;

function useRouterSettingsFallbacksTranslator() {
  return useTranslations("routerSettings.fallbacks");
}
export type RouterSettingsFallbacksTranslator = ReturnType<typeof useRouterSettingsFallbacksTranslator>;

function useSecretManagerTranslator() {
  return useTranslations("secretManager");
}
export type SecretManagerTranslator = ReturnType<typeof useSecretManagerTranslator>;

function useVirtualKeysEditFormTranslator() {
  return useTranslations("virtualKeys.editForm");
}
export type VirtualKeysEditFormTranslator = ReturnType<typeof useVirtualKeysEditFormTranslator>;

function useEstimatedOutputTokensTranslator() {
  return useTranslations("virtualKeys.estimatedOutputTokens");
}
export type EstimatedOutputTokensTranslator = ReturnType<typeof useEstimatedOutputTokensTranslator>;

function useOnboardingTranslator() {
  return useTranslations("onboarding");
}
export type OnboardingTranslator = ReturnType<typeof useOnboardingTranslator>;

function useRoiCalculatorTranslator() {
  return useTranslations("roiCalculator");
}
export type RoiCalculatorTranslator = ReturnType<typeof useRoiCalculatorTranslator>;

function useLoginTranslator() {
  return useTranslations("login");
}
export type LoginTranslator = ReturnType<typeof useLoginTranslator>;

function useToolPoliciesTranslator() {
  return useTranslations("toolPolicies");
}
export type ToolPoliciesTranslator = ReturnType<typeof useToolPoliciesTranslator>;

function useRoutingGroupsTranslator() {
  return useTranslations("routingGroups");
}
export type RoutingGroupsTranslator = ReturnType<typeof useRoutingGroupsTranslator>;
