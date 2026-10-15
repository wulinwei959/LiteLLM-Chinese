import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { hasRouterSettings } from "./routerSettingsPayload";

interface RouterSettingsSummaryProps {
  routerSettings: Record<string, unknown> | null | undefined;
  emptyText?: string | undefined;
}

const fallbackEntries = (fallbacks: unknown): Array<[string, string[]]> => {
  if (!Array.isArray(fallbacks)) return [];
  return fallbacks.flatMap((entry) =>
    entry && typeof entry === "object" ? (Object.entries(entry) as Array<[string, string[]]>) : [],
  );
};

export default function RouterSettingsSummary({ routerSettings, emptyText }: RouterSettingsSummaryProps) {
  const t = useTranslations("teams");
  if (!hasRouterSettings(routerSettings)) {
    return <div className="text-muted-foreground">{emptyText ?? t("infoNoRouterSettings")}</div>;
  }

  const settings = routerSettings as Record<string, unknown>;
  const fallbacks = fallbackEntries(settings.fallbacks);

  return (
    <div className="space-y-1 text-sm">
      {settings.routing_strategy != null && (
        <div>
          {t("infoRoutingStrategy")} <Badge variant="secondary">{String(settings.routing_strategy)}</Badge>
        </div>
      )}
      {settings.num_retries != null && <div>{t("infoNumberOfRetries", { value: String(settings.num_retries) })}</div>}
      {settings.allowed_fails != null && (
        <div>{t("infoAllowedFailures", { value: String(settings.allowed_fails) })}</div>
      )}
      {settings.cooldown_time != null && <div>{t("infoCooldownTime", { value: String(settings.cooldown_time) })}</div>}
      {settings.timeout != null && <div>{t("infoTimeout", { value: String(settings.timeout) })}</div>}
      {settings.retry_after != null && <div>{t("infoRetryAfter", { value: String(settings.retry_after) })}</div>}
      {Boolean(settings.enable_tag_filtering) && <div>{t("infoTagFilteringEnabled")}</div>}
      {fallbacks.length > 0 && (
        <div>
          <div>{t("infoFallbacksLabel")}</div>
          <div className="mt-1 space-y-1">
            {fallbacks.map(([model, targets]) => (
              <div key={model} className="text-xs text-muted-foreground">
                <span className="font-medium">{model}</span>
                <span className="mx-1 text-muted-foreground">-&gt;</span>
                {Array.isArray(targets) ? targets.join(", ") : String(targets)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
