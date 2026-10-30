import React from "react";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type AutoRouterPreset } from "@/lib/autorouter_presets";

export type PresetAvailability =
  | { kind: "available"; viaDeployments: boolean }
  | { kind: "loading" }
  | { kind: "unverifiable" }
  | { kind: "missing_models"; models: readonly string[] };

type Props = {
  selectedPreset?: string;
  presets: AutoRouterPreset[];
  presetAvailability: (preset: AutoRouterPreset) => PresetAvailability;
  onPresetChange: (key: string | undefined) => void;
  pending: boolean;
  unavailable: boolean;
  onRetry: () => void;
};

// Every non-"available" state disables the option. Selection derives from this same function
// (see presetAvailability below), so an option a caller can click is always one that can be applied.
const presetDisabledHint = (t: ReturnType<typeof useTranslations<"models.addModel">>, availability: PresetAvailability): string | null => {
  switch (availability.kind) {
    case "available":
      return null;
    case "loading":
      return t("presetCheckingAvailability");
    case "unverifiable":
      return t("presetCannotVerify");
    case "missing_models":
      return t("presetMissingModels", { models: availability.models.join(", ") });
  }
};

// "loading"/"unverifiable" are transient system states, not a gap specific to this preset; only a
// caller-specific missing-model reason gets the alarming red treatment.
const isPresetHintAlarming = (availability: PresetAvailability): boolean => availability.kind === "missing_models";

export default function AutoRouterPresetSelect({
  selectedPreset,
  presets,
  presetAvailability,
  onPresetChange,
  pending,
  unavailable,
  onRetry,
}: Props) {
  const t = useTranslations("models.addModel");
  const sortedPresetOptions = React.useMemo(
    () =>
      presets
        .map((preset) => ({ preset, availability: presetAvailability(preset) }))
        .sort((a, b) => Number(b.availability.kind === "available") - Number(a.availability.kind === "available")),
    [presets, presetAvailability],
  );

  const templateItems = React.useMemo(
    () => [
      ...sortedPresetOptions.map(({ preset }) => ({ value: preset.key, label: preset.label })),
      { value: "custom", label: t("presetStartFromScratch") },
    ],
    [sortedPresetOptions, t],
  );

  return (
    <div className="mb-4 w-full space-y-2">
      <div className="space-y-2">
        <Select
          items={templateItems}
          value={selectedPreset ?? null}
          onValueChange={(presetKey: string | null) => onPresetChange(presetKey ?? undefined)}
        >
          <SelectTrigger aria-label={t("presetUseTemplate")} data-testid="template-selector" className="w-full">
            <SelectValue placeholder={t("presetUseTemplate")} />
          </SelectTrigger>
          <SelectContent className="[&_[data-slot=select-item]>div]:min-w-0 [&_[data-slot=select-item]>div]:shrink [&_[data-slot=select-item]>div]:whitespace-normal [&_[data-slot=select-item]>div]:break-words">
            {sortedPresetOptions.map(({ preset, availability: presetState }) => {
              const disabledHint = presetDisabledHint(t, presetState);
              const hintClass = isPresetHintAlarming(presetState) ? "text-destructive" : "text-muted-foreground";
              const matchedHint =
                presetState.kind === "available" && presetState.viaDeployments ? t("presetMatchesDeployments") : null;

              return (
                <SelectItem
                  key={preset.key}
                  value={preset.key}
                  label={preset.label}
                  disabled={disabledHint !== null}
                  title={disabledHint ?? preset.description}
                >
                  <div>
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-xs text-muted-foreground">{preset.description}</div>
                    <div className="text-xs text-muted-foreground">{t("presetReplacesChoices")}</div>
                    {disabledHint && <div className={`text-xs mt-1 ${hintClass}`}>{disabledHint}</div>}
                    {matchedHint && <div className="text-xs mt-1 text-success">{matchedHint}</div>}
                  </div>
                </SelectItem>
              );
            })}
            <SelectSeparator className="mx-0" />
            <SelectItem value="custom" label={t("presetStartFromScratch")}>
              <div>
                <div className="font-medium">{t("presetStartFromScratch")}</div>
                <div className="text-xs text-muted-foreground">{t("presetStartFromScratchDescription")}</div>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{t("presetReplacesChoices")}</p>
        {pending && <div className="text-xs mt-1 text-muted-foreground">{t("presetLoadingTemplates")}</div>}
        {unavailable && (
          <div className="text-xs mt-1 text-destructive">
            {t("presetLoadFailed")}{" "}
            <button type="button" className="underline" onClick={onRetry}>
              {t("retryLabel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
