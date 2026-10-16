"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { CommonTranslator, VectorStoresTranslator } from "@/lib/i18n/translators";
import { Copy, MoreHorizontal, Trash2 } from "lucide-react";

import { StatusBadge, type StatusTone } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentUpload } from "@/components/vector_store_management/types";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";

const STATUS_LABEL_KEYS: Record<
  DocumentUpload["status"],
  "docStatusUploading" | "docStatusReady" | "docStatusError" | "docStatusRemoved"
> = {
  uploading: "docStatusUploading",
  done: "docStatusReady",
  error: "docStatusError",
  removed: "docStatusRemoved",
};

const STATUS_TONES: Record<DocumentUpload["status"], StatusTone> = {
  uploading: "info",
  done: "success",
  error: "error",
  removed: "neutral",
};

function formatFileSize(bytes?: number): string {
  if (!bytes) return "-";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function DocumentRowActions({
  document,
  onRemove,
  t,
}: {
  document: DocumentUpload;
  onRemove: (uid: string) => void;
  t: VectorStoresTranslator;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("openDocActions")}
        data-testid={`document-actions-${document.uid}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem
          data-testid="document-action-copy"
          onClick={() => void copyToClipboard(document.uid, t("docIdCopied"))}
        >
          <Copy />
          {t("copyDocId")}
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          data-testid="document-action-remove"
          onClick={() => onRemove(document.uid)}
        >
          <Trash2 />
          {t("removeDoc")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface DocumentsTableColumnsDeps {
  t: VectorStoresTranslator;
  commonT: CommonTranslator;
  onRemove: (uid: string) => void;
}

export const getDocumentsTableColumns = ({
  onRemove,
  t,
  commonT,
}: DocumentsTableColumnsDeps): ColumnDef<DocumentUpload>[] => [
  {
    id: "name",
    accessorKey: "name",
    meta: { title: t("table.columnName") },
    header: t("table.columnName"),
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="block max-w-72 truncate text-sm" title={row.original.name}>
          {row.original.name}
        </span>
        {row.original.size ? (
          <span className="text-xs text-muted-foreground">({formatFileSize(row.original.size)})</span>
        ) : null}
      </div>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    meta: { title: commonT("status"), skeleton: "badge" },
    header: commonT("status"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const status = row.original.status;
      const labelKey = STATUS_LABEL_KEYS[status];
      return <StatusBadge tone={STATUS_TONES[status]} label={labelKey ? t(labelKey) : status} />;
    },
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
        <DocumentRowActions document={row.original} onRemove={onRemove} t={t} />
      </div>
    ),
  },
];
