"use client";

import { ColumnFiltersState, OnChangeFn, PaginationState } from "@tanstack/react-table";
import { ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import {
  DataTable,
  DataTableFilterDrawer,
  DataTableFilterField,
  DataTableToolbar,
} from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LogsTranslator } from "@/lib/i18n/translators";

import {
  AuditLogEntry,
  auditActionLabel,
  auditTableNameLabel,
  getAuditLogsTableColumns,
} from "./AuditLogsTableColumns";

interface AuditLogsTableProps {
  data: AuditLogEntry[];
  rowCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh: () => void;
  onViewLog: (log: AuditLogEntry) => void;
}

const ALL_VALUE = "all";

/** Raw `action`/`table_name` values the proxy filters on; only their labels are translated. */
const ACTION_VALUES = ["created", "updated", "deleted", "rotated", "kill_switch_fired"];

const TABLE_VALUES = [
  "LiteLLM_VerificationToken",
  "LiteLLM_TeamTable",
  "LiteLLM_UserTable",
  "LiteLLM_OrganizationTable",
  "LiteLLM_ProxyModelTable",
  "LiteLLM_AgentsTable",
];

const formatFilterValue = (t: LogsTranslator, columnId: string, value: unknown): string => {
  const raw = String(value);
  if (columnId === "action") {
    return auditActionLabel(t, raw);
  }
  if (columnId === "table_name") {
    return auditTableNameLabel(t, raw);
  }
  return raw;
};

function AuditLogsEmptyState({ filtered }: { filtered: boolean }) {
  const t = useTranslations("logs");
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <ScrollText className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {filtered ? t("auditLogs.emptyFiltered") : t("auditLogs.empty")}
      </div>
      <div className="max-w-xs text-center text-sm text-muted-foreground">
        {filtered ? t("auditLogs.emptyFilteredDesc") : t("auditLogs.emptyDesc")}
      </div>
    </div>
  );
}

export function AuditLogsTable({
  data,
  rowCount,
  isLoading,
  isRefreshing,
  pagination,
  onPaginationChange,
  columnFilters,
  onColumnFiltersChange,
  searchValue,
  onSearchChange,
  onRefresh,
  onViewLog,
}: AuditLogsTableProps) {
  const t = useTranslations("logs");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const columns = useMemo(() => getAuditLogsTableColumns({ onViewLog, t }), [onViewLog, t]);
  const hasActiveSearch = Boolean(searchValue?.trim());

  const actionOptions = ACTION_VALUES.map((value) => ({ value, label: auditActionLabel(t, value) }));
  const tableOptions = TABLE_VALUES.map((value) => ({ value, label: auditTableNameLabel(t, value) }));
  const actionFilterItems = [{ value: ALL_VALUE, label: t("auditLogs.allActions") }, ...actionOptions];
  const tableFilterItems = [{ value: ALL_VALUE, label: t("auditLogs.allTables") }, ...tableOptions];
  const filterLabels: Record<string, string> = {
    object_id: t("auditLogs.columns.objectId"),
    changed_by: t("auditLogs.columns.changedBy"),
    team_id: t("filters.teamId"),
    key_hash: t("filters.keyHash"),
    action: t("auditLogs.columns.action"),
    table_name: t("auditLogs.columns.table"),
  };

  return (
    <DataTable
      fillHeight
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      paginationMode="server"
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowCount={rowCount}
      filterMode="server"
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      isLoading={isLoading}
      loadingMessage={t("auditLogs.loading")}
      noDataMessage={<AuditLogsEmptyState filtered={columnFilters.length > 0 || hasActiveSearch} />}
      size="compact"
      toolbar={(table) => (
        <>
          <DataTableToolbar
            table={table}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={t("auditLogs.searchPlaceholder")}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            onOpenFilters={() => setFiltersOpen(true)}
            filterLabels={filterLabels}
            formatFilterValue={(columnId, value) => formatFilterValue(t, columnId, value)}
            showViewOptions={false}
          />
          <DataTableFilterDrawer
            table={table}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            title={t("auditLogs.filters")}
            description={t("auditLogs.filtersDesc")}
          >
            {({ get, set }) => (
              <>
                <DataTableFilterField label={filterLabels.object_id}>
                  <Input
                    value={(get("object_id") as string) ?? ""}
                    onChange={(event) => set("object_id", event.target.value)}
                    placeholder={t("filters.placeholders.enterObjectId")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={filterLabels.changed_by}>
                  <Input
                    value={(get("changed_by") as string) ?? ""}
                    onChange={(event) => set("changed_by", event.target.value)}
                    placeholder={t("filters.placeholders.enterUserId")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={filterLabels.team_id}>
                  <Input
                    value={(get("team_id") as string) ?? ""}
                    onChange={(event) => set("team_id", event.target.value)}
                    placeholder={t("filters.placeholders.enterTeamId")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={filterLabels.key_hash}>
                  <Input
                    value={(get("key_hash") as string) ?? ""}
                    onChange={(event) => set("key_hash", event.target.value)}
                    placeholder={t("filters.placeholders.enterKeyHash")}
                  />
                </DataTableFilterField>
                <DataTableFilterField label={filterLabels.action}>
                  <Select
                    items={actionFilterItems}
                    value={(get("action") as string) ?? ALL_VALUE}
                    onValueChange={(value) => set("action", value === ALL_VALUE ? undefined : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("auditLogs.allActions")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>{t("auditLogs.allActions")}</SelectItem>
                      {actionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DataTableFilterField>
                <DataTableFilterField label={filterLabels.table_name}>
                  <Select
                    items={tableFilterItems}
                    value={(get("table_name") as string) ?? ALL_VALUE}
                    onValueChange={(value) => set("table_name", value === ALL_VALUE ? undefined : value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("auditLogs.allTables")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>{t("auditLogs.allTables")}</SelectItem>
                      {tableOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DataTableFilterField>
              </>
            )}
          </DataTableFilterDrawer>
        </>
      )}
    />
  );
}
