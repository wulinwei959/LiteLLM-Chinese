"use client";

import { MCPServer } from "@/components/mcp_tools/types";

export type StandardsKey =
  | "mcpStandards.documentation"
  | "mcpStandards.description"
  | "mcpStandards.descriptionDesc"
  | "mcpStandards.alias"
  | "mcpStandards.aliasDesc"
  | "mcpStandards.source"
  | "mcpStandards.sourceUrl"
  | "mcpStandards.sourceUrlDesc"
  | "mcpStandards.connection"
  | "mcpStandards.url"
  | "mcpStandards.urlDesc"
  | "mcpStandards.security"
  | "mcpStandards.authConfigured"
  | "mcpStandards.authConfiguredDesc";

export interface RequiredFieldDef {
  key: string;
  label: StandardsKey;
  description: StandardsKey;
  check: (server: MCPServer) => boolean;
}

export interface FieldGroup {
  label: StandardsKey;
  fields: RequiredFieldDef[];
}

export const FIELD_GROUPS: FieldGroup[] = [
  {
    label: "mcpStandards.documentation",
    fields: [
      {
        key: "description",
        label: "mcpStandards.description",
        description: "mcpStandards.descriptionDesc",
        check: (s) => !!s.description?.trim(),
      },
      {
        key: "alias",
        label: "mcpStandards.alias",
        description: "mcpStandards.aliasDesc",
        check: (s) => !!s.alias?.trim(),
      },
    ],
  },
  {
    label: "mcpStandards.source",
    fields: [
      {
        key: "source_url",
        label: "mcpStandards.sourceUrl",
        description: "mcpStandards.sourceUrlDesc",
        check: (s) => !!s.source_url?.trim(),
      },
    ],
  },
  {
    label: "mcpStandards.connection",
    fields: [
      {
        key: "url",
        label: "mcpStandards.url",
        description: "mcpStandards.urlDesc",
        check: (s) => !!s.url?.trim(),
      },
    ],
  },
  {
    label: "mcpStandards.security",
    fields: [
      {
        key: "auth_type",
        label: "mcpStandards.authConfigured",
        description: "mcpStandards.authConfiguredDesc",
        check: (s) => !!s.auth_type && s.auth_type !== "none",
      },
    ],
  },
];

export const MCP_REQUIRED_FIELD_DEFS: RequiredFieldDef[] = FIELD_GROUPS.flatMap((g) => g.fields);

export const SETTINGS_KEY = "mcp_required_fields";
