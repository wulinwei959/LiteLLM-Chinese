"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { CredentialItem } from "@/components/networking";
import { getProviderLogoAndName } from "@/components/provider_info_helpers";
import { DataTableSortHeader } from "@/components/shared/DataTable";
import { credentialLabel } from "@/components/shared/credentialOptions";
import { IdentityCell, StatusBadge } from "@/components/shared/table_cells";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";
import type { CommonTranslator, CredentialsTranslator } from "@/lib/i18n/translators";

import { inferAuthMethod } from "./credential_federation";

function CredentialProviderCell({
  t,
  provider,
  federated,
}: {
  t: CredentialsTranslator;
  provider: string | undefined;
  federated: boolean;
}) {
  if (!provider) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }
  const { displayName, logo } = getProviderLogoAndName(provider);
  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <img
          src={logo}
          alt=""
          className="size-4 shrink-0"
          onError={(event) => {
            (event.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      <span className="truncate text-sm">{displayName || provider}</span>
      {federated && <Badge variant="secondary">{t("federationLabel")}</Badge>}
    </div>
  );
}

interface CredentialRowActionsProps {
  credential: CredentialItem;
  onEdit: (credential: CredentialItem) => void;
  onDelete: (credential: CredentialItem) => void;
}

function CredentialRowActions({ credential, onEdit, onDelete }: CredentialRowActionsProps) {
  const t = useTranslations("credentials");
  const commonT = useTranslations("common");
  const configOwned = credential.source === "config";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("openActionsAria")}
        data-testid={`credential-actions-${credential.credential_name}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {configOwned && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel data-testid="credential-config-owned-hint">{t("configOwnedHint")}</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem
          data-testid="credential-action-edit"
          disabled={configOwned}
          onClick={() => onEdit(credential)}
        >
          <Pencil />
          {commonT("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="credential-action-copy"
          onClick={() => void copyToClipboard(credential.credential_name, commonT("nameCopied"))}
        >
          <Copy />
          {commonT("copyName")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          data-testid="credential-action-delete"
          disabled={configOwned}
          onClick={() => onDelete(credential)}
        >
          <Trash2 />
          {commonT("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface CredentialsTableColumnsDeps {
  t: CredentialsTranslator;
  commonT: CommonTranslator;
  canModifyCredentials: boolean;
  onEdit: (credential: CredentialItem) => void;
  onDelete: (credential: CredentialItem) => void;
}

export const getCredentialsTableColumns = ({
  t,
  commonT,
  canModifyCredentials,
  onEdit,
  onDelete,
}: CredentialsTableColumnsDeps): ColumnDef<CredentialItem>[] => {
  const dataColumns: ColumnDef<CredentialItem>[] = [
    {
      id: "credential_name",
      accessorFn: credentialLabel,
      meta: { title: t("nameCol") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("nameCol")} />,
      size: 260,
      enableSorting: true,
      cell: ({ row }) => (
        <IdentityCell
          title={credentialLabel(row.original)}
          subtitle={row.original.display_name ? row.original.credential_name : undefined}
          className="max-w-72"
          titleClassName="font-medium"
        />
      ),
    },
    {
      id: "provider",
      accessorKey: "credential_info.custom_llm_provider",
      meta: { title: t("providerCol") },
      header: t("providerCol"),
      size: 320,
      enableSorting: false,
      cell: ({ row }) => (
        <CredentialProviderCell
          t={t}
          provider={row.original.credential_info?.custom_llm_provider}
          federated={inferAuthMethod(row.original.credential_values) === "federation"}
        />
      ),
    },
    {
      id: "source",
      accessorFn: (row) => row.source ?? "db",
      meta: { title: t("sourceCol") },
      header: t("sourceCol"),
      size: 140,
      enableSorting: false,
      cell: ({ row }) =>
        row.original.source === "config" ? (
          <StatusBadge tone="neutral" label={t("sourceConfig")} />
        ) : (
          <StatusBadge tone="info" label={t("sourceDb")} />
        ),
    },
  ];

  if (!canModifyCredentials) {
    return dataColumns;
  }

  return [
    ...dataColumns,
    {
      id: "actions",
      meta: { className: "text-right", headerClassName: "text-right" },
      header: () => <span className="sr-only">{commonT("actions")}</span>,
      size: 64,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <CredentialRowActions credential={row.original} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ];
};
