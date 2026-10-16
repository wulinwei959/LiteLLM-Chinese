import React from "react";
import { useTranslations } from "next-intl";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Database,
  DatabaseBackup,
  DollarSign,
  Hash,
  History,
  Lightbulb,
  Wrench,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PROMPT_CACHE_CREATION_TOOLTIP, PROMPT_CACHE_READ_TOOLTIP } from "@/utils/promptCacheUsage";

export interface TokenUsage {
  completionTokens?: number;
  promptTokens?: number;
  totalTokens?: number;
  reasoningTokens?: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
  cost?: number;
  servedFromResponseCache?: boolean;
}

interface ResponseMetricsProps {
  timeToFirstToken?: number;
  totalLatency?: number;
  usage?: TokenUsage;
  toolName?: string;
}

interface MetricItemProps {
  label: string;
  tooltip: string;
  icon: React.ReactNode;
  value: string;
}

function MetricItem({ label, tooltip, icon, value }: MetricItemProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={<div className="flex items-center gap-1" aria-label={`${label}: ${value}`} />}>
        {icon}
        <span>
          {label}: {value}
        </span>
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

function ResponseCacheIndicator() {
  const t = useTranslations("chatUi");
  return (
    <MetricItem
      label={t("responseCache")}
      tooltip={t("responseCacheTooltip")}
      icon={<History className="size-3" aria-hidden="true" />}
      value={t("hit")}
    />
  );
}

function PromptCacheChips({ usage }: { usage?: TokenUsage }) {
  const t = useTranslations("chatUi");
  if (usage?.servedFromResponseCache) {
    return <ResponseCacheIndicator />;
  }

  const readTokens = usage?.cacheReadTokens ?? 0;
  const creationTokens = usage?.cacheCreationTokens ?? 0;

  return (
    <>
      {readTokens > 0 && (
        <MetricItem
          label={t("cacheRead")}
          tooltip={PROMPT_CACHE_READ_TOOLTIP}
          icon={<Database className="size-3" aria-hidden="true" />}
          value={String(readTokens)}
        />
      )}

      {creationTokens > 0 && (
        <MetricItem
          label={t("cacheWrite")}
          tooltip={PROMPT_CACHE_CREATION_TOOLTIP}
          icon={<DatabaseBackup className="size-3" aria-hidden="true" />}
          value={String(creationTokens)}
        />
      )}
    </>
  );
}

const ResponseMetrics: React.FC<ResponseMetricsProps> = ({ timeToFirstToken, totalLatency, usage, toolName }) => {
  const t = useTranslations("chatUi");
  if (!timeToFirstToken && !totalLatency && !usage) return null;

  return (
    <div className="response-metrics mt-2 flex flex-wrap gap-3 border-t border-border pt-2 text-xs text-muted-foreground">
      {timeToFirstToken !== undefined && (
        <MetricItem
          label={t("ttft")}
          tooltip={t("ttftTooltip")}
          icon={<Clock className="size-3" aria-hidden="true" />}
          value={`${(timeToFirstToken / 1000).toFixed(2)}s`}
        />
      )}

      {totalLatency !== undefined && (
        <MetricItem
          label={t("totalLatency")}
          tooltip={t("totalLatencyTooltip")}
          icon={<Clock className="size-3" aria-hidden="true" />}
          value={`${(totalLatency / 1000).toFixed(2)}s`}
        />
      )}

      {usage?.promptTokens !== undefined && (
        <MetricItem
          label={t("in")}
          tooltip={t("inTooltip")}
          icon={<ArrowDownToLine className="size-3" aria-hidden="true" />}
          value={String(usage.promptTokens)}
        />
      )}

      <PromptCacheChips usage={usage} />

      {usage?.completionTokens !== undefined && (
        <MetricItem
          label={t("out")}
          tooltip={t("outTooltip")}
          icon={<ArrowUpFromLine className="size-3" aria-hidden="true" />}
          value={String(usage.completionTokens)}
        />
      )}

      {usage?.reasoningTokens !== undefined && (
        <MetricItem
          label={t("reasoning")}
          tooltip={t("reasoningTooltip")}
          icon={<Lightbulb className="size-3" aria-hidden="true" />}
          value={String(usage.reasoningTokens)}
        />
      )}

      {usage?.totalTokens !== undefined && (
        <MetricItem
          label={t("total")}
          tooltip={t("totalTooltip")}
          icon={<Hash className="size-3" aria-hidden="true" />}
          value={String(usage.totalTokens)}
        />
      )}

      {typeof usage?.cost === "number" && Number.isFinite(usage.cost) && (
        <MetricItem
          label={t("cost")}
          tooltip={t("costTooltip")}
          icon={<DollarSign className="size-3" aria-hidden="true" />}
          value={`$${usage.cost.toFixed(6)}`}
        />
      )}

      {toolName && (
        <MetricItem
          label={t("tool")}
          tooltip={t("toolTooltip")}
          icon={<Wrench className="size-3" aria-hidden="true" />}
          value={toolName}
        />
      )}
    </div>
  );
};

export default ResponseMetrics;
