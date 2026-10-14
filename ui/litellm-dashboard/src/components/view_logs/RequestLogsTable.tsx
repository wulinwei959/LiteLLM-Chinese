"use client";

import type { ColumnFiltersState, OnChangeFn, PaginationState, SortingState } from "@tanstack/react-table";
import { ScrollText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState, type ReactNode } from "react";

import { useUserEmailLookup } from "@/app/(dashboard)/hooks/users/useUsers";
import { DataTable, DataTableFilterDrawer, DataTableToolbar } from "@/components/shared/DataTable";
import type { LogsTranslator } from "@/lib/i18n/translators";

import type { Team } from "../key_team_helpers/key_list";
import type { LogEntry } from "./columns";
import { CREDENTIAL_LABEL_KEYS, SPAN_TYPE_LABEL_KEYS } from "./constants";
import { LOG_FILTER_IDS, LOG_FILTER_LABEL_KEYS, type LogsWindow } from "./log_filter_logic";
import { RequestLogsFilters } from "./RequestLogsFilters";
import { getRequestLogsTableColumns } from "./RequestLogsTableColumns";

interface RequestLogsTableProps {
  data: LogEntry[];
  rowCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  columnFilters: ColumnFiltersState;
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onRowClick: (log: LogEntry) => void;
  onKeyHashClick: (keyHash: string) => void;
  onSessionClick: (log: LogEntry) => void;
  teams: Team[];
  logsWindow: LogsWindow;
  toolbarChildren?: ReactNode;
}

const formatFilterValue = (t: LogsTranslator, columnId: string, value: unknown): string => {
  if (columnId === LOG_FILTER_IDS.SPAN_TYPE) {
    const spanTypeKey = SPAN_TYPE_LABEL_KEYS[String(value)];
    return spanTypeKey === undefined ? String(value) : t(spanTypeKey);
  }
  if (columnId === LOG_FILTER_IDS.CREDENTIAL) {
    const credentialKey = CREDENTIAL_LABEL_KEYS[String(value)];
    return credentialKey === undefined ? String(value) : t(credentialKey);
  }
  return Array.isArray(value) ? value.join(", ") : String(value);
};

function RequestLogsEmptyState({ filtered }: { filtered: boolean }) {
  const t = useTranslations("logs");
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <ScrollText className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {filtered ? t("table.emptyFiltered") : t("table.empty")}
      </div>
      <div className="max-w-xs text-center text-sm text-muted-foreground">
        {filtered ? t("table.emptyFilteredDesc") : t("table.emptyDesc")}
      </div>
    </div>
  );
}

export function RequestLogsTable({
  data,
  rowCount,
  isLoading,
  isRefreshing,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnFilters,
  onColumnFiltersChange,
  searchValue,
  onSearchChange,
  onRefresh,
  onRowClick,
  onKeyHashClick,
  onSessionClick,
  teams,
  logsWindow,
  toolbarChildren,
}: RequestLogsTableProps) {
  const t = useTranslations("logs");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const userIds = useMemo(() => data.flatMap((log) => (log.user ? [log.user] : [])), [data]);
  const { data: emailByUserId } = useUserEmailLookup(userIds);

  const columns = useMemo(() => {
    const resolveUserEmail = (userId: string) => emailByUserId?.[userId];
    const deps = { onKeyHashClick, onSessionClick, resolveUserEmail, t };
    return getRequestLogsTableColumns(deps);
  }, [onKeyHashClick, onSessionClick, emailByUserId, t]);

  const filterLabels = useMemo(
    () =>
      Object.fromEntries(Object.entries(LOG_FILTER_LABEL_KEYS).map(([columnId, labelKey]) => [columnId, t(labelKey)])),
    [t],
  );

  const isFiltered = columnFilters.length > 0 || searchValue !== "";

  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.request_id}
      fillHeight
      sortingMode="server"
      sorting={sorting}
      onSortingChange={onSortingChange}
      paginationMode="server"
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      rowCount={rowCount}
      filterMode="server"
      columnFilters={columnFilters}
      onColumnFiltersChange={onColumnFiltersChange}
      isLoading={isLoading}
      loadingMessage={t("table.loadingMessage")}
      noDataMessage={<RequestLogsEmptyState filtered={isFiltered} />}
      size="compact"
      onRowClick={onRowClick}
      toolbar={(table) => (
        <>
          <DataTableToolbar
            table={table}
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            searchPlaceholder={t("table.searchPlaceholder")}
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            onOpenFilters={() => setFiltersOpen(true)}
            filterLabels={filterLabels}
            formatFilterValue={(columnId, value) => formatFilterValue(t, columnId, value)}
            showViewOptions={false}
          >
            {toolbarChildren}
          </DataTableToolbar>
          <DataTableFilterDrawer
            table={table}
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            title={t("table.filtersTitle")}
            description={t("table.filtersDescription")}
          >
            {({ get, set }) => <RequestLogsFilters get={get} set={set} teams={teams} logsWindow={logsWindow} />}
          </DataTableFilterDrawer>
        </>
      )}
    />
  );
}
