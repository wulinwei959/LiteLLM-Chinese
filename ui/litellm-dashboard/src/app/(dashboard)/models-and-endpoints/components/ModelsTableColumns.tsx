"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Copy, Info, Loader2, Pencil, RefreshCw, Trash2 } from "lucide-react";
import type { ModelsTranslator } from "@/lib/i18n/translators";

import { ProviderLogo } from "@/components/molecules/models/ProviderLogo";
import { ModelData } from "@/components/model_dashboard/types";
import { DataTableSortHeader } from "@/components/shared/DataTable";
import { CellTooltip, DateCell, formatCellDate, IdCell, StatusBadge } from "@/components/shared/table_cells";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Switch } from "@/components/ui/switch";
import { getDisplayModelName } from "@/components/view_model/model_name_display";
import { copyToClipboard, formatPerSecondCost } from "@/utils/dataUtils";

export const MODEL_ID_COLUMN_ID = "model_info_id";
export const MODEL_NAME_COLUMN_ID = "model_name";
export const CREDENTIALS_COLUMN_ID = "litellm_credential_name";
export const CREATED_BY_COLUMN_ID = "model_info_created_by";
export const UPDATED_AT_COLUMN_ID = "model_info_updated_at";
export const COSTS_COLUMN_ID = "input_cost";
export const TEAM_ID_COLUMN_ID = "model_info_team_id";
export const ACCESS_GROUPS_COLUMN_ID = "model_info_access_groups";
export const STATUS_COLUMN_ID = "model_info_db_model";

export const MODEL_TABLE_SORT_COLUMN_IDS = [
  MODEL_NAME_COLUMN_ID,
  CREATED_BY_COLUMN_ID,
  UPDATED_AT_COLUMN_ID,
  COSTS_COLUMN_ID,
  STATUS_COLUMN_ID,
] as const;

export type ModelTableSortColumnId = (typeof MODEL_TABLE_SORT_COLUMN_IDS)[number];

export const isModelTableSortColumnId = (columnId: string): columnId is ModelTableSortColumnId =>
  (MODEL_TABLE_SORT_COLUMN_IDS as readonly string[]).includes(columnId);

const COLUMN_ID_TO_SERVER_SORT_FIELD: Record<string, string> = {
  [COSTS_COLUMN_ID]: "costs",
  [STATUS_COLUMN_ID]: "status",
  [CREATED_BY_COLUMN_ID]: "created_at",
  [UPDATED_AT_COLUMN_ID]: "updated_at",
};

export const toServerSortField = (columnId: string): string => COLUMN_ID_TO_SERVER_SORT_FIELD[columnId] ?? columnId;

const formatShortDate = (value: string | null | undefined): string | null => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : formatCellDate(date, "date");
};

function ModelInformationCell({
  model,
  displayName,
  t,
}: {
  model: ModelData;
  displayName: string;
  t: ModelsTranslator;
}) {
  const litellmModelName = model.litellm_model_name || "-";

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <div className="flex min-w-0 items-center gap-2.5" data-testid={`model-information-${model.model_info.id}`} />
        }
      >
        {model.provider ? (
          <ProviderLogo provider={model.provider} className="size-6 shrink-0" />
        ) : (
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
            -
          </span>
        )}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="max-w-60 truncate text-sm font-medium text-foreground" title={displayName}>
            {displayName}
          </span>
          <span className="max-w-60 truncate font-mono text-xs text-muted-foreground" title={litellmModelName}>
            {litellmModelName}
          </span>
        </span>
      </HoverCardTrigger>
      <HoverCardContent align="start" className="w-80">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {model.provider ? <ProviderLogo provider={model.provider} className="size-4 shrink-0" /> : null}
            <span className="truncate text-xs text-muted-foreground">
              {model.provider || t("modelTable.unknownProvider")}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{t("modelTable.publicModelName")}</span>
            <span className="truncate text-sm font-medium text-foreground" title={displayName}>
              {displayName}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">{t("modelTable.litellmModelName")}</span>
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate font-mono text-sm text-foreground" title={litellmModelName}>
                {litellmModelName}
              </span>
              <button
                type="button"
                aria-label={t("modelTable.copyTooltip")}
                data-testid={`copy-litellm-model-name-${model.model_info.id}`}
                className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => void copyToClipboard(litellmModelName, t("modelTable.copied"))}
              >
                <Copy className="size-3.5" />
              </button>
            </span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function CredentialsHeader({ t }: { t: ModelsTranslator }) {
  return (
    <span className="flex items-center gap-1">
      {t("table.credentials")}
      <HoverCard>
        <HoverCardTrigger
          render={
            <button
              type="button"
              aria-label={t("table.credentialsTooltip")}
              data-testid="credentials-header-info"
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            />
          }
        >
          <Info className="size-3.5" />
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-80">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">{t("table.credentialTypes")}</span>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-info">
                <RefreshCw className="size-3.5" />
                {t("table.reusable")}
              </span>
              <span className="text-xs text-muted-foreground">{t("table.reusableDesc")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Pencil className="size-3.5" />
                {t("table.manual")}
              </span>
              <span className="text-xs text-muted-foreground">{t("table.manualDesc")}</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </span>
  );
}

function CredentialsCell({ credentialName }: { credentialName: string | undefined }) {
  if (!credentialName) {
    return (
      <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
        <Pencil className="size-3" />
        Manual
      </Badge>
    );
  }

  return (
    <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-info" title={credentialName}>
      <RefreshCw className="size-3 shrink-0" />
      <span className="truncate">{credentialName}</span>
    </span>
  );
}

function CreatedByCell({ model, t }: { model: ModelData; t: ModelsTranslator }) {
  const isConfigModel = !model.model_info?.db_model;
  const createdAt = formatShortDate(model.model_info.created_at);
  const primary = isConfigModel ? t("modelTable.configModel") : model.model_info.created_by || t("common.unknown");
  const secondaryForDbModel = formatShortDate(model.model_info.created_at) ?? t("common.unknown");

  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <span className="max-w-44 truncate text-sm text-foreground" title={primary}>
        {primary}
      </span>
      <span className="truncate text-xs text-muted-foreground">{isConfigModel ? "-" : secondaryForDbModel}</span>
    </div>
  );
}

function CostRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="text-[10px] font-semibold tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs font-medium tabular-nums text-foreground">{value}</span>
    </span>
  );
}

function CostsCell({ model, t }: { model: ModelData; t: ModelsTranslator }) {
  const { input_cost: inputCost, output_cost: outputCost, output_cost_per_second: perSecond } = model;
  const hasPerSecond = perSecond != null;
  const showInput = inputCost != null && (!hasPerSecond || Number(inputCost) > 0);
  const showOutput = outputCost != null && (!hasPerSecond || Number(outputCost) > 0);

  if (!showInput && !showOutput && !hasPerSecond) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  return (
    <CellTooltip
      content={hasPerSecond ? t("table.costTooltipPerSecond") : t("table.costTooltip")}
      trigger={
        <div className="flex flex-col gap-0.5 whitespace-nowrap">
          {showInput && <CostRow label={t("table.costIn")} value={`$${inputCost}`} />}
          {showOutput && <CostRow label={t("table.costOut")} value={`$${outputCost}`} />}
          {hasPerSecond && <CostRow label={t("table.costOut")} value={formatPerSecondCost(perSecond)} />}
        </div>
      }
    />
  );
}

function AccessGroupsCell({ accessGroups, t }: { accessGroups: string[] | null; t: ModelsTranslator }) {
  if (!accessGroups || accessGroups.length === 0) {
    return <span className="text-sm text-muted-foreground">-</span>;
  }

  const [first, ...overflow] = accessGroups;

  return (
    <div className="flex min-w-0 items-center gap-1">
      <Badge variant="outline" className="max-w-36 truncate border-info/20 bg-info/10 font-normal text-info">
        {first}
      </Badge>
      {overflow.length > 0 && (
        <CellTooltip
          content={
            <div className="flex max-w-[280px] flex-col gap-0.5">
              {overflow.map((group) => (
                <span key={group}>{group}</span>
              ))}
            </div>
          }
          trigger={
            <Badge variant="outline" className="shrink-0 cursor-default font-normal">
              +{overflow.length} {t("common.more")}
            </Badge>
          }
        />
      )}
    </div>
  );
}

interface ModelRowActionsProps {
  model: ModelData;
  userRole: string;
  userID: string;
  isViewOnly: boolean;
  isPausing: boolean;
  onDeleteClick?: (modelId: string) => void;
  onTogglePauseClick?: (modelId: string, blocked: boolean) => void | Promise<void>;
  t: ModelsTranslator;
}

function ModelRowActions({
  model,
  userRole,
  userID,
  isViewOnly,
  isPausing,
  onDeleteClick,
  onTogglePauseClick,
  t,
}: ModelRowActionsProps) {
  const modelId = model.model_info?.id;
  const isConfigModel = !model.model_info?.db_model;
  const isAdmin = userRole === "Admin" && !isViewOnly;
  const canEditModel = !isViewOnly && (isAdmin || model.model_info?.created_by === userID);
  const isBlocked = model.model_info?.blocked === true;
  const isPauseToggleable = !isConfigModel && isAdmin && Boolean(onTogglePauseClick);

  const resolvePauseTooltip = (): string => {
    if (isConfigModel) {
      return t("modelTable.pauseTooltipConfig");
    }
    if (!isAdmin) {
      return t("modelTable.pauseTooltipAdmin");
    }
    return isBlocked ? t("modelTable.resumeTooltip") : t("modelTable.pauseTooltip");
  };

  const deleteTooltip = isConfigModel ? t("modelTable.deleteTooltipConfig") : t("modelTable.deleteTooltip");

  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="flex w-8 shrink-0 items-center justify-center">
        {isPausing ? (
          <Loader2
            className="size-4 animate-spin text-muted-foreground"
            data-testid={`model-pause-pending-${modelId}`}
          />
        ) : (
          <CellTooltip
            content={resolvePauseTooltip()}
            trigger={
              <span className="inline-flex">
                <Switch
                  size="sm"
                  checked={!isBlocked}
                  disabled={!isPauseToggleable}
                  aria-label={isBlocked ? t("modelTable.resumeAria") : t("modelTable.pauseAria")}
                  data-testid={`model-pause-toggle-${modelId}`}
                  onCheckedChange={(nextChecked) => {
                    if (isPauseToggleable && onTogglePauseClick && modelId) {
                      void onTogglePauseClick(modelId, !nextChecked);
                    }
                  }}
                />
              </span>
            }
          />
        )}
      </span>
      <CellTooltip
        content={deleteTooltip}
        trigger={
          <span className="inline-flex">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={t("table.delete")}
              data-testid={`model-delete-${modelId}`}
              disabled={isConfigModel || !canEditModel}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={() => {
                if (onDeleteClick && modelId) {
                  onDeleteClick(modelId);
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </span>
        }
      />
    </div>
  );
}

interface ModelsTableColumnDeps {
  userRole: string;
  userID: string;
  isViewOnly: boolean;
  onModelIdClick: (modelId: string) => void;
  onTeamIdClick: (teamId: string) => void;
  onDeleteClick?: (modelId: string) => void;
  onTogglePauseClick?: (modelId: string, blocked: boolean) => void | Promise<void>;
  pausingModelId?: string | null;
  t: ModelsTranslator;
}

export const getModelsTableColumns = ({
  userRole,
  userID,
  isViewOnly,
  onModelIdClick,
  onTeamIdClick,
  onDeleteClick,
  onTogglePauseClick,
  pausingModelId,
  t,
}: ModelsTableColumnDeps): ColumnDef<ModelData>[] => {
  return [
    {
      id: MODEL_ID_COLUMN_ID,
      accessorFn: (row) => row.model_info.id,
      meta: { title: t("modelTable.modelId") },
      header: t("modelTable.modelId"),
      enableSorting: false,
      size: 140,
      minSize: 90,
      cell: ({ row }) => (
        <IdCell
          value={row.original.model_info.id}
          onClick={onModelIdClick}
          dataTestId={`model-id-${row.original.model_info.id}`}
        />
      ),
    },
    {
      id: MODEL_NAME_COLUMN_ID,
      accessorFn: (row) => row.model_name ?? "",
      meta: { title: t("modelTable.modelInformation"), skeleton: "twoLine" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("modelTable.modelInformation")} />,
      enableSorting: true,
      size: 280,
      minSize: 160,
      cell: ({ row }) => (
        <ModelInformationCell model={row.original} displayName={getDisplayModelName(row.original) || "-"} t={t} />
      ),
    },
    {
      id: CREDENTIALS_COLUMN_ID,
      accessorFn: (row) => row.litellm_params?.litellm_credential_name ?? "",
      meta: { title: t("table.credentials") },
      header: () => <CredentialsHeader t={t} />,
      enableSorting: false,
      size: 180,
      minSize: 110,
      cell: ({ row }) => <CredentialsCell credentialName={row.original.litellm_params?.litellm_credential_name} />,
    },
    {
      id: CREATED_BY_COLUMN_ID,
      accessorFn: (row) => row.model_info.created_by ?? "",
      meta: { title: t("modelTable.createdBy"), skeleton: "twoLine" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("modelTable.createdBy")} />,
      enableSorting: true,
      size: 180,
      minSize: 110,
      cell: ({ row }) => <CreatedByCell model={row.original} t={t} />,
    },
    {
      id: UPDATED_AT_COLUMN_ID,
      accessorFn: (row) => row.model_info.updated_at ?? "",
      meta: { title: t("modelTable.updatedAt") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("modelTable.updatedAt")} />,
      enableSorting: true,
      size: 140,
      minSize: 100,
      cell: ({ row }) => <DateCell value={row.original.model_info.updated_at} precision="date" />,
    },
    {
      id: COSTS_COLUMN_ID,
      accessorFn: (row) => row.input_cost,
      meta: { title: t("modelTable.costs") },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("modelTable.costs")} />,
      enableSorting: true,
      size: 130,
      minSize: 90,
      cell: ({ row }) => <CostsCell model={row.original} t={t} />,
    },
    {
      id: TEAM_ID_COLUMN_ID,
      accessorFn: (row) => row.model_info.team_id ?? "",
      meta: { title: t("modelTable.teamId") },
      header: t("modelTable.teamId"),
      enableSorting: false,
      size: 140,
      minSize: 90,
      cell: ({ row }) => (
        <IdCell
          value={row.original.model_info.team_id}
          onClick={onTeamIdClick}
          dataTestId={`model-team-id-${row.original.model_info.id}`}
        />
      ),
    },
    {
      id: ACCESS_GROUPS_COLUMN_ID,
      accessorFn: (row) => row.model_info.access_groups ?? [],
      meta: { title: t("modelTable.modelAccessGroup"), skeleton: "chips" },
      header: t("modelTable.modelAccessGroup"),
      enableSorting: false,
      size: 200,
      minSize: 120,
      cell: ({ row }) => <AccessGroupsCell accessGroups={row.original.model_info.access_groups} t={t} />,
    },
    {
      id: STATUS_COLUMN_ID,
      accessorFn: (row) => row.model_info.db_model,
      meta: { title: t("modelTable.status"), skeleton: "badge" },
      header: ({ column }) => <DataTableSortHeader column={column} title={t("modelTable.status")} />,
      enableSorting: true,
      size: 140,
      minSize: 100,
      cell: ({ row }) =>
        row.original.model_info.db_model ? (
          <StatusBadge tone="info" label={t("modelTable.dbModel")} />
        ) : (
          <StatusBadge tone="neutral" label={t("modelTable.configBadge")} />
        ),
    },
    {
      id: "actions",
      meta: { title: t("table.actions"), className: "text-right", headerClassName: "text-right" },
      header: t("table.actions"),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 110,
      minSize: 110,
      cell: ({ row }) => (
        <ModelRowActions
          model={row.original}
          userRole={userRole}
          userID={userID}
          isViewOnly={isViewOnly}
          isPausing={pausingModelId === row.original.model_info?.id}
          onDeleteClick={onDeleteClick}
          onTogglePauseClick={onTogglePauseClick}
          t={t}
        />
      ),
    },
  ];
};
