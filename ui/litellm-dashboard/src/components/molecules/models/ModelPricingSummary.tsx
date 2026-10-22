import { ModelData, ModelInfo } from "@/components/model_dashboard/types";
import { Badge } from "@/components/ui/badge";
import { formatPerSecondCost } from "@/utils/dataUtils";
import { useTranslations } from "next-intl";

type PricingFields = Pick<
  ModelData,
  "input_cost" | "output_cost" | "output_cost_per_second" | "output_cost_per_second_tiers"
> & { model_info?: Pick<ModelInfo, "pricing_overrides"> };

function PricingSource({ overrides }: { overrides: string[] | undefined }) {
  const t = useTranslations("models.pricingSummary");
  if (overrides === undefined) return null;
  if (overrides.length === 0) {
    return <p className="mt-2 text-xs text-muted-foreground">{t("followsCostMap")}</p>;
  }
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      <Badge variant="outline" className="mr-1">
        {t("customPricing")}
      </Badge>
      {t("overridesCostMap", { fields: overrides.join(", ") })}
    </p>
  );
}

export function ModelPricingSummary({ model }: { model: PricingFields }) {
  const t = useTranslations("models.pricingSummary");
  const perSecond = model.output_cost_per_second;
  const hasPerSecond = perSecond != null;
  const showInput = model.input_cost != null && (!hasPerSecond || Number(model.input_cost) > 0);
  const showOutput = model.output_cost != null && (!hasPerSecond || Number(model.output_cost) > 0);

  if (!showInput && !showOutput && !hasPerSecond) {
    return <p className="mt-2 text-sm text-muted-foreground">-</p>;
  }

  return (
    <div className="mt-2">
      {showInput && <p className="text-sm">{t("inputPrice", { cost: String(model.input_cost) })}</p>}
      {showOutput && <p className="text-sm">{t("outputPrice", { cost: String(model.output_cost) })}</p>}
      {hasPerSecond && <p className="text-sm">{t("outputOnly", { cost: formatPerSecondCost(perSecond) })}</p>}
      {(model.output_cost_per_second_tiers ?? []).map(({ resolution, cost }) => (
        <p key={resolution} className="text-sm">
          {t("outputTier", { resolution, cost: formatPerSecondCost(cost) })}
        </p>
      ))}
      <PricingSource overrides={model.model_info?.pricing_overrides} />
    </div>
  );
}
