"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { DateCell, IdentityCell, StatusBadge } from "@/components/shared/table_cells";
import { Policy } from "@/components/policies/types";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import type { PoliciesTranslator } from "@/lib/i18n/translators";

export interface PolicyRow {
  policy_name: string;
  primaryPolicy: Policy;
  versionCount: number;
}

const CONFIG_POLICY_HINT_KEY = "table.configHint" as const;

function GuardrailChips({ guardrails, tone }: { guardrails: string[]; tone: "success" | "error" }) {
  if (guardrails.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1">
      {guardrails.slice(0, 2).map((guardrail) => (
        <StatusBadge key={guardrail} tone={tone} label={guardrail} />
      ))}
      {guardrails.length > 2 && (
        <StatusBadge tone="neutral" label={`+${guardrails.length - 2}`} tooltip={guardrails.slice(2).join(", ")} />
      )}
    </div>
  );
}

interface PolicyRowActionsProps {
  policy: Policy;
  onEditClick: (policy: Policy) => void;
  onDeleteClick: (policyId: string, policyName: string) => void;
  t: PoliciesTranslator;
}

function PolicyRowActions({ policy, onEditClick, onDeleteClick, t }: PolicyRowActionsProps) {
  const isConfigPolicy = policy.definition_location === "config";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("table.openActions")}
        data-testid={`policy-actions-${policy.policy_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="policy-action-edit"
          disabled={isConfigPolicy}
          title={isConfigPolicy ? t(CONFIG_POLICY_HINT_KEY) : undefined}
          onClick={() => onEditClick(policy)}
        >
          <Pencil />
          {t("table.edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          data-testid="policy-action-delete"
          disabled={isConfigPolicy}
          title={isConfigPolicy ? t(CONFIG_POLICY_HINT_KEY) : undefined}
          onClick={() => onDeleteClick(policy.policy_id, policy.policy_name || t("table.unnamed"))}
        >
          <Trash2 />
          {t("table.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface PolicyTableColumnsDeps {
  isAdmin: boolean;
  onViewClick: (policyId: string) => void;
  onEditClick: (policy: Policy) => void;
  onDeleteClick: (policyId: string, policyName: string) => void;
  t: PoliciesTranslator;
}

export const getPolicyTableColumns = ({
  isAdmin,
  onViewClick,
  onEditClick,
  onDeleteClick,
  t,
}: PolicyTableColumnsDeps): ColumnDef<PolicyRow>[] => [
  {
    id: "policy_name",
    accessorKey: "policy_name",
    meta: { title: t("table.name"), skeleton: "twoLine" },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("table.name")} />,
    size: 220,
    enableSorting: true,
    cell: ({ row }) => {
      const isConfigPolicy = row.original.primaryPolicy.definition_location === "config";
      const versionBadge =
        row.original.versionCount > 1 ? (
          <StatusBadge tone="neutral" label={t("table.versions", { count: row.original.versionCount })} />
        ) : undefined;
      return (
        <IdentityCell
          title={row.original.policy_name}
          titleClassName="max-w-60"
          badge={
            isConfigPolicy ? (
              <StatusBadge tone="neutral" label={t("table.config")} tooltip={t(CONFIG_POLICY_HINT_KEY)} />
            ) : (
              versionBadge
            )
          }
          onClick={isConfigPolicy ? undefined : () => onViewClick(row.original.primaryPolicy.policy_id)}
        />
      );
    },
  },
  {
    id: "description",
    accessorFn: (row) => row.primaryPolicy.description ?? "",
    meta: { title: t("description") },
    header: t("description"),
    size: 220,
    enableSorting: false,
    cell: ({ row }) => {
      const description = row.original.primaryPolicy.description;
      if (!description) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <span className="block max-w-60 truncate text-muted-foreground" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    id: "inherit",
    accessorFn: (row) => row.primaryPolicy.inherit ?? "",
    meta: { title: t("table.inherit"), skeleton: "badge" },
    header: t("table.inherit"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const inherit = row.original.primaryPolicy.inherit;
      if (!inherit) {
        return <span className="text-muted-foreground">-</span>;
      }
      return <StatusBadge tone="info" label={inherit} />;
    },
  },
  {
    id: "guardrails_add",
    meta: { title: t("table.add"), skeleton: "chips" },
    header: t("table.add"),
    size: 180,
    enableSorting: false,
    cell: ({ row }) => <GuardrailChips guardrails={row.original.primaryPolicy.guardrails_add ?? []} tone="success" />,
  },
  {
    id: "guardrails_remove",
    meta: { title: t("table.remove"), skeleton: "chips" },
    header: t("table.remove"),
    size: 180,
    enableSorting: false,
    cell: ({ row }) => <GuardrailChips guardrails={row.original.primaryPolicy.guardrails_remove ?? []} tone="error" />,
  },
  {
    id: "model_condition",
    meta: { title: t("table.modelCond") },
    header: t("table.modelCond"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      const model = row.original.primaryPolicy.condition?.model;
      if (!model) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <code className="block max-w-40 truncate rounded-sm bg-muted px-1 py-0.5 font-mono text-xs" title={model}>
          {model}
        </code>
      );
    },
  },
  {
    id: "created_at",
    accessorFn: (row) => row.primaryPolicy.created_at ?? "",
    meta: { title: t("created_at") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("created_at")} />,
    size: 150,
    enableSorting: true,
    cell: ({ row }) => <DateCell value={row.original.primaryPolicy.created_at} />,
  },
  ...(isAdmin
    ? [
        {
          id: "actions",
          meta: { className: "text-right", headerClassName: "text-right" },
          header: () => <span className="sr-only">{t("actions")}</span>,
          size: 64,
          enableSorting: false,
          enableHiding: false,
          cell: ({ row }) => (
            <div className="flex justify-end">
              <PolicyRowActions
                policy={row.original.primaryPolicy}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                t={t}
              />
            </div>
          ),
        } satisfies ColumnDef<PolicyRow>,
      ]
    : []),
];
