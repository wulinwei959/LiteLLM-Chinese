"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DateCell, IdCell, IdentityCell, StatusBadge, type StatusTone } from "@/components/shared/table_cells";
import type { LogsTranslator } from "@/lib/i18n/translators";

import DefaultProxyAdminTag from "../../common_components/DefaultProxyAdminTag";

export type AuditLogEntry = {
  id: string;
  updated_at: string;
  changed_by: string;
  changed_by_api_key: string;
  action: string;
  table_name: string;
  object_id: string;
  before_value: Record<string, unknown>;
  updated_values: Record<string, unknown>;
};

export type AuditTableNameKey =
  | "auditLogs.tables.keys"
  | "auditLogs.tables.teams"
  | "auditLogs.tables.users"
  | "auditLogs.tables.organizations"
  | "auditLogs.tables.models"
  | "auditLogs.tables.agents";

/** The `table_name` values the proxy writes; anything unmapped renders as sent. */
export const AUDIT_TABLE_NAME_KEYS: Record<string, AuditTableNameKey> = {
  LiteLLM_VerificationToken: "auditLogs.tables.keys",
  LiteLLM_TeamTable: "auditLogs.tables.teams",
  LiteLLM_UserTable: "auditLogs.tables.users",
  LiteLLM_OrganizationTable: "auditLogs.tables.organizations",
  LiteLLM_ProxyModelTable: "auditLogs.tables.models",
  LiteLLM_AgentsTable: "auditLogs.tables.agents",
};

export const auditTableNameLabel = (t: LogsTranslator, tableName: string): string => {
  const key = AUDIT_TABLE_NAME_KEYS[tableName];
  return key === undefined ? tableName : t(key);
};

export type AuditActionKey =
  | "auditLogs.actions.created"
  | "auditLogs.actions.updated"
  | "auditLogs.actions.deleted"
  | "auditLogs.actions.rotated"
  | "auditLogs.actions.killSwitchFired";

const ACTION_LABEL_KEYS: Record<string, AuditActionKey> = {
  created: "auditLogs.actions.created",
  updated: "auditLogs.actions.updated",
  deleted: "auditLogs.actions.deleted",
  rotated: "auditLogs.actions.rotated",
  kill_switch_fired: "auditLogs.actions.killSwitchFired",
};

const ACTION_TONE: Record<string, StatusTone> = {
  created: "success",
  updated: "info",
  deleted: "error",
  rotated: "warning",
  kill_switch_fired: "error",
};

export const auditActionLabel = (t: LogsTranslator, action: string): string => {
  const key = ACTION_LABEL_KEYS[action];
  if (key !== undefined) return t(key);
  const words = action.replace(/_/g, " ");
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : words;
};

interface AuditLogsTableColumnsDeps {
  onViewLog: (log: AuditLogEntry) => void;
  t: LogsTranslator;
}

export const getAuditLogsTableColumns = ({ onViewLog, t }: AuditLogsTableColumnsDeps): ColumnDef<AuditLogEntry>[] => [
  {
    id: "updated_at",
    accessorKey: "updated_at",
    header: t("auditLogs.columns.timestamp"),
    size: 200,
    enableSorting: false,
    cell: ({ row }) => <DateCell value={row.original.updated_at} />,
  },
  {
    id: "action",
    accessorKey: "action",
    header: t("auditLogs.columns.action"),
    size: 110,
    enableSorting: false,
    cell: ({ row }) => (
      <StatusBadge
        tone={ACTION_TONE[row.original.action] ?? "neutral"}
        label={auditActionLabel(t, row.original.action)}
      />
    ),
  },
  {
    id: "table_name",
    accessorKey: "table_name",
    header: t("auditLogs.columns.table"),
    size: 130,
    enableSorting: false,
    cell: ({ row }) => <span className="text-sm">{auditTableNameLabel(t, row.original.table_name)}</span>,
  },
  {
    id: "object_id",
    accessorKey: "object_id",
    header: t("auditLogs.columns.objectId"),
    minSize: 220,
    enableSorting: false,
    cell: ({ row }) => (
      <IdentityCell
        title={row.original.object_id}
        titleClassName="font-mono text-xs font-normal text-primary"
        className="max-w-72"
        onClick={() => onViewLog(row.original)}
      />
    ),
  },
  {
    id: "changed_by",
    accessorKey: "changed_by",
    header: t("auditLogs.columns.changedBy"),
    size: 200,
    enableSorting: false,
    cell: ({ row }) => <DefaultProxyAdminTag userId={row.original.changed_by} />,
  },
  {
    id: "changed_by_api_key",
    accessorKey: "changed_by_api_key",
    header: t("auditLogs.columns.apiKeyHash"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => <IdCell value={row.original.changed_by_api_key} variant="plain" />,
  },
];
