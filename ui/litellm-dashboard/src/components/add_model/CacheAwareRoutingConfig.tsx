import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { classificationFrequency, type ComplexityRouterConfigValue } from "./ComplexityRouterConfig";

type CacheAwareTranslator = ReturnType<typeof useTranslations<"addModel">>;

const blockedReason = (value: ComplexityRouterConfigValue, t: CacheAwareTranslator): string | null => {
  if (value.custom_tier_set) return t("cacheAware.blockedBuiltInTiers");
  if (value.adaptive) return t("cacheAware.blockedAdaptive");
  if (classificationFrequency(value) !== "every_request") {
    return t("cacheAware.blockedFrequency");
  }
  if (Object.values(value.tiers).some((models) => models.length > 1)) {
    return t("cacheAware.blockedOnePerTier");
  }
  if (
    Object.values(value.tier_model_params ?? {}).some((models) =>
      Object.values(models).some((params) => Object.keys(params).length > 0),
    )
  ) {
    return t("cacheAware.blockedOverrides");
  }
  return null;
};

const optionalInteger = (raw: string, minimum: number): number | undefined => {
  if (raw.trim() === "") return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? Math.max(minimum, Math.trunc(parsed)) : undefined;
};

const CacheAwareRoutingConfig = ({
  value,
  onChange,
}: {
  value: ComplexityRouterConfigValue;
  onChange: (value: ComplexityRouterConfigValue) => void;
}) => {
  const t = useTranslations("addModel");
  const enabled = value.cache_aware_routing ?? false;
  const reason = blockedReason(value, t);
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Switch
          checked={enabled}
          disabled={!enabled && reason !== null}
          onCheckedChange={(next) => onChange({ ...value, cache_aware_routing: next })}
          aria-label={t("cacheAware.ariaLabel")}
        />
        <span className="text-sm font-medium">{t("cacheAware.title")}</span>
      </div>
      <p className="text-xs text-muted-foreground">{t("cacheAware.description")}</p>
      {reason && (
        <p className="text-xs text-muted-foreground" role="status">
          {enabled && t("cacheAware.skippedHint")}
          {reason}
        </p>
      )}
      {enabled && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="cache-aware-output-tokens">
              {t("cacheAware.expectedOutputTokens")}
            </label>
            <Input
              id="cache-aware-output-tokens"
              type="number"
              min={0}
              step={1}
              placeholder="1024"
              value={value.cache_aware_routing_output_tokens ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  cache_aware_routing_output_tokens: optionalInteger(event.target.value, 0),
                })
              }
              aria-describedby="cache-aware-output-help"
            />
            <p id="cache-aware-output-help" className="mt-1 text-xs text-muted-foreground">
              {t("cacheAware.expectedOutputHint")}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="cache-aware-timeout">
              {t("cacheAware.predictionTimeout")}
            </label>
            <Input
              id="cache-aware-timeout"
              type="number"
              min={1}
              step={1}
              placeholder="2000"
              value={value.cache_aware_routing_timeout_ms ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  cache_aware_routing_timeout_ms: optionalInteger(event.target.value, 1),
                })
              }
              aria-describedby="cache-aware-timeout-help"
            />
            <p id="cache-aware-timeout-help" className="mt-1 text-xs text-muted-foreground">
              {t("cacheAware.predictionTimeoutHint")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CacheAwareRoutingConfig;
