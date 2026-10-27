"use client";

import { Building2, SearchX } from "lucide-react";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/shared/DataTable";
import { Organization } from "@/components/networking";

import { getOrganizationsTableColumns } from "./OrganizationsTableColumns";
import { useOrganizationsTableState } from "./useOrganizationsTableState";

interface OrganizationsTableProps {
  organizations: Organization[];
  isLoading: boolean;
  userRole: string;
  searchActive: boolean;
  onOrganizationClick: (organizationId: string) => void;
  onEditClick: (organizationId: string) => void;
  onDeleteClick: (organizationId: string) => void;
}

function EmptyState({ searchActive }: { searchActive: boolean }) {
  const t = useTranslations("organizations");
  const Icon = searchActive ? SearchX : Building2;
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">
        {searchActive ? t("noMatchingOrganizations") : t("noOrganizationsYet")}
      </div>
      <div className="text-sm text-muted-foreground">{searchActive ? t("searchNoMatchHint") : t("createOrgHint")}</div>
    </div>
  );
}

const OrganizationsTable: React.FC<OrganizationsTableProps> = ({
  organizations,
  isLoading,
  userRole,
  searchActive,
  onOrganizationClick,
  onEditClick,
  onDeleteClick,
}) => {
  const t = useTranslations("organizations");
  const { sorting, onSortingChange, pagination, onPaginationChange } = useOrganizationsTableState();

  const columns = useMemo(() => {
    const deps = { userRole, onOrganizationClick, onEditClick, onDeleteClick, t };
    return getOrganizationsTableColumns(deps);
  }, [userRole, onOrganizationClick, onEditClick, onDeleteClick, t]);

  return (
    <DataTable
      data={organizations}
      paginationMode="client"
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      columns={columns}
      getRowId={(organization, index) => organization.organization_id || String(index)}
      defaultColumnVisibility={{ tpm_limit: false, rpm_limit: false }}
      sortingMode="client"
      sorting={sorting}
      onSortingChange={onSortingChange}
      isLoading={isLoading}
      loadingMessage={t("tableLoading")}
      noDataMessage={<EmptyState searchActive={searchActive} />}
      size="compact"
    />
  );
};

export default OrganizationsTable;
