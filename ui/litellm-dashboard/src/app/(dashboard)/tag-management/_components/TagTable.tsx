"use client";

import { SortingState, Table } from "@tanstack/react-table";
import { Inbox, SearchX } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { DataTable } from "@/components/shared/DataTable";
import { Tag } from "@/components/tag_management/types";
import { Input } from "@/components/ui/input";

import { getTagTableColumns } from "./tagTableColumns";

interface TagTableProps {
  data: Tag[];
  onEdit: (tag: Tag) => void;
  onDelete: (tagName: string) => void;
  onSelectTag: (tagName: string) => void;
  isLoading?: boolean;
}

const DEFAULT_SORTING: SortingState = [{ id: "created_at", desc: true }];

function EmptyState() {
  const t = useTranslations("tagManagement");
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <Inbox className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">{t("noTags")}</div>
      <div className="text-sm text-muted-foreground">{t("noTagsDesc")}</div>
    </div>
  );
}

function NoMatchingTags() {
  const t = useTranslations("tagManagement");
  return (
    <div className="flex flex-col items-center gap-1 py-6">
      <div className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted">
        <SearchX className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">{t("noMatchingTags")}</div>
      <div className="text-sm text-muted-foreground">{t("noMatchingTagsDesc")}</div>
    </div>
  );
}

function TagFilters({ table }: { table: Table<Tag> }) {
  const t = useTranslations("tagManagement");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        aria-label={t("filterByName")}
        placeholder={t("filterByNamePlaceholder")}
        className="h-8 w-56"
        value={(table.getColumn("name")?.getFilterValue() as string | undefined) ?? ""}
        onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
      />
      <Input
        aria-label={t("filterByDescription")}
        placeholder={t("filterByDescriptionPlaceholder")}
        className="h-8 w-56"
        value={(table.getColumn("description")?.getFilterValue() as string | undefined) ?? ""}
        onChange={(event) => table.getColumn("description")?.setFilterValue(event.target.value)}
      />
    </div>
  );
}

const TagTable: React.FC<TagTableProps> = ({ data, onEdit, onDelete, onSelectTag, isLoading = false }) => {
  const t = useTranslations("tagManagement");
  const [sorting, setSorting] = useState<SortingState>(DEFAULT_SORTING);

  const columns = useMemo(() => getTagTableColumns({ onSelectTag, onEdit, onDelete, t }), [onSelectTag, onEdit, onDelete, t]);

  return (
    <DataTable
      data={data}
      paginationMode="client"
      columns={columns}
      getRowId={(tag, index) => tag.name || String(index)}
      fillHeight
      sortingMode="client"
      sorting={sorting}
      onSortingChange={setSorting}
      isLoading={isLoading}
      loadingMessage={t("loadingTags")}
      filterMode="client"
      toolbar={(table) => <TagFilters table={table} />}
      noDataMessage={data.length === 0 ? <EmptyState /> : <NoMatchingTags />}
      size="compact"
    />
  );
};

export default TagTable;
