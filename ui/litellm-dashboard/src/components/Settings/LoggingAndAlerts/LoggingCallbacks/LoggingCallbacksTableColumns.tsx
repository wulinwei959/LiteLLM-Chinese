"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Play, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { StatusBadge, type StatusTone } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";

import { AlertingObject } from "./types";

export type CallbackRow = AlertingObject & {
  mode?: "success" | "failure" | "info" | string;
};

export interface AvailableCallbackMeta {
  litellm_callback_name: string;
  litellm_callback_params: string[];
  ui_callback_name: string;
}

export type AvailableCallbacks = Record<string, AvailableCallbackMeta>;

export const callbackRowMode = (record: CallbackRow): string => record.type || record.mode || "success";

function callbackModeTone(mode: string): StatusTone {
  if (mode === "success") return "success";
  if (mode === "failure") return "error";
  return "info";
}

interface CallbackRowActionsProps {
  callback: CallbackRow;
  onTest: (callback: AlertingObject) => void | Promise<void>;
  onEdit: (callback: AlertingObject) => void;
  onDelete: (callback: AlertingObject) => void;
}

function CallbackRowActions({ callback, onTest, onEdit, onDelete }: CallbackRowActionsProps) {
  const t = useTranslations("loggingCallbacks");
  const tCommon = useTranslations("common");

  if (callback.read_only) {
    return (
      <span className="text-xs text-muted-foreground" title={t("readOnlyTooltip")}>
        {t("readOnly")}
      </span>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("openActions")}
        data-testid={`callback-actions-${callback.name}-${callbackRowMode(callback)}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem data-testid="callback-action-test" onClick={() => void onTest(callback)}>
          <Play />
          {t("test")}
        </DropdownMenuItem>
        <DropdownMenuItem data-testid="callback-action-edit" onClick={() => onEdit(callback)}>
          <Pencil />
          {tCommon("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" data-testid="callback-action-delete" onClick={() => onDelete(callback)}>
          <Trash2 />
          {tCommon("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface LoggingCallbacksTableColumnsDeps {
  availableCallbacks: AvailableCallbacks;
  onTest: (callback: AlertingObject) => void | Promise<void>;
  onEdit: (callback: AlertingObject) => void;
  onDelete: (callback: AlertingObject) => void;
  t: ReturnType<typeof useTranslations>;
  tCommon: ReturnType<typeof useTranslations>;
}

export const getLoggingCallbacksTableColumns = ({
  availableCallbacks,
  onTest,
  onEdit,
  onDelete,
  t,
  tCommon,
}: LoggingCallbacksTableColumnsDeps): ColumnDef<CallbackRow>[] => {
  const callbackName = t("callbackName");
  const modeLabels: Record<string, string> = {
    success: tCommon("success"),
    failure: t("failure"),
    success_and_failure: t("successAndFailure"),
  };

  return [
    {
      id: "name",
      accessorKey: "name",
      meta: { title: callbackName },
      header: callbackName,
      enableSorting: false,
      cell: ({ row }) => {
        const id = row.original.name;
        const displayName = availableCallbacks[id]?.ui_callback_name || id;
        return (
          <span className="block max-w-72 truncate text-sm font-medium" title={displayName}>
            {displayName}
          </span>
        );
      },
    },
    {
      id: "mode",
      meta: { title: tCommon("mode"), skeleton: "badge" },
      header: tCommon("mode"),
      size: 240,
      enableSorting: false,
      cell: ({ row }) => {
        const mode = callbackRowMode(row.original);
        return <StatusBadge tone={callbackModeTone(mode)} label={modeLabels[mode] || mode} />;
      },
    },
    {
      id: "actions",
      meta: { className: "text-right", headerClassName: "text-right" },
      header: () => <span className="sr-only">{tCommon("actions")}</span>,
      size: 64,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <CallbackRowActions callback={row.original} onTest={onTest} onEdit={onEdit} onDelete={onDelete} />
        </div>
      ),
    },
  ];
};
