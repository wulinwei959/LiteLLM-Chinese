import React from "react";
import { useTeams } from "@/app/(dashboard)/hooks/teams/useTeams";
import useAuthorized from "@/app/(dashboard)/hooks/useAuthorized";
import useIsOrgAdmin from "@/app/(dashboard)/hooks/useIsOrgAdmin";
import { useHealthReadinessDetails } from "@/app/(dashboard)/hooks/healthReadiness/useHealthReadinessDetails";
import { useLogout } from "@/app/(dashboard)/hooks/useLogout";
import { getProxyBaseUrl } from "@/components/networking";
import { useTheme } from "@/contexts/ThemeContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarSeparator,
  sidebarMenuButtonVariants,
} from "@/components/shared/Sidebar";
import {
  Activity,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  BookOpen,
  Building2,
  Boxes,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileText,
  FlaskConical,
  Folder,
  HeartPulse,
  KeyRound,
  LayoutGrid,
  Network,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  PiggyBank,
  PlayCircle,
  Route,
  ScrollText,
  Search,
  Server,
  Settings as SettingsIcon,
  Shield,
  ShieldCheck,
  Tags,
  Terminal,
  User,
  Users,
  Wallet,
  Wrench,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "@/lib/cva.config";
import { rolesWithCapability } from "../utils/capabilities";
import {
  all_admin_roles,
  internalUserRoles,
  isAdminRole,
  isUserTeamAdminForAnyTeam,
  rolesAllowedToViewWriteScopedPages,
  rolesWithWriteAccess,
} from "../utils/roles";
import BetaBadge from "./BetaBadge";
import SidebarAccountMenu from "./SidebarAccountMenu/SidebarAccountMenu";
import SidebarUsageCard from "./SidebarUsageCard";
import { routeSegmentForPathname, uiHref } from "@/utils/uiHref";
import { useTranslations } from "next-intl";

import type { NavTranslator } from "@/lib/i18n/translators";

const ICON = { strokeWidth: 1.75 } as const;

const LOGO_CLASS_NAME = "h-7 w-auto max-w-[150px] object-contain group-data-[collapsed=true]/sidebar:w-7";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  enabledPagesInternalUsers?: string[] | null;
  enableProjectsUI?: boolean;
  disableAgentsForInternalUsers?: boolean;
  allowAgentsForTeamAdmins?: boolean;
  disableVectorStoresForInternalUsers?: boolean;
  allowVectorStoresForTeamAdmins?: boolean;
}

interface MenuItem {
  key: string;
  page: string;
  route?: string;
  label: string | React.ReactNode;
  roles?: string[];
  children?: MenuItem[];
  icon?: React.ReactNode;
  external_url?: string;
}

interface MenuGroup {
  groupLabel: string;
  items: MenuItem[];
  roles?: string[];
}

// Menu groups organized by category - defined outside component for export.
// Shape (key/page/label/roles/children) is consumed by page_utils.ts; only the
// icons changed to lucide as part of the sidebar redesign.
const menuGroups: MenuGroup[] = [
  {
    groupLabel: "AI GATEWAY",
    items: [
      { key: "api-keys", page: "api-keys", label: "nav.virtualKeys", icon: <KeyRound {...ICON} /> },
      {
        key: "llm-playground",
        page: "llm-playground",
        route: "playground",
        label: "nav.playground",
        icon: <PlayCircle {...ICON} />,
        roles: rolesWithWriteAccess,
      },
      {
        key: "models",
        page: "models",
        route: "models-and-endpoints",
        label: "nav.modelsAndEndpoints",
        icon: <Network {...ICON} />,
        roles: rolesAllowedToViewWriteScopedPages,
      },
      {
        key: "agentic",
        page: "agentic",
        label: "nav.agentic",
        icon: <Bot {...ICON} />,
        children: [
          {
            key: "agents",
            page: "agents",
            label: "nav.agents",
            icon: <Bot {...ICON} />,
            roles: rolesAllowedToViewWriteScopedPages,
          },
          {
            key: "workflows",
            page: "workflows",
            label: "nav.workflowRuns",
            icon: <Workflow {...ICON} />,
            roles: rolesWithCapability("viewWorkflowRuns"),
          },
          {
            key: "memory",
            page: "memory",
            label: "nav.memory",
            icon: <Database {...ICON} />,
            roles: rolesWithCapability("viewMemory"),
          },
        ],
      },
      { key: "mcp-servers", page: "mcp-servers", label: "nav.mcpServers", icon: <Server {...ICON} /> },
      { key: "skills", page: "skills", label: "nav.skills", icon: <Blocks {...ICON} />, roles: all_admin_roles },
      { key: "guardrails", page: "guardrails", label: "nav.guardrails", icon: <Shield {...ICON} /> },
      {
        key: "policies",
        page: "policies",
        label: "nav.policies",
        icon: <ScrollText {...ICON} />,
        roles: rolesWithCapability("viewPolicies"),
      },
      {
        key: "tools",
        page: "tools",
        label: "nav.tools",
        icon: <Wrench {...ICON} />,
        children: [
          { key: "search-tools", page: "search-tools", label: "nav.searchTools", icon: <Search {...ICON} /> },
          { key: "vector-stores", page: "vector-stores", label: "nav.vectorStores", icon: <Database {...ICON} /> },
          {
            key: "tool-policies",
            page: "tool-policies",
            label: "nav.toolPolicies",
            icon: <ShieldCheck {...ICON} />,
            roles: rolesWithCapability("viewToolPolicies"),
          },
        ],
      },
    ],
  },
  {
    groupLabel: "OBSERVABILITY",
    items: [
      {
        key: "new_usage",
        page: "new_usage",
        route: "usage",
        icon: <BarChart3 {...ICON} />,
        roles: [...all_admin_roles, ...internalUserRoles],
        label: "nav.usage",
      },
      {
        key: "cost-optimization",
        page: "cost-optimization",
        icon: <PiggyBank {...ICON} />,
        roles: [...all_admin_roles, ...internalUserRoles],
        label: (
          <span className="flex items-center gap-2">
            <span data-i18n="nav.costOptimization" /> <BetaBadge />
          </span>
        ),
      },
      { key: "logs", page: "logs", label: "nav.logs", icon: <Activity {...ICON} /> },
      {
        key: "guardrails-monitor",
        page: "guardrails-monitor",
        label: "nav.guardrailsMonitor",
        icon: <HeartPulse {...ICON} />,
        roles: rolesWithCapability("viewGuardrailUsage"),
      },
    ],
  },
  {
    groupLabel: "ACCESS CONTROL",
    items: [
      { key: "teams", page: "teams", label: "nav.teams", icon: <Users {...ICON} /> },
      {
        key: "projects",
        page: "projects",
        label: (
          <span className="flex items-center gap-2">
            <span data-i18n="nav.projects" /> <BetaBadge />
          </span>
        ),
        icon: <Folder {...ICON} />,
        roles: all_admin_roles,
      },
      { key: "users", page: "users", label: "nav.internalUsers", icon: <User {...ICON} />, roles: all_admin_roles },
      {
        key: "organizations",
        page: "organizations",
        label: "nav.organizations",
        icon: <Building2 {...ICON} />,
        roles: all_admin_roles,
      },
      {
        key: "access-groups",
        page: "access-groups",
        label: "nav.accessGroups",
        icon: <Boxes {...ICON} />,
        roles: all_admin_roles,
      },
      { key: "budgets", page: "budgets", label: "nav.budgets", icon: <Wallet {...ICON} />, roles: all_admin_roles },
    ],
  },
  {
    groupLabel: "DEVELOPER TOOLS",
    items: [
      { key: "api_ref", page: "api_ref", route: "api-reference", label: "nav.apiReference", icon: <Code2 {...ICON} /> },
      { key: "model-hub-table", page: "model-hub-table", label: "nav.aiHub", icon: <LayoutGrid {...ICON} /> },
      {
        key: "learning-resources",
        page: "learning-resources",
        label: "nav.learningResources",
        icon: <BookOpen {...ICON} />,
        external_url: "https://models.litellm.ai/cookbook",
      },
      {
        key: "caching",
        page: "caching",
        label: "nav.responseCache",
        icon: <Database {...ICON} />,
        roles: all_admin_roles,
      },
      {
        key: "experimental",
        page: "experimental",
        label: "nav.experimental",
        icon: <FlaskConical {...ICON} />,
        children: [
          {
            key: "prompts",
            page: "prompts",
            label: "nav.prompts",
            icon: <FileText {...ICON} />,
            roles: rolesWithCapability("viewPrompts"),
          },
          {
            key: "transform-request",
            page: "transform-request",
            label: "nav.apiPlayground",
            icon: <Terminal {...ICON} />,
            roles: [...all_admin_roles, ...internalUserRoles],
          },
          {
            key: "tag-management",
            page: "tag-management",
            label: "nav.tagManagement",
            icon: <Tags {...ICON} />,
            roles: all_admin_roles,
          },
          {
            key: "4",
            page: "usage",
            route: "old-usage",
            label: "nav.oldUsage",
            icon: <BarChart3 {...ICON} />,
            roles: rolesWithCapability("viewGlobalSpend"),
          },
        ],
      },
    ],
  },
  {
    groupLabel: "SETTINGS",
    roles: all_admin_roles,
    items: [
      {
        key: "settings",
        page: "settings",
        label: "nav.settings",
        icon: <SettingsIcon {...ICON} />,
        roles: all_admin_roles,
        children: [
          {
            key: "router-settings",
            page: "router-settings",
            label: "nav.routerSettings",
            icon: <Route {...ICON} />,
            roles: all_admin_roles,
          },
          {
            key: "logging-and-alerts",
            page: "logging-and-alerts",
            label: "nav.loggingAndAlerts",
            icon: <Bell {...ICON} />,
            roles: all_admin_roles,
          },
          {
            key: "admin-panel",
            page: "admin-panel",
            label: "nav.adminSettings",
            icon: <SettingsIcon {...ICON} />,
            roles: all_admin_roles,
          },
          {
            key: "cost-tracking",
            page: "cost-tracking",
            label: "nav.costTracking",
            icon: <BarChart3 {...ICON} />,
            roles: all_admin_roles,
          },
          {
            key: "ui-theme",
            page: "ui-theme",
            label: "nav.uiTheme",
            icon: <Palette {...ICON} />,
            roles: all_admin_roles,
          },
        ],
      },
    ],
  },
];

const HOME_ROUTE = "api-keys";

const routeOf = (item: MenuItem): string => item.route ?? item.page;

const routeForPathname = (pathname: string): string => routeSegmentForPathname(pathname) || HOME_ROUTE;

const findParentKey = (route: string): string | null => {
  for (const group of menuGroups) {
    for (const item of group.items) {
      if (item.children?.some((c) => routeOf(c) === route)) return item.key;
    }
  }
  return null;
};

const findMenuItemKey = (route: string): string => {
  for (const group of menuGroups) {
    for (const item of group.items) {
      if (routeOf(item) === route) return item.key;
      const child = item.children?.find((c) => routeOf(c) === route);
      if (child) return child.key;
    }
  }
  return HOME_ROUTE;
};

// Section display names use translation keys from the 'nav' namespace
const SECTION_DISPLAY: Record<string, string> = {
  "AI GATEWAY": "nav.aiGateway",
  OBSERVABILITY: "nav.observability",
  "ACCESS CONTROL": "nav.accessControl",
  "DEVELOPER TOOLS": "nav.developerTools",
  SETTINGS: "nav.settings",
};

const prettify = (key: string): string =>
  key
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const labelText = (item: MenuItem): string => (typeof item.label === "string" ? item.label : prettify(item.key));

export type NavMessageKey = Parameters<NavTranslator>[0];

/**
 * Menu labels and section names are stored as 'nav.<key>' so one config drives
 * the sidebar and the breadcrumb. Stripping the prefix must yield a valid nav
 * key; the assertion pins that invariant so a renamed key fails here instead
 * of rendering a MISSING_MESSAGE at runtime.
 */
const navMessageKey = (label: string): NavMessageKey => label.replace(/^nav\./, "") as NavMessageKey;

// Breadcrumb ("Section" / "Page") for the top bar, derived from the same nav config.
export const getBreadcrumb = (pathname: string, navT: NavTranslator): { section: string | null; title: string } => {
  const route = routeForPathname(pathname);
  for (const group of menuGroups) {
    for (const item of group.items) {
      const sectionKey = SECTION_DISPLAY[group.groupLabel] ?? group.groupLabel;
      if (routeOf(item) === route)
        return { section: navT(navMessageKey(sectionKey)), title: translateLabelForBreadcrumb(item.label, navT) };
      const child = item.children?.find((c) => routeOf(c) === route);
      if (child)
        return { section: navT(navMessageKey(sectionKey)), title: translateLabelForBreadcrumb(child.label, navT) };
    }
  }
  return { section: null, title: prettify(route) };
};

const translateLabelForBreadcrumb = (label: string | React.ReactNode, navT: NavTranslator): string => {
  if (typeof label === "string" && label.startsWith("nav.")) {
    return navT(navMessageKey(label));
  }
  if (typeof label === "string") {
    return label;
  }
  // For React nodes, extract text content (fallback to key prettify)
  if (React.isValidElement(label)) {
    const props = label.props as Record<string, unknown>;
    if (props["data-i18n"] && typeof props["data-i18n"] === "string") {
      return navT(navMessageKey(props["data-i18n"]));
    }
    // Try to get text from children
    if (typeof props.children === "string") {
      return props.children;
    }
  }
  return "";
};

const Sidebar_: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapsed,
  enabledPagesInternalUsers,
  enableProjectsUI,
  disableAgentsForInternalUsers,
  allowAgentsForTeamAdmins,
  disableVectorStoresForInternalUsers,
  allowVectorStoresForTeamAdmins,
}) => {
  const { userId, accessToken, userRole, isViewOnly } = useAuthorized();
  const isOrgAdmin = useIsOrgAdmin();
  const { data: teams } = useTeams();
  const { logoUrl, logoUrlDark } = useTheme();
  const [erroredDarkLogo, setErroredDarkLogo] = useState<string | null>(null);
  const { data: healthData } = useHealthReadinessDetails(accessToken);
  const logout = useLogout(accessToken);

  const baseUrl = getProxyBaseUrl();
  const version = healthData?.litellm_version;
  const currentRoute = routeForPathname(usePathname());
  const selectedKey = findMenuItemKey(currentRoute);

  const navT = useTranslations("nav");

  // Translate a label which can be a translation key (string) or a React node (e.g., with BetaBadge)
  const translateLabel = (label: string | React.ReactNode): React.ReactNode => {
    if (typeof label === "string" && label.startsWith("nav.")) {
      return navT(navMessageKey(label));
    }
    // For React nodes (e.g., with BetaBadge), clone and translate data-i18n attributes
    if (React.isValidElement(label)) {
      const labelElement = label as React.ReactElement<{ children?: React.ReactNode }>;
      return React.cloneElement(labelElement, {
        children: React.Children.map(labelElement.props.children, (child) => {
          if (React.isValidElement(child)) {
            const childElement = child as React.ReactElement<Record<string, unknown>>;
            const childProps = childElement.props;
            if (childProps["data-i18n"] && typeof childProps["data-i18n"] === "string") {
              return React.cloneElement(childElement, {
                children: navT(navMessageKey(childProps["data-i18n"])),
              });
            }
          }
          return child;
        }),
      });
    }
    return label;
  };

  // Translate a label for title attribute (must return string)
  const translateLabelForTitle = (label: string | React.ReactNode): string | undefined => {
    if (typeof label === "string" && label.startsWith("nav.")) {
      return navT(navMessageKey(label));
    }
    if (typeof label === "string") {
      return label;
    }
    if (React.isValidElement(label)) {
      const props = label.props as Record<string, unknown>;
      // Check for data-i18n on this element
      if (props["data-i18n"] && typeof props["data-i18n"] === "string") {
        return navT(navMessageKey(props["data-i18n"]));
      }
      // Recursively search children for data-i18n or text content
      const findInChildren = (children: React.ReactNode): string | undefined => {
        if (typeof children === "string") return children;
        if (Array.isArray(children)) {
          for (const child of children) {
            const found = findInChildren(child);
            if (found) return found;
          }
          return undefined;
        }
        if (React.isValidElement(children)) {
          const childElement = children as React.ReactElement<Record<string, unknown>>;
          const childProps = childElement.props;
          if (childProps["data-i18n"] && typeof childProps["data-i18n"] === "string") {
            return navT(navMessageKey(childProps["data-i18n"]));
          }
          return findInChildren(childProps.children as React.ReactNode);
        }
        return undefined;
      };
      const found = findInChildren(props.children as React.ReactNode);
      if (found) return found;
    }
    return undefined;
  };

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const parent = findParentKey(currentRoute);
    return new Set(parent ? [parent] : []);
  });

  // Keep the active page's parent group expanded as the user navigates, using the
  // "adjust state during render" pattern rather than an effect (avoids a
  // setState-in-effect render cascade).
  const [prevRoute, setPrevRoute] = useState(currentRoute);
  if (currentRoute !== prevRoute) {
    setPrevRoute(currentRoute);
    const parent = findParentKey(currentRoute);
    if (parent && !openGroups.has(parent)) {
      setOpenGroups((prev) => new Set(prev).add(parent));
    }
  }

  const isTeamAdmin = useMemo(() => isUserTeamAdminForAnyTeam(teams ?? null, userId ?? ""), [teams, userId]);

  const filterItemsByRole = (items: MenuItem[]): MenuItem[] => {
    const isAdmin = isAdminRole(userRole);
    return items
      .map((item) => ({ ...item, children: item.children ? filterItemsByRole(item.children) : undefined }))
      .filter((item) => {
        // A parent whose children were all filtered out renders as a leaf link
        // to its own page id, which is not a real route. Drop it instead.
        if (item.children && item.children.length === 0) return false;
        if (item.key === "llm-playground" && isViewOnly) return false;
        if (item.key === "organizations" || item.key === "users") {
          const hasRoleAccess = !item.roles || item.roles.includes(userRole) || isOrgAdmin;
          if (!hasRoleAccess) return false;
          if (!isAdmin && enabledPagesInternalUsers != null) return enabledPagesInternalUsers.includes(item.page);
          return true;
        }
        if (item.key === "projects" && !enableProjectsUI) return false;
        if (
          !isAdmin &&
          item.key === "agents" &&
          disableAgentsForInternalUsers &&
          !(allowAgentsForTeamAdmins && isTeamAdmin)
        )
          return false;
        if (
          !isAdmin &&
          item.key === "vector-stores" &&
          disableVectorStoresForInternalUsers &&
          !(allowVectorStoresForTeamAdmins && isTeamAdmin)
        )
          return false;
        if (item.roles && !item.roles.includes(userRole)) return false;
        if (!isAdmin && enabledPagesInternalUsers != null) {
          if (item.children && item.children.length > 0) {
            const hasVisibleChildren = item.children.some((child) => enabledPagesInternalUsers.includes(child.page));
            if (hasVisibleChildren) return true;
          }
          return enabledPagesInternalUsers.includes(item.page);
        }
        return true;
      });
  };

  const visibleGroups = menuGroups
    .filter((group) => !group.roles || group.roles.includes(userRole))
    .map((group) => ({ groupLabel: group.groupLabel, items: filterItemsByRole(group.items) }))
    .filter((group) => group.items.length > 0);

  const toggleGroup = (key: string) => {
    if (collapsed) {
      onToggleCollapsed?.();
      setOpenGroups((prev) => new Set(prev).add(key));
      return;
    }
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const renderLeaf = (item: MenuItem, isChild: boolean) => {
    const active = selectedKey === item.key;
    const size = isChild ? "sub" : "default";
    const label = (
      <span className="flex-1 truncate group-data-[collapsed=true]/sidebar:hidden">{translateLabel(item.label)}</span>
    );

    if (item.external_url) {
      return (
        <a
          key={item.key}
          href={item.external_url}
          target="_blank"
          rel="noopener noreferrer"
          title={collapsed ? translateLabelForTitle(item.label) : undefined}
          data-active={active || undefined}
          className={cn(sidebarMenuButtonVariants({ isActive: active, size }))}
        >
          {item.icon}
          {label}
          <ExternalLink className="size-3.5 shrink-0 opacity-70 group-data-[collapsed=true]/sidebar:hidden" />
        </a>
      );
    }

    return (
      <Link
        key={item.key}
        href={uiHref(routeOf(item))}
        title={collapsed ? translateLabelForTitle(item.label) : undefined}
        data-active={active || undefined}
        className={cn(sidebarMenuButtonVariants({ isActive: active, size }))}
      >
        {item.icon}
        {label}
      </Link>
    );
  };

  const renderItem = (item: MenuItem) => {
    const isGroup = !!item.children && item.children.length > 0;
    if (!isGroup) {
      return <SidebarMenuItem key={item.key}>{renderLeaf(item, false)}</SidebarMenuItem>;
    }

    const active = selectedKey === item.key;
    const open = openGroups.has(item.key);
    return (
      <SidebarMenuItem key={item.key}>
        <SidebarMenuButton
          isActive={active}
          aria-expanded={open}
          onClick={() => toggleGroup(item.key)}
          title={collapsed ? translateLabelForTitle(item.label) : undefined}
        >
          {item.icon}
          <span className="flex-1 truncate group-data-[collapsed=true]/sidebar:hidden">
            {translateLabel(item.label)}
          </span>
          <ChevronRight
            className={cn(
              "size-4 shrink-0 transition-transform group-data-[collapsed=true]/sidebar:hidden",
              open && "rotate-90",
            )}
          />
        </SidebarMenuButton>
        {open && (
          <SidebarMenuSub>
            {item.children!.map((child) => (
              <SidebarMenuItem key={child.key}>{renderLeaf(child, true)}</SidebarMenuItem>
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    );
  };

  const logoSrc = logoUrl || `${baseUrl}/get_image`;
  const reachableDarkLogo = logoUrlDark === erroredDarkLogo ? null : logoUrlDark;
  const darkLogoSrc = reachableDarkLogo || logoUrl || `${baseUrl}/get_image?theme=dark`;

  return (
    <Sidebar collapsed={collapsed}>
      <SidebarHeader className="h-14 border-b border-border group-data-[collapsed=true]/sidebar:h-auto">
        <div className="flex items-center justify-between gap-2 group-data-[collapsed=true]/sidebar:flex-col">
          <div className="flex min-w-0 items-center gap-2">
            <Link href={uiHref("")} className="flex min-w-0 items-center" aria-label="LiteLLM home">
              <img src={logoSrc} alt="LiteLLM" className={cn(LOGO_CLASS_NAME, "dark:hidden")} />
              <img
                src={darkLogoSrc}
                alt=""
                aria-hidden
                onError={() => setErroredDarkLogo(logoUrlDark)}
                className={cn(LOGO_CLASS_NAME, "hidden dark:block")}
              />
            </Link>
            {version && (
              <Badge
                variant="outline"
                render={<a href="https://docs.litellm.ai/release_notes" target="_blank" rel="noopener noreferrer" />}
                className="px-1.5 py-0 font-mono text-[10px] font-medium text-muted-foreground group-data-[collapsed=true]/sidebar:hidden"
              >
                v{version}
              </Badge>
            )}
          </div>
          {onToggleCollapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex-none text-muted-foreground"
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
          )}
        </div>
      </SidebarHeader>

      <ScrollArea className="min-h-0 flex-1">
        <nav className="flex flex-col gap-0.5 px-3 pb-3">
          {visibleGroups.map((group, gi) => (
            <SidebarGroup key={group.groupLabel}>
              {gi > 0 && <SidebarSeparator className="hidden group-data-[collapsed=true]/sidebar:block" />}
              <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
              <SidebarMenu>{group.items.map((item) => renderItem(item))}</SidebarMenu>
            </SidebarGroup>
          ))}
        </nav>
      </ScrollArea>

      <SidebarFooter>
        {isAdminRole(userRole) && (
          <SidebarUsageCard
            accessToken={accessToken}
            collapsed={collapsed}
            onExpandRail={() => onToggleCollapsed?.()}
          />
        )}
        <SidebarAccountMenu onLogout={logout} collapsed={collapsed} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default Sidebar_;

export { menuGroups };
