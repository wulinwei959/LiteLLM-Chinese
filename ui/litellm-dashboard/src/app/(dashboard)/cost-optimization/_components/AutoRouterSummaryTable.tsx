import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { groupKey, groupLabel, pctLabel, type AutoRouterBenchmarkGroup } from "./autoRouterBenchmarks";
import { usd } from "./costOptimizationUtils";

interface AutoRouterSummaryTableProps {
  groups: readonly AutoRouterBenchmarkGroup[];
  selectedGroup: AutoRouterBenchmarkGroup | null;
}

export default function AutoRouterSummaryTable({ groups, selectedGroup }: AutoRouterSummaryTableProps) {
  const t = useTranslations("costOptimization");
  const visibleGroups = selectedGroup ? [selectedGroup] : groups;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("autoRouter.title")}</CardTitle>
        <CardDescription>{t("autoRouter.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table aria-label={t("autoRouter.title")}>
          <TableHeader>
            <TableRow>
              <TableHead>{t("autoRouter.column.router")}</TableHead>
              <TableHead className="text-right whitespace-normal">
                {t("autoRouter.column.tokensThroughRouter")}
              </TableHead>
              <TableHead className="text-right whitespace-normal">{t("autoRouter.column.costViaRouter")}</TableHead>
              <TableHead className="text-right whitespace-normal">{t("autoRouter.column.costPerMillion")}</TableHead>
              <TableHead className="text-right whitespace-normal">{t("autoRouter.column.savedVsPremium")}</TableHead>
              <TableHead className="text-right">{t("autoRouter.column.percentSaved")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                  {t("autoRouter.empty")}
                </TableCell>
              </TableRow>
            ) : (
              visibleGroups.map((group) => (
                <TableRow key={groupKey(group)}>
                  <TableCell className="font-medium">{groupLabel(group, groups)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {group.total_tokens == null ? "Unavailable" : group.total_tokens.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{usd(group.spend)}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {group.total_tokens != null && group.total_tokens > 0
                      ? usd((group.spend * 1_000_000) / group.total_tokens)
                      : "Unavailable"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {group.saved_spend == null ? "Unavailable" : usd(group.saved_spend)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {group.saved_pct == null ? "Unavailable" : pctLabel(group.saved_pct)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <p className="mt-3 text-xs text-muted-foreground">{t("autoRouter.footnote")}</p>
      </CardContent>
    </Card>
  );
}
