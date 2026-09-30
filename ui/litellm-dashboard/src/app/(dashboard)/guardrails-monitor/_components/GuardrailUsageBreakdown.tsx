import type { ColumnDef } from "@tanstack/react-table";
import { CircleDollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import type { GuardrailUsageDetail } from "@/app/(dashboard)/hooks/guardrails/useGuardrailsUsage";
import { CalcPopover, MathTable } from "@/components/GuardrailsMonitor/CalcPopover";
import { MetricCard } from "@/components/GuardrailsMonitor/MetricCard";
import { UnpricedNote } from "@/components/GuardrailsMonitor/UnpricedNote";
import {
  counterLabel,
  counterMathRow,
  formatCost,
  totalUnits,
  unitsMathRows,
  unpricedSummary,
} from "@/components/GuardrailsMonitor/usageUnits";
import { DataTable } from "@/components/shared/DataTable";
import type { GuardrailsMonitorTranslator } from "@/lib/i18n/translators";
import { IdCell } from "@/components/shared/table_cells/id_cell";
import { MoneyCell } from "@/components/shared/table_cells/money_cell";

interface CounterRow {
  counter: string;
  units: number;
  cost: number | null;
  unpriced: number;
}

interface GroupRow {
  id: string;
  units: number;
  cost: number | null;
  unpriced: number;
}

const counterRows = (detail: GuardrailUsageDetail): CounterRow[] =>
  Object.entries(detail.usage_units).map(([counter, units]) => ({
    counter,
    units,
    cost: detail.cost_by_unit[counter] ?? null,
    unpriced: detail.untracked_usage_units[counter] ?? 0,
  }));

const groupRows = (
  unitsByGroup: GuardrailUsageDetail["usage_units_by_team"],
  costByGroup: GuardrailUsageDetail["cost_by_team"],
  untrackedByGroup: GuardrailUsageDetail["untracked_usage_units_by_team"],
): GroupRow[] =>
  Object.entries(unitsByGroup)
    .map(([id, units]) => ({
      id,
      units: totalUnits(units),
      cost: costByGroup[id] ?? null,
      unpriced: totalUnits(untrackedByGroup[id] ?? {}),
    }))
    .sort((a, b) => b.units - a.units);

const UnpricedUnitsCell = ({ unpriced }: { unpriced: number }) =>
  unpriced > 0 ? (
    <span className="text-warning">{unpriced.toLocaleString()}</span>
  ) : (
    <span className="text-muted-foreground">—</span>
  );

const unpricedColumn = <TRow extends { unpriced: number }>(t: GuardrailsMonitorTranslator): ColumnDef<TRow> => ({
  header: t("breakdown.colUnpriced"),
  accessorKey: "unpriced",
  meta: { numeric: true },
  cell: ({ row }) => <UnpricedUnitsCell unpriced={row.original.unpriced} />,
});

const counterColumns = (t: GuardrailsMonitorTranslator): ColumnDef<CounterRow>[] => [
  { header: t("breakdown.colCounter"), accessorKey: "counter", cell: ({ row }) => counterLabel(row.original.counter) },
  {
    header: t("breakdown.colUnits"),
    accessorKey: "units",
    meta: { numeric: true },
    cell: ({ row }) => row.original.units.toLocaleString(),
  },
  {
    header: t("breakdown.colCost"),
    accessorKey: "cost",
    meta: { numeric: true },
    cell: ({ row }) => <MoneyCell value={row.original.cost} emptyText="—" showZero />,
  },
  unpricedColumn<CounterRow>(t),
];

const groupColumns = (
  t: GuardrailsMonitorTranslator,
  label: string,
  emptyLabel: string,
): ColumnDef<GroupRow>[] => [
  {
    header: label,
    accessorKey: "id",
    cell: ({ row }) =>
      row.original.id ? (
        <IdCell value={row.original.id} variant="plain" copyable />
      ) : (
        <span className="text-muted-foreground">{emptyLabel}</span>
      ),
  },
  {
    header: t("breakdown.colUnits"),
    accessorKey: "units",
    meta: { numeric: true },
    cell: ({ row }) => row.original.units.toLocaleString(),
  },
  {
    header: t("breakdown.colCost"),
    accessorKey: "cost",
    meta: { numeric: true },
    cell: ({ row }) => <MoneyCell value={row.original.cost} emptyText="—" showZero />,
  },
  unpricedColumn<GroupRow>(t),
];

const CostMath = ({ counters, detail }: { counters: CounterRow[]; detail: GuardrailUsageDetail }) => {
  const t = useTranslations("guardrailsMonitor");
  return (
    <CalcPopover title={t("overview.costTitle")} formula="priced units × price per unit = cost, per counter">
      <MathTable rows={counters.map(counterMathRow)} total={formatCost(detail.cost)} />
      <p className="text-xs text-muted-foreground">{t("breakdown.costMathDesc")}</p>
      <UnpricedNote unpriced={detail.untracked_usage_units} provider={detail.provider} />
    </CalcPopover>
  );
};

const UnitsMath = ({ units }: { units: GuardrailUsageDetail["usage_units"] }) => {
  const t = useTranslations("guardrailsMonitor");
  return (
    <CalcPopover title={t("breakdown.unitsMathTitle")} formula="counter + counter + … = usage units">
      <MathTable rows={unitsMathRows(units)} total={totalUnits(units).toLocaleString()} />
      <p className="text-xs text-muted-foreground">{t("breakdown.unitsMathDesc")}</p>
    </CalcPopover>
  );
};

const TableHeading = ({ title }: { title: string }) => (
  <h6 className="text-sm font-semibold text-foreground">{title}</h6>
);

export function GuardrailUsageBreakdown({ detail }: { detail: GuardrailUsageDetail }) {
  const t = useTranslations("guardrailsMonitor");
  const counters = counterRows(detail);
  const unpriced = unpricedSummary(detail.untracked_usage_units);
  const teamCols = groupColumns(t, t("breakdown.byTeam"), t("breakdown.noTeam"));
  const keyCols = groupColumns(t, t("breakdown.byKey"), t("breakdown.noKey"));

  return (
    <section className="space-y-4" aria-label={t("breakdown.sectionAria")}>
      <div>
        <h5 className="mb-0 text-base font-semibold text-foreground">{t("breakdown.section")}</h5>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {t("breakdown.desc")}
        </p>
      </div>

      {counters.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("breakdown.empty")}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <MetricCard
              label={t("breakdown.cost")}
              value={formatCost(detail.cost)}
              valueColor={detail.cost != null ? "text-foreground" : "text-muted-foreground"}
              icon={<CircleDollarSign className="size-4" />}
              subtitle={unpriced ?? undefined}
              hint={<CostMath counters={counters} detail={detail} />}
            />
            <MetricCard
              label={t("breakdown.units")}
              value={totalUnits(detail.usage_units).toLocaleString()}
              subtitle={t("breakdown.counters", { count: counters.length })}
              hint={<UnitsMath units={detail.usage_units} />}
            />
          </div>

          <DataTable
            columns={counterColumns(t)}
            data={counters}
            getRowId={(row) => row.counter}
            size="compact"
            toolbar={() => <TableHeading title={t("breakdown.byCounter")} />}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <DataTable
              columns={teamCols}
              data={groupRows(detail.usage_units_by_team, detail.cost_by_team, detail.untracked_usage_units_by_team)}
              getRowId={(row) => row.id || "no-team"}
              size="compact"
              toolbar={() => <TableHeading title={t("breakdown.byTeam")} />}
            />
            <DataTable
              columns={keyCols}
              data={groupRows(detail.usage_units_by_key, detail.cost_by_key, detail.untracked_usage_units_by_key)}
              getRowId={(row) => row.id || "no-key"}
              size="compact"
              toolbar={() => <TableHeading title={t("breakdown.byKey")} />}
            />
          </div>
        </>
      )}
    </section>
  );
}
