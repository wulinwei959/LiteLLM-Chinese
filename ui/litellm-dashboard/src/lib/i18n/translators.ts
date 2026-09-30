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

function useChangePasswordTranslator() {
  return useTranslations("changePassword");
}
export type ChangePasswordTranslator = ReturnType<typeof useChangePasswordTranslator>;

function useCommonTranslator() {
  return useTranslations("common");
}
export type CommonTranslator = ReturnType<typeof useCommonTranslator>;

function useMcpServersTranslator() {
  return useTranslations("mcpServers");
}
export type McpServersTranslator = ReturnType<typeof useMcpServersTranslator>;

function useModelsTranslator() {
  return useTranslations("models");
}
export type ModelsTranslator = ReturnType<typeof useModelsTranslator>;

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
