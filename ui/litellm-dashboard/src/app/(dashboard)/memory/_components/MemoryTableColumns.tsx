"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { MemoryTranslator } from "@/lib/i18n/translators";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { MemoryRow } from "@/components/networking";
import { DateCell, IdCell, IdentityCell } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { teamDetailHref, userDetailHref } from "@/utils/entityLinks";

interface MemoryRowActionsProps {
  t: MemoryTranslator;
  row: MemoryRow;
  onViewClick: (row: MemoryRow) => void;
  onEditClick: (row: MemoryRow) => void;
  onDeleteClick: (row: MemoryRow) => void;
}

function MemoryRowActions({ row, onViewClick, onEditClick, onDeleteClick, t }: MemoryRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open memory actions"
        data-testid={`memory-actions-${row.memory_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem data-testid="memory-action-view" onClick={() => onViewClick(row)}>
          <Eye />
          View
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="memory-action-edit" onClick={() => onEditClick(row)}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" data-testid="memory-action-delete" onClick={() => onDeleteClick(row)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export interface MemoryTableColumnsDeps {
  t: MemoryTranslator;
  onViewClick: (row: MemoryRow) => void;
  onEditClick: (row: MemoryRow) => void;
  onDeleteClick: (row: MemoryRow) => void;
}

export const getMemoryTableColumns = ({
  onViewClick,
  onEditClick,
  onDeleteClick,
  t,
}: MemoryTableColumnsDeps): ColumnDef<MemoryRow>[] => [
  {
    id: "memory_id",
    accessorKey: "memory_id",
    meta: { title: t("idCol") },
    header: t("idCol"),
    size: 180,
    enableSorting: false,
    cell: ({ row }) => (
      <IdentityCell
        title={row.original.memory_id}
        titleClassName="font-mono text-xs font-normal"
        onClick={() => onViewClick(row.original)}
      />
    ),
  },
  {
    id: "key",
    accessorKey: "key",
    meta: { title: t("nameCol") },
    header: t("nameCol"),
    size: 200,
    enableSorting: false,
    cell: ({ row }) => (
      <span className="block max-w-52 truncate font-mono text-xs" title={row.original.key}>
        {row.original.key}
      </span>
    ),
  },
  {
    id: "value",
    accessorKey: "value",
    meta: { title: t("previewCol") },
    header: t("previewCol"),
    enableSorting: false,
    cell: ({ row }) => (
      <span className="block max-w-72 truncate text-sm text-muted-foreground" title={row.original.value}>
        {row.original.value || "-"}
      </span>
    ),
  },
  {
    id: "user_id",
    accessorKey: "user_id",
    meta: { title: t("userId") },
    header: t("userId"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      const userId = row.original.user_id;
      return <IdCell value={userId} href={userId ? userDetailHref(userId) : undefined} />;
    },
  },
  {
    id: "team_id",
    accessorKey: "team_id",
    meta: { title: t("teamId") },
    header: t("teamId"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      const teamId = row.original.team_id;
      return <IdCell value={teamId} href={teamId ? teamDetailHref(teamId) : undefined} />;
    },
  },
  {
    id: "updated_at",
    accessorKey: "updated_at",
    meta: { title: t("updatedCol") },
    header: t("updatedCol"),
    size: 170,
    enableSorting: false,
    cell: ({ row }) => <DateCell value={row.original.updated_at} />,
  },
  {
    id: "actions",
    meta: { className: "text-right", headerClassName: "text-right" },
    header: () => <span className="sr-only">{t("actions")}</span>,
    size: 64,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <MemoryRowActions
          row={row.original}
          onViewClick={onViewClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          t={t}
        />
      </div>
    ),
  },
];
