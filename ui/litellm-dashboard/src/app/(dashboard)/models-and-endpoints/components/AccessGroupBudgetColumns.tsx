"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";

import { getBudgetDurationLabel } from "@/components/common_components/budget_duration_dropdown";
import { DataTableSortHeader } from "@/components/shared/DataTable";
import { ModelsCell, SpendBudgetCell } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { ModelAccessGroup } from "@/app/(dashboard)/hooks/modelAccessGroups/useModelAccessGroups";

const budgetDecimals = (maxBudget: number | null | undefined): number =>
  maxBudget != null && maxBudget > 0 && maxBudget < 0.01 ? 5 : 2;

/**
 * A group name is a free-text path segment on the budget routes, so a `/` in it splits the path and
 * no encoding recovers it. Such a group is listed but its budget is unreachable.
 */
export const isBudgetAddressable = (accessGroup: string): boolean => !accessGroup.includes("/");

const writeBlockedReason = (
  accessGroup: ModelAccessGroup,
  canWrite: boolean,
  onlyAdminReason: string,
  slashNameReason: string,
): string | undefined => {
  if (!canWrite) return onlyAdminReason;
  if (!isBudgetAddressable(accessGroup.access_group)) {
    return slashNameReason;
  }
  return undefined;
};

interface AccessGroupRowActionsProps {
  accessGroup: ModelAccessGroup;
  canWrite: boolean;
  onSetBudget: (accessGroup: ModelAccessGroup) => void;
  onClearBudget: (accessGroup: ModelAccessGroup) => void;
}

function AccessGroupRowActions({ accessGroup, canWrite, onSetBudget, onClearBudget }: AccessGroupRowActionsProps) {
  const t = useTranslations("models");
  const hasBudget = accessGroup.budget != null;
  const blocked = writeBlockedReason(
    accessGroup,
    canWrite,
    t("accessGroupBudget.onlyAdminCanChange"),
    t("accessGroupBudget.slashInName"),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("accessGroupBudget.actions", { group: accessGroup.access_group })}
        data-testid={`access-group-actions-${accessGroup.access_group}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          disabled={blocked !== undefined}
          title={blocked}
          data-testid="access-group-action-set-budget"
          onClick={() => onSetBudget(accessGroup)}
        >
          <Wallet />
          {hasBudget ? t("accessGroupBudget.editBudget") : t("accessGroupBudget.setBudget")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={blocked !== undefined || !hasBudget}
          data-testid="access-group-action-clear-budget"
          title={blocked ?? (hasBudget ? undefined : t("accessGroupBudget.noBudgetToClear"))}
          onClick={() => onClearBudget(accessGroup)}
        >
          <Trash2 />
          {t("accessGroupBudget.clearBudget")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AccessGroupBudgetColumnsDeps {
  canWrite: boolean;
  onSetBudget: (accessGroup: ModelAccessGroup) => void;
  onClearBudget: (accessGroup: ModelAccessGroup) => void;
}

export const getAccessGroupBudgetColumns = ({
  canWrite,
  onSetBudget,
  onClearBudget,
}: AccessGroupBudgetColumnsDeps): ColumnDef<ModelAccessGroup>[] => {
  const t = useTranslations("models");
  return [
    {
      id: "access_group",
      accessorKey: "access_group",
      meta: { title: t("accessGroupBudget.accessGroup") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("accessGroupBudget.accessGroup")} />,
      size: 220,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="block max-w-56 truncate font-mono text-xs" title={row.original.access_group}>
          {row.original.access_group}
        </span>
      ),
    },
    {
      id: "models",
      meta: { title: t("accessGroupBudget.models"), skeleton: "chips" },
      header: t("accessGroupBudget.models"),
      size: 280,
      enableSorting: false,
      cell: ({ row }) => <ModelsCell models={row.original.model_names} />,
    },
    {
      id: "deployment_count",
      accessorKey: "deployment_count",
      meta: { title: t("accessGroupBudget.deployments"), numeric: true },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("accessGroupBudget.deployments")} />,
      size: 120,
      enableSorting: true,
      cell: ({ row }) => row.original.deployment_count,
    },
    {
      id: "spend",
      accessorKey: "spend",
      meta: { title: t("accessGroupBudget.sharedSpend") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("accessGroupBudget.sharedSpend")} />,
      size: 180,
      enableSorting: true,
      cell: ({ row }) => (
        <SpendBudgetCell
          spend={row.original.spend}
          maxBudget={row.original.budget?.max_budget}
          budgetDecimals={budgetDecimals(row.original.budget?.max_budget)}
        />
      ),
    },
    {
      id: "budget_duration",
      meta: { title: t("accessGroupBudget.resets") },
      header: t("accessGroupBudget.resets"),
      size: 110,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {getBudgetDurationLabel(row.original.budget?.budget_duration)}
        </span>
      ),
    },
    {
      id: "actions",
      meta: { className: "text-right", headerClassName: "text-right" },
      header: () => <span className="sr-only">{t("accessGroupBudget.actions")}</span>,
      size: 64,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <AccessGroupRowActions
            accessGroup={row.original}
            canWrite={canWrite}
            onSetBudget={onSetBudget}
            onClearBudget={onClearBudget}
          />
        </div>
      ),
    },
  ];
};
