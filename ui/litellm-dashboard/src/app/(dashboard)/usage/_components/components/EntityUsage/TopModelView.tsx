import { BarChart } from "@/components/shared/charts";
import { DataTable } from "@/components/shared/DataTable";
import { MoneyCell } from "@/components/shared/table_cells";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { formatNumberWithCommas } from "@/utils/dataUtils";
import { Segmented } from "../overview/Primitives";
import { providerForModel } from "../overview/modelProvider";

type TopModel = {
  key: string;
  spend: number;
  successful_requests: number;
  failed_requests: number;
  tokens: number;
};

interface TopModelViewProps {
  topModels: TopModel[];
  topModelsLimit: number;
  setTopModelsLimit: (limit: number) => void;
}

const TOP_MODEL_LIMITS = [5, 10, 25, 50];

type ViewMode = "chart" | "table";

const LIMIT_OPTIONS = TOP_MODEL_LIMITS.map((limit) => ({ value: String(limit), label: String(limit) }));
const VIEW_OPTIONS = [
  { value: "table", label: "Table View" },
  { value: "chart", label: "Chart View" },
] as const satisfies readonly { value: ViewMode; label: string }[];

const BAR_COLOR = "#2b3fd6";
const QUIET_HEADER = { headerClassName: "font-normal" };

function ModelName({ name }: { name: string | undefined }) {
  if (!name) return <>-</>;
  const provider = providerForModel(name);
  return (
    <span className="flex min-w-0 items-center gap-2">
      {provider && (
        <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border bg-background">
          <ProviderLogo provider={provider} className="size-3.5 rounded-[3px]" />
        </span>
      )}
      <span className="truncate font-medium text-foreground">{name}</span>
    </span>
  );
}

export default function TopModelView({ topModels, topModelsLimit, setTopModelsLimit }: TopModelViewProps) {
  const t = useTranslations("usage.topModelView");
  const [modelViewMode, setModelViewMode] = useState<"chart" | "table">("table");

  const columns = [
    {
      header: t("colModel"),
      accessorKey: "key",
      meta: QUIET_HEADER,
      cell: (info: any) => <ModelName name={info.getValue()} />,
    },
    {
      header: t("colSpend"),
      accessorKey: "spend",
      meta: { numeric: true, ...QUIET_HEADER },
      cell: (info: any) => <MoneyCell value={info.getValue()} decimals={2} />,
    },
    {
      header: t("colSuccessful"),
      accessorKey: "successful_requests",
      meta: { numeric: true, ...QUIET_HEADER },
      cell: (info: any) => <span className="text-success">{info.getValue()?.toLocaleString() || 0}</span>,
    },
    {
      header: t("colFailed"),
      accessorKey: "failed_requests",
      meta: { numeric: true, ...QUIET_HEADER },
      cell: (info: any) => <span className="text-destructive">{info.getValue()?.toLocaleString() || 0}</span>,
    },
    {
      header: t("colTokens"),
      accessorKey: "tokens",
      meta: { numeric: true, ...QUIET_HEADER },
      cell: (info: any) => info.getValue()?.toLocaleString() || 0,
    },
  ];
  const processedTopModels = topModels.slice(0, topModelsLimit);

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <Tabs value={String(topModelsLimit)} onValueChange={(value: string) => setTopModelsLimit(Number(value))}>
          <TabsList aria-label={t("modelCountAria")}>
            {TOP_MODEL_LIMITS.map((limit) => (
              <TabsTrigger key={limit} value={String(limit)} className="flex-none px-3">
                {limit}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Tabs value={modelViewMode} onValueChange={(value: string) => setModelViewMode(value as "chart" | "table")}>
          <TabsList aria-label={t("viewModeAria")}>
            <TabsTrigger value="table" className="flex-none px-3">
              {t("tableView")}
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex-none px-3">
              {t("chartView")}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {modelViewMode === "chart" ? (
        <div className="relative max-h-[600px] overflow-y-auto">
          <BarChart
            className="cursor-pointer hover:opacity-90"
            style={{ height: Math.min(processedTopModels.length, topModelsLimit) * 52 }}
            data={processedTopModels}
            index="key"
            categories={["spend"]}
            colors={[BAR_COLOR]}
            valueFormatter={(value) => `$${formatNumberWithCommas(value, 2)}`}
            layout="vertical"
            yAxisWidth={200}
            tickGap={5}
            showLegend={false}
          />
        </div>
      ) : (
        <DataTable columns={columns} data={processedTopModels} isLoading={false} maxBodyHeight={600} size="compact" />
      )}
    </>
  );
}
