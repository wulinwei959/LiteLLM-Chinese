/**
 * Page metadata for UI Settings configuration
 * This file contains descriptions and metadata for all navigation pages
 */

export type PageDescriptionKey =
  | "api-keys"
  | "llm-playground"
  | "models"
  | "agents"
  | "agentic"
  | "workflows"
  | "mcp-servers"
  | "memory"
  | "guardrails"
  | "policies"
  | "search-tools"
  | "tool-policies"
  | "vector-stores"
  | "new_usage"
  | "cost-optimization"
  | "model-insights"
  | "roi-calculator"
  | "logs"
  | "lens"
  | "guardrails-monitor"
  | "users"
  | "teams"
  | "organizations"
  | "projects"
  | "access-groups"
  | "budgets"
  | "api_ref"
  | "model-hub-table"
  | "learning-resources"
  | "caching"
  | "transform-request"
  | "cost-tracking"
  | "ui-theme"
  | "tag-management"
  | "prompts"
  | "skills"
  | "usage"
  | "router-settings"
  | "logging-and-alerts"
  | "admin-panel";

/** Page ids that have a description under the `pageMetadata` namespace. The id is also the message key. */
export const pageDescriptions: Readonly<Record<string, PageDescriptionKey>> = {
  "api-keys": "api-keys",
  "llm-playground": "llm-playground",
  models: "models",
  agents: "agents",
  agentic: "agentic",
  workflows: "workflows",
  "mcp-servers": "mcp-servers",
  memory: "memory",
  guardrails: "guardrails",
  policies: "policies",
  "search-tools": "search-tools",
  "tool-policies": "tool-policies",
  "vector-stores": "vector-stores",
  new_usage: "new_usage",
  "cost-optimization": "cost-optimization",
  "model-insights": "model-insights",
  "roi-calculator": "roi-calculator",
  logs: "logs",
  lens: "lens",
  "guardrails-monitor": "guardrails-monitor",
  users: "users",
  teams: "teams",
  organizations: "organizations",
  projects: "projects",
  "access-groups": "access-groups",
  budgets: "budgets",
  api_ref: "api_ref",
  "model-hub-table": "model-hub-table",
  "learning-resources": "learning-resources",
  caching: "caching",
  "transform-request": "transform-request",
  "cost-tracking": "cost-tracking",
  "ui-theme": "ui-theme",
  "tag-management": "tag-management",
  prompts: "prompts",
  skills: "skills",
  usage: "usage",
  "router-settings": "router-settings",
  "logging-and-alerts": "logging-and-alerts",
  "admin-panel": "admin-panel",
};

export interface PageMetadata {
  page: string;
  label: string;
  group: string;
  description: string;
}
