import React from "react";
import { ChartColumnStacked } from "lucide-react";
import { useTranslations } from "next-intl";
import { BarChart, CustomTooltip } from "@/components/shared/charts";
import { MetricWithMetadata } from "@/components/UsagePage/types";
import { Panel } from "../../overview/Primitives";

interface EndpointUsageBarChartProps {
  endpointData?: Record<string, MetricWithMetadata>;
}

const SUCCESS_COLOR = "#2b3fd6";
const FAILED_COLOR = "#ef4444";
const COLORS = [SUCCESS_COLOR, FAILED_COLOR] as const;

const valueFormatter = (value: number) => value.toLocaleString();

const EndpointUsageBarChart: React.FC<EndpointUsageBarChartProps> = ({ endpointData }) => {
  const t = useTranslations("usage.endpointCharts");
  const successfulLabel = t("successful");
  const failedLabel = t("failed");
  const categories = [successfulLabel, failedLabel] as const;
  const chartData = React.useMemo(
    () =>
      Object.entries(endpointData || {}).map(([endpoint, data]) => ({
        endpoint,
        [successfulLabel]: data.metrics.successful_requests,
        [failedLabel]: data.metrics.failed_requests,
      })),
    [endpointData, successfulLabel, failedLabel],
  );

  const totals = React.useMemo(
    () =>
      Object.values(endpointData || {}).reduce(
        (acc, data) => ({
          successful: acc.successful + data.metrics.successful_requests,
          failed: acc.failed + data.metrics.failed_requests,
        }),
        { successful: 0, failed: 0 },
      ),
    [endpointData],
  );

  return (
    <Panel
      icon={ChartColumnStacked}
      title={t("successVsFailed")}
      action={
        <div className="flex shrink-0 items-center gap-3 text-xs text-muted-foreground">
          {[
            { label: successfulLabel, color: SUCCESS_COLOR, total: totals.successful },
            { label: failedLabel, color: FAILED_COLOR, total: totals.failed },
          ].map(({ label, color, total }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-2 rounded-[2px]" style={{ backgroundColor: color }} />
              <span>{label}</span>
              <span className="tabular-nums text-foreground">{total.toLocaleString()}</span>
            </span>
          ))}
        </div>
      }
    >
      <BarChart
        className="h-64"
        data={chartData}
        index="endpoint"
        categories={categories}
        colors={COLORS}
        valueFormatter={valueFormatter}
        customTooltip={CustomTooltip}
        showLegend={false}
        stack={true}
        maxBarSize={48}
        yAxisWidth={56}
      />
    </Panel>
  );
};

export default EndpointUsageBarChart;
