import type { UsageTranslator } from "@/lib/i18n/translators";
import { formatNumberWithCommas } from "@/utils/dataUtils";

export interface SummaryTile {
  title: string;
  value: string;
  className?: string;
  tooltip?: string;
  expandable?: boolean;
}

interface SpendSummaryMetadata {
  total_spend: number;
  total_flat_cost?: number;
  total_ptu_hours?: number;
  total_api_requests: number;
  total_successful_requests: number;
  total_failed_requests: number;
  total_tokens: number;
}

export const hasFlatCost = (metadata: SpendSummaryMetadata): boolean => (metadata.total_flat_cost ?? 0) > 0;

export const hasPtuHours = (metadata: SpendSummaryMetadata): boolean => (metadata.total_ptu_hours ?? 0) > 0;

export const buildSummaryTiles = (
  t: UsageTranslator,
  metadata: SpendSummaryMetadata,
  showFlatCost: boolean,
  showPtuHours: boolean = false,
): SummaryTile[] => {
  const flatCost = metadata.total_flat_cost ?? 0;
  const ptuHoursTile: SummaryTile[] = showPtuHours
    ? [
        {
          title: t("entity.ptuHoursTitle"),
          value: formatNumberWithCommas(metadata.total_ptu_hours ?? 0, 2),
          tooltip: t("entity.ptuHoursTooltip"),
        },
      ]
    : [];
  return [
    showFlatCost
      ? {
          title: t("entity.totalCost"),
          value: `$${formatNumberWithCommas(metadata.total_spend + flatCost, 2)}`,
          tooltip: t("entity.totalCostTooltip"),
          expandable: true,
        }
      : { title: t("entity.totalSpend"), value: `$${formatNumberWithCommas(metadata.total_spend, 2)}` },
    { title: t("totalRequests"), value: metadata.total_api_requests.toLocaleString() },
    {
      title: t("metrics.successfulRequests"),
      value: metadata.total_successful_requests.toLocaleString(),
      className: "text-success",
    },
    {
      title: t("metrics.failedRequests"),
      value: metadata.total_failed_requests.toLocaleString(),
      className: "text-destructive",
    },
    { title: t("totalTokens"), value: metadata.total_tokens.toLocaleString() },
    ...ptuHoursTile,
  ];
};

export const buildCostBreakdownTiles = (t: UsageTranslator, metadata: SpendSummaryMetadata): SummaryTile[] => [
  {
    title: t("entity.requestCost"),
    value: `$${formatNumberWithCommas(metadata.total_spend, 2)}`,
    className: "text-info",
    tooltip: t("entity.requestCostTooltip"),
  },
  {
    title: t("entity.flatCost"),
    value: `$${formatNumberWithCommas(metadata.total_flat_cost ?? 0, 2)}`,
    className: "text-violet-600",
    tooltip: t("entity.flatCostTooltip"),
  },
];
