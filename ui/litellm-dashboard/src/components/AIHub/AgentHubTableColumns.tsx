"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AgentsTranslator } from "@/lib/i18n/translators";
import { Copy, Info, MoreHorizontal } from "lucide-react";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/table_cells";
import { IdentityCell } from "@/components/shared/table_cells";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";
import { copyToClipboard } from "@/utils/dataUtils";

export interface AgentHubData {
  agent_id?: string;
  protocolVersion: string;
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities?: {
    streaming?: boolean;
    [key: string]: any;
  };
  defaultInputModes?: string[];
  defaultOutputModes?: string[];
  skills?: Array<{
    id: string;
    name: string;
    description: string;
    tags?: string[];
    examples?: string[];
  }>;
  supportsAuthenticatedExtendedCard?: boolean;
  is_public?: boolean;
  [key: string]: any;
}

interface AgentHubRowActionsProps {
  t: AgentsTranslator;
  agent: AgentHubData;
  onAgentClick: (agent: AgentHubData) => void;
}

function AgentHubRowActions({ t, agent, onAgentClick }: AgentHubRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("openAgentActions")}
        data-testid={`agent-hub-actions-${agent.agent_id || agent.name}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem data-testid="agent-hub-action-details" onClick={() => onAgentClick(agent)}>
          <Info />
          {t("viewDetails")}
        </DropdownMenuItem>
        <DropdownMenuItem
          data-testid="agent-hub-action-copy"
          onClick={() => void copyToClipboard(agent.name, t("agentNameCopied"))}
        >
          <Copy />
          {t("copyAgentName")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AgentHubTableColumnsDeps {
  onAgentClick: (agent: AgentHubData) => void;
  t: AgentsTranslator;
}

export const getAgentHubTableColumns = ({ onAgentClick, t }: AgentHubTableColumnsDeps): ColumnDef<AgentHubData>[] => [
  {
    id: "name",
    accessorKey: "name",
    meta: { title: t("colAgentName") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("colAgentName")} />,
    size: 200,
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <IdentityCell title={row.original.name} className="max-w-72" onClick={() => onAgentClick(row.original)} />
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    meta: { title: t("description"), className: "hidden md:table-cell" },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("description")} />,
    size: 240,
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <span className="block max-w-72 truncate text-xs" title={row.original.description || undefined}>
        {row.original.description || "-"}
      </span>
    ),
  },
  {
    id: "version",
    accessorKey: "version",
    meta: { title: t("version"), skeleton: "badge", className: "hidden lg:table-cell" },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("version")} />,
    size: 100,
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-mono font-normal">
        v{row.original.version}
      </Badge>
    ),
  },
  {
    id: "protocolVersion",
    accessorKey: "protocolVersion",
    meta: { title: t("colProtocol"), className: "hidden lg:table-cell" },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("colProtocol")} />,
    size: 100,
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: ({ row }) => <span className="text-xs">{row.original.protocolVersion || "-"}</span>,
  },
  {
    id: "skills",
    meta: { title: t("skills"), skeleton: "chips" },
    header: t("skills"),
    size: 180,
    enableSorting: false,
    cell: ({ row }) => {
      const skills = row.original.skills || [];
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium">{t("skillsCount", { count: skills.length })}</span>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {skills.slice(0, 2).map((skill) => (
                <Badge key={skill.id} variant="secondary">
                  {skill.name}
                </Badge>
              ))}
              {skills.length > 2 && <span className="text-xs text-muted-foreground">+{skills.length - 2}</span>}
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "capabilities",
    meta: { title: t("capabilities"), skeleton: "chips" },
    header: t("capabilities"),
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      const capabilityList = Object.entries(row.original.capabilities || {})
        .filter(([, value]) => value === true)
        .map(([key]) => key);
      if (capabilityList.length === 0) {
        return <span className="text-xs text-muted-foreground">-</span>;
      }
      return (
        <div className="flex flex-wrap gap-1">
          {capabilityList.map((capability) => (
            <Badge key={capability} variant="outline">
              {capability}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "io_modes",
    meta: { title: t("colIoModes"), skeleton: "twoLine", className: "hidden xl:table-cell" },
    header: t("colIoModes"),
    size: 150,
    enableSorting: false,
    cell: ({ row }) => {
      const inputModes = row.original.defaultInputModes || [];
      const outputModes = row.original.defaultOutputModes || [];
      return (
        <div className="flex flex-col gap-0.5 text-xs">
          <span>
            {t.rich("ioInputModes", {
              modes: inputModes.join(", ") || "-",
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
            })}
          </span>
          <span>
            {t.rich("ioOutputModes", {
              modes: outputModes.join(", ") || "-",
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
            })}
          </span>
        </div>
      );
    },
  },
  {
    id: "is_public",
    accessorKey: "is_public",
    meta: { title: t("colPublic"), skeleton: "badge", className: "hidden md:table-cell" },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("colPublic")} />,
    size: 100,
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const publicA = rowA.original.is_public === true ? 1 : 0;
      const publicB = rowB.original.is_public === true ? 1 : 0;
      return publicA - publicB;
    },
    cell: ({ row }) => {
      const isPublic = row.original.is_public === true;
      return <StatusBadge tone={isPublic ? "success" : "neutral"} label={isPublic ? t("yes") : t("no")} />;
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
        <AgentHubRowActions t={t} agent={row.original} onAgentClick={onAgentClick} />
      </div>
    ),
  },
];
