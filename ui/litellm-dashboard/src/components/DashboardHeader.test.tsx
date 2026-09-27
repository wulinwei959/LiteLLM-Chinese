import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen } from "@testing-library/react";
import { DashboardHeader } from "./DashboardHeader";
import { NAV_PRODUCT_LINK_CLASS } from "@/components/Navbar/navProductLinkClass";
import { renderWithProviders } from "@tests/test-utils";

const { mockUsePluginMode, mockUseUISettings, state } = vi.hoisted(() => {
  const state = {
    plugins: [] as { name: string; display_name: string; url: string }[],
    enableChatUI: false,
    pathname: "/ui/logs",
  };
  return {
    state,
    mockUsePluginMode: vi.fn(() => ({ mode: "ai-gateway", setMode: vi.fn(), plugins: state.plugins })),
    mockUseUISettings: vi.fn(() => ({ data: { values: { enable_chat_ui: state.enableChatUI } } })),
  };
});

vi.mock("@/contexts/PluginModeContext", () => ({ usePluginMode: mockUsePluginMode }));
vi.mock("@/app/(dashboard)/hooks/uiSettings/useUISettings", () => ({ useUISettings: mockUseUISettings }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));
vi.mock("@/hooks/useWorker", () => ({ useWorker: () => ({ isControlPlane: false, selectedWorker: null }) }));
vi.mock("@/app/(dashboard)/hooks/useDisableShowPrompts", () => ({ useDisableShowPrompts: () => false }));
vi.mock("@/components/Navbar/BlogDropdown/BlogDropdown", () => ({ BlogDropdown: () => null }));
vi.mock("@/components/Navbar/CommunityEngagementButtons/CommunityEngagementButtons", () => ({
  CommunityEngagementButtons: () => null,
}));
vi.mock("@/components/Navbar/NotificationsBell/NotificationsBell", () => ({ NotificationsBell: () => null }));
vi.mock("@/components/Navbar/WorkerDropdown/WorkerDropdown", () => ({ default: () => null }));
// Mock next-intl with English translations
const mockTranslations: Record<string, string> = {
  aiGateway: "AI Gateway",
  observability: "Observability",
  accessControl: "Access Control",
  developerTools: "Developer Tools",
  settings: "Settings",
  virtualKeys: "Virtual Keys",
  playground: "Playground",
  modelsAndEndpoints: "Models + Endpoints",
  agentic: "Agentic",
  agents: "Agents",
  workflowRuns: "Workflow Runs",
  memory: "Memory",
  mcpServers: "MCP Servers",
  skills: "Skills",
  guardrails: "Guardrails",
  policies: "Policies",
  tools: "Tools",
  searchTools: "Search Tools",
  vectorStores: "Vector Stores",
  toolPolicies: "Tool Policies",
  usage: "Usage",
  costOptimization: "Cost Optimization",
  logs: "Logs",
  guardrailsMonitor: "Guardrails Monitor",
  teams: "Teams",
  projects: "Projects",
  internalUsers: "Internal Users",
  organizations: "Organizations",
  accessGroups: "Access Groups",
  budgets: "Budgets",
  apiReference: "API Reference",
  aiHub: "AI Hub",
  learningResources: "Learning Resources",
  responseCache: "Response Cache",
  experimental: "Experimental",
  prompts: "Prompts",
  apiPlayground: "API Playground",
  tagManagement: "Tag Management",
  oldUsage: "Old Usage",
  routerSettings: "Router Settings",
  loggingAndAlerts: "Logging & Alerts",
  adminSettings: "Admin Settings",
  costTracking: "Cost Tracking",
  uiTheme: "UI Theme",
};

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => mockTranslations[key] ?? key,
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe("DashboardHeader breadcrumb", () => {
  afterEach(() => {
    state.plugins = [];
    state.enableChatUI = false;
    state.pathname = "/ui/logs";
  });

  it("titles the breadcrumb from the current route, not from a sidebar page id", () => {
    state.pathname = "/ui/models-and-endpoints";
    renderWithProviders(<DashboardHeader />);

    expect(screen.getByText("Models + Endpoints")).toBeInTheDocument();
  });

  it("titles the dashboard root as Virtual Keys", () => {
    state.pathname = "/ui/";
    renderWithProviders(<DashboardHeader />);

    expect(screen.getByText("Virtual Keys")).toBeInTheDocument();
  });

  it("titles the breadcrumb from the current route when the selector is available", () => {
    state.pathname = "/ui/logs";
    state.plugins = [{ name: "chat", display_name: "Chat", url: "/chat" }];
    state.enableChatUI = true;
    renderWithProviders(<DashboardHeader />);

    expect(screen.getByText("Logs")).toBeInTheDocument();
  });

  it("roots the breadcrumb in the AI Gateway selector (with a Chat option) and drops the static section crumb when the selector is available", () => {
    state.pathname = "/ui/logs";
    state.plugins = [{ name: "chat", display_name: "Chat", url: "/chat" }];
    state.enableChatUI = true;
    renderWithProviders(<DashboardHeader />);

    expect(screen.getByText("AI Gateway")).toBeInTheDocument();
    expect(screen.queryByText("Observability")).not.toBeInTheDocument();
  });

  it("keeps the AI Gateway selector at the root even when there is nothing to switch to (discovery)", () => {
    state.pathname = "/ui/logs";
    state.plugins = [];
    state.enableChatUI = false;
    renderWithProviders(<DashboardHeader />);

    expect(screen.getByText("AI Gateway")).toBeInTheDocument();
    expect(screen.getByText("Logs")).toBeInTheDocument();
  });

  it("renders the Docs link with the shared product-link class instead of a muted toolbar button", () => {
    renderWithProviders(<DashboardHeader />);

    const docsLink = screen.getByRole("link", { name: /docs/i });
    expect(docsLink).toHaveClass(NAV_PRODUCT_LINK_CLASS);
  });
});