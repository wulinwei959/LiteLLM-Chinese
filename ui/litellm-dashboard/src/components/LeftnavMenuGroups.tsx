import React from "react";
import { projectReaderRoles } from "@/app/(dashboard)/hooks/projects/projectAccess";

import {
  Activity,
  Aperture,
  BarChart3,
  Bell,
  Blocks,
  Bot,
  BookOpen,
  Building2,
  Boxes,
  Code2,
  Database,
  FileText,
  FlaskConical,
  Folder,
  HeartPulse,
  KeyRound,
  LayoutGrid,
  Network,
  Palette,
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
  Trophy,
  User,
  Users,
  Wallet,
  Wrench,
  Workflow,
  Calculator,
} from "lucide-react";
import { rolesWithCapability } from "../utils/capabilities";
import {
  all_admin_roles,
  internalUserRoles,
  rolesAllowedToViewWriteScopedPages,
  rolesWithWriteAccess,
} from "../utils/roles";
import BetaBadge from "./BetaBadge";

import type { MenuGroup } from "./leftnav";

const ICON = { strokeWidth: 1.75 } as const;

export const menuGroups: MenuGroup[] = [
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
        key: "model-insights",
        page: "model-insights",
        icon: <Trophy {...ICON} />,
        roles: all_admin_roles,
        label: (
          <span className="flex items-center gap-2">
            <span data-i18n="nav.modelLeaderboard" /> <BetaBadge />
          </span>
        ),
      },
      {
        key: "roi-calculator",
        page: "roi-calculator",
        icon: <Calculator {...ICON} />,
        roles: all_admin_roles,
        label: (
          <span className="flex items-center gap-2">
            <span data-i18n="nav.roiCalculator" /> <BetaBadge />
          </span>
        ),
      },
      {
        key: "cost-optimization",
        page: "cost-optimization",
        icon: <PiggyBank {...ICON} />,
        roles: [...all_admin_roles, ...internalUserRoles],
        label: "nav.costOptimization",
      },
      { key: "logs", page: "logs", label: "nav.logs", icon: <Activity {...ICON} /> },
      {
        key: "lens",
        page: "lens",
        label: (
          <span className="flex items-center gap-2">
            <span data-i18n="nav.lens" /> <BetaBadge />
          </span>
        ),
        icon: <Aperture {...ICON} />,
      },
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
        roles: [...projectReaderRoles],
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
