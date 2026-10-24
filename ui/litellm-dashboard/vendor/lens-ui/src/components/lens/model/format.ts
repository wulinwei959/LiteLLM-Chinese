import { formatActivityTimestamp as runTime } from "../../../utils/activityTimestamp";
import type { Settings } from "./types";
import { lensTranslate } from "../../../host/lensTranslate";

export { runTime };

export function scopeLabel(settings: Partial<Pick<Settings, "service" | "agent_name" | "filters">>): string {
  return (
    [settings.agent_name, settings.service, ...(settings.filters ?? []).map((f) => `${f.key}: ${f.value}`)]
      .filter(Boolean)
      .join(" · ") || lensTranslate("model.allActivity")
  );
}

export function durationText(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0s";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

export function durationLabel(value: number, base: "minutes" | "hours" = "minutes"): string {
  const minutes = base === "hours" ? value * 60 : value;
  if (minutes >= 1440) {
    const days = Number((minutes / 1440).toFixed(2));
    return `${days} ${days === 1 ? "day" : "days"}`;
  }
  if (minutes % 60 === 0) return `${minutes / 60} ${minutes === 60 ? "hour" : "hours"}`;
  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

export function agoLabel(thenMs: number, nowMs: number): string {
  const seconds = Math.max(0, Math.floor((nowMs - thenMs) / 1000));
  if (seconds < 5) return lensTranslate("model.justNow");
  if (seconds < 60) return lensTranslate("model.value0sAgo", { value0: seconds });
  if (seconds < 3600) return lensTranslate("model.value0mAgo", { value0: Math.floor(seconds / 60) });
  if (seconds < 86400) return lensTranslate("model.value0hAgo", { value0: Math.floor(seconds / 3600) });
  return lensTranslate("model.value0dAgo", { value0: Math.floor(seconds / 86400) });
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 3 }).format(n);
export const when = (value?: string | null) => (value ? runTime(value) : lensTranslate("model.yet"));

export const sourceLabels = { get both() { return lensTranslate("model.tracesRequests"); }, get requests() { return lensTranslate("model.lLMRequests"); }, get traces() { return lensTranslate("model.agentTraces"); } };
