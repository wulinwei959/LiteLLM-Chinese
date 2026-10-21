import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useMemo } from "react";

import { teamSpendByUserCall } from "@/components/networking";
import { DataTable } from "@/components/shared/DataTable";
import { MoneyCell } from "@/components/shared/table_cells";
import { Button } from "@/components/ui/button";

import { Panel } from "../overview/Primitives";
import type { UsageTeamUserSpendTranslator } from "@/lib/i18n/translators";

import {
  buildTeamUserSpendCsv,
  downloadCsv,
  sortBySpendDesc,
  teamLabel,
  teamUserSpendCsvFileName,
  teamUserSpendRowId,
  userLabel,
  type TeamUserSpendRow,
} from "./teamUserSpend";

interface TeamUserSpendCardProps {
  accessToken: string | null;
  startTime: Date | null;
  endTime: Date | null;
  teamIds: readonly string[];
}

const QUIET_HEADER = { headerClassName: "font-normal" };

const buildColumns = (t: UsageTeamUserSpendTranslator): ColumnDef<TeamUserSpendRow>[] => [
  {
    header: t("team"),
    accessorFn: teamLabel,
    id: "team",
    meta: QUIET_HEADER,
    cell: ({ row }) => teamLabel(row.original),
  },
  {
    header: t("user"),
    accessorFn: userLabel,
    id: "user",
    meta: QUIET_HEADER,
    cell: ({ row }) => <span className="font-medium text-foreground">{userLabel(row.original)}</span>,
  },
  {
    header: t("spend"),
    accessorKey: "spend",
    meta: { numeric: true, ...QUIET_HEADER },
    cell: ({ row }) => <MoneyCell value={row.original.spend} decimals={4} />,
  },
  {
    header: t("requests"),
    accessorKey: "api_requests",
    meta: { numeric: true, ...QUIET_HEADER },
    cell: ({ row }) => row.original.api_requests.toLocaleString(),
  },
  {
    header: t("successful"),
    accessorKey: "successful_requests",
    meta: { numeric: true, className: "text-success", ...QUIET_HEADER },
    cell: ({ row }) => row.original.successful_requests.toLocaleString(),
  },
  {
    header: t("failed"),
    accessorKey: "failed_requests",
    meta: { numeric: true, className: "text-destructive", ...QUIET_HEADER },
    cell: ({ row }) => row.original.failed_requests.toLocaleString(),
  },
  {
    header: t("tokens"),
    accessorKey: "total_tokens",
    meta: { numeric: true, ...QUIET_HEADER },
    cell: ({ row }) => row.original.total_tokens.toLocaleString(),
  },
];

const TeamUserSpendCard: React.FC<TeamUserSpendCardProps> = ({ accessToken, startTime, endTime, teamIds }) => {
  const t = useTranslations("usage.teamUserSpend");
  const columns = buildColumns(t);
  const hasTeams = teamIds.length > 0;
  const { data, isLoading } = useQuery({
    queryKey: ["teamSpendByUser", startTime?.toISOString(), endTime?.toISOString(), teamIds],
    queryFn: () =>
      accessToken && startTime && endTime ? teamSpendByUserCall(accessToken, startTime, endTime, teamIds) : null,
    enabled: Boolean(accessToken && startTime && endTime) && hasTeams,
  });
  const rows = useMemo(() => sortBySpendDesc(data?.results ?? []), [data]);

  return (
    <Panel
      icon={Users}
      title={t("title")}
      action={
        <Button
          variant="outline"
          size="xs"
          disabled={!data || rows.length === 0}
          onClick={() => data && downloadCsv(buildTeamUserSpendCsv(data), teamUserSpendCsvFileName(data))}
        >
          <Download />
          {t("downloadCsv")}
        </Button>
      }
    >
      <p className="mb-3 text-xs text-muted-foreground">{t("attributionHint")}</p>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={teamUserSpendRowId}
        isLoading={isLoading}
        maxBodyHeight={320}
        noDataMessage={teamIds.length === 0 ? t("selectTeamHint") : t("noUserSpend")}
        size="compact"
      />
    </Panel>
  );
};

export default TeamUserSpendCard;
