import { Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReasoningEffort } from "./complexity_router_tiers";

const PROVIDER_DEFAULT = "__classifier_provider_default__";

type EffortStatus = "supported" | "unsupported" | "unverified" | undefined;

const effortStatusFor = (
  effort: string | undefined,
  explicitlySupported: string[] | null | undefined,
): EffortStatus => {
  if (effort === undefined) return undefined;
  if (!Array.isArray(explicitlySupported)) return "unverified";
  return explicitlySupported.includes(effort) ? "supported" : "unsupported";
};

interface ClassifierReasoningEffortSelectProps {
  model: string;
  value: ReasoningEffort | undefined;
  explicitlySupported: string[] | null | undefined;
  onChange: (value: ReasoningEffort | undefined) => void;
}

const ClassifierReasoningEffortSelect = ({
  model,
  value,
  explicitlySupported,
  onChange,
}: ClassifierReasoningEffortSelectProps) => {
  const t = useTranslations("models.addModel");
  const status = effortStatusFor(value, explicitlySupported);
  const options = Array.from(new Set([...(explicitlySupported ?? []), ...(value ? [value] : [])]));

  if (!model || options.length === 0) return null;

  const optionLabel = (effort: string): string => {
    if (effort !== value) return effort;
    if (status === "unsupported") return t("effortUnsupportedOption", { effort });
    if (status === "unverified") return t("effortUnverifiedOption", { effort });
    return effort;
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <strong className="font-semibold">{t("reasoningEffort")}</strong>
        <SimpleTooltip content={t("classifierEffortHint")}>
          <Info className="size-4 text-muted-foreground" />
        </SimpleTooltip>
      </div>
      <Select
        items={[
          { value: PROVIDER_DEFAULT, label: t("effortDefault") },
          ...options.map((effort) => ({ value: effort, label: optionLabel(effort) })),
        ]}
        value={value ?? PROVIDER_DEFAULT}
        onValueChange={(effort: string | null) =>
          effort && onChange(effort === PROVIDER_DEFAULT ? undefined : (effort as ReasoningEffort))
        }
      >
        <SelectTrigger aria-label={t("classifierEffortAria", { model })} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={PROVIDER_DEFAULT}>{t("effortDefault")}</SelectItem>
          {options.map((effort) => (
            <SelectItem key={effort} value={effort}>
              {optionLabel(effort)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {status === "unverified" && (
        <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{t("effortUnverifiedWarning")}</p>
      )}
      {status === "unsupported" && (
        <p className="mt-1 text-xs text-destructive">{t("effortUnsupportedWarning")}</p>
      )}
    </div>
  );
};

export default ClassifierReasoningEffortSelect;
