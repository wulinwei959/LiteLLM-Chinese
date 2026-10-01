"use client";

import React, { useMemo } from "react";
import { useTranslations } from "next-intl";

import SummaryCard from "@/components/shared/SummaryCard";
import {
  autorouterOf,
  cachingOf,
  compressionOf,
  gatewayAttributedCachingOf,
  SAVINGS_DRIVERS,
  savedTokensOf,
  sumOverDays,
  usd,
} from "@/app/(dashboard)/cost-optimization/_components/costOptimizationUtils";
import { DailyData } from "@/components/UsagePage/types";
import { formatNumberWithCommas } from "@/utils/dataUtils";

// The total sums SAVINGS_DRIVERS, so it is by construction the sum of what the
// charts plot; the donut and timelines derive from the same list in costOptimizationUtils.
const useSavingsTotals = (results: DailyData[]) =>
  useMemo(
    () => ({
      compression: sumOverDays(results, compressionOf),
      caching: sumOverDays(results, cachingOf),
      autorouter: sumOverDays(results, autorouterOf),
      gatewayAttributedCaching: sumOverDays(results, gatewayAttributedCachingOf),
      savedTokens: sumOverDays(results, savedTokensOf),
      total: SAVINGS_DRIVERS.reduce((sum, { of }) => sum + sumOverDays(results, of), 0),
    }),
    [results],
  );

const SavingsTiles = ({ results, isLoading }: { results: DailyData[]; isLoading: boolean }) => {
  const totals = useSavingsTotals(results);
  const t = useTranslations("costOptimization");

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label={t("tiles.total")}
        value={usd(totals.total)}
        hint={isLoading ? t("overview.loading") : t("tiles.totalHint")}
        info={t("tiles.totalInfo")}
      />
      <SummaryCard
        label={t("tiles.compression")}
        value={usd(totals.compression)}
        hint={t("tiles.tokens", { count: formatNumberWithCommas(totals.savedTokens) })}
        info={t("tiles.compressionInfo")}
      />
      <SummaryCard
        label={t("tiles.caching")}
        value={usd(totals.gatewayAttributedCaching)}
        hint={t("tiles.injected")}
        secondary={{ label: t("tiles.totalLabel"), value: usd(totals.caching) }}
        info={t("tiles.cachingInfo")}
      />
      <SummaryCard
        label={t("tiles.auto")}
        value={usd(totals.autorouter)}
        hint={t("tiles.autoHint")}
        info={t("tiles.autoInfo")}
      />
    </div>
  );
};

export default SavingsTiles;
