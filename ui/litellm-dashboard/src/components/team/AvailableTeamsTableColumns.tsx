"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTableSortHeader } from "@/components/shared/DataTable";
import { IdentityCell, ModelsCell } from "@/components/shared/table_cells";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cva.config";

export interface AvailableTeam {
  team_id: string;
  team_alias: string;
  description?: string;
  models: string[];
  members_with_roles: { user_id?: string; user_email?: string; role: string }[];
}

function AvailableTeamRowActions({ team, onJoinTeam }: { team: AvailableTeam; onJoinTeam: (teamId: string) => void }) {
  const t = useTranslations("teams");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("availableOpenActions")}
        data-testid={`available-team-actions-${team.team_id}`}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-muted-foreground")}
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem data-testid="available-team-action-join" onClick={() => onJoinTeam(team.team_id)}>
          <UserPlus />
          {t("availableJoin")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface AvailableTeamsTableColumnsDeps {
  onJoinTeam: (teamId: string) => void;
  t: ReturnType<typeof useTranslations>;
}

export const getAvailableTeamsTableColumns = ({
  onJoinTeam,
  t,
}: AvailableTeamsTableColumnsDeps): ColumnDef<AvailableTeam>[] => [
  {
    id: "team_alias",
    accessorKey: "team_alias",
    meta: { title: t("availableTeamName") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("availableTeamName")} />,
    size: 220,
    enableSorting: true,
    cell: ({ row }) => (
      <IdentityCell title={row.original.team_alias} className="max-w-72" titleClassName="font-medium" />
    ),
  },
  {
    id: "description",
    accessorKey: "description",
    meta: { title: t("availableDescription") },
    header: t("availableDescription"),
    size: 280,
    enableSorting: false,
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <span className="block max-w-72 truncate text-sm text-muted-foreground" title={description || undefined}>
          {description || t("availableNoDescription")}
        </span>
      );
    },
  },
  {
    id: "members",
    accessorFn: (team) => team.members_with_roles.length,
    meta: { title: t("members") },
    header: ({ column }) => <DataTableSortHeader column={column} title={t("members")} />,
    size: 120,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {t("availableMembersCount", { count: row.original.members_with_roles.length })}
      </span>
    ),
  },
  {
    id: "models",
    meta: { title: t("models") },
    header: t("models"),
    size: 260,
    enableSorting: false,
    cell: ({ row }) => <ModelsCell models={row.original.models} />,
  },
  {
    id: "actions",
    meta: { className: "text-right", headerClassName: "text-right" },
    header: () => <span className="sr-only">{t("availableActions")}</span>,
    size: 64,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <AvailableTeamRowActions team={row.original} onJoinTeam={onJoinTeam} />
      </div>
    ),
  },
];
