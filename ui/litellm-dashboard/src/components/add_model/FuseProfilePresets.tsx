import React from "react";
import { useTranslations } from "next-intl";
import { $api } from "@/lib/http/api";
import { SearchSelect } from "@/components/shared/SearchSelect";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  fuseProfileFields,
  selectFuseProfile,
  type FuseProfileField,
  type FuseSettings,
} from "./forecast_classifier_config";

const catalogQueryOptions = {
  staleTime: Infinity,
  gcTime: Infinity,
  retry: false,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

const PROFILE_LABEL_KEYS = {
  efficient_profile: "efficientSolverProfile",
  capable_profile: "capableSolverProfile",
  harness: "harnessProfile",
} as const;

type FusePresetEntry = {
  id: string;
  label: string;
  text: string;
  sources: readonly string[];
  model?: string;
};

type FieldProps = {
  id: string;
  field: FuseProfileField;
  value: FuseSettings;
  onChange: (value: FuseSettings) => void;
  presets: readonly FusePresetEntry[] | undefined;
  catalogVersion: string | undefined;
  customWithoutPreview: ReadonlySet<FuseProfileField>;
  setCustomWithoutPreview: React.Dispatch<React.SetStateAction<ReadonlySet<FuseProfileField>>>;
};

const profileSelectionLabel = (
  t: ReturnType<typeof useTranslations<"models.addModel">>,
  awaitingCustomText: boolean,
  custom: boolean,
): string => {
  if (awaitingCustomText) return t("fuseProfileSelectionAwaiting");
  if (custom) return t("fuseProfileSelectionCustom");
  return t("fuseProfileSelectionPreset");
};

function FuseProfilePresetField({
  id,
  field,
  value,
  onChange,
  presets,
  catalogVersion,
  customWithoutPreview,
  setCustomWithoutPreview,
}: FieldProps) {
  const t = useTranslations("models.addModel");
  const label = t(PROFILE_LABEL_KEYS[field]);
  const presetId = value[`${field}_preset`];
  const preset = presets?.find((entry) => entry.id === presetId);
  const awaitingCustomText = customWithoutPreview.has(field) && value[field] == null && presetId != null;
  const custom = value[field] != null || presetId == null || awaitingCustomText;
  const effectiveText = value[field] ?? preset?.text ?? "";
  const selectionLabel = profileSelectionLabel(t, awaitingCustomText, custom);
  const chooseProfile = (selected: string | null) => {
    if (!selected) return;
    const missingPreview = presetId != null && preset == null && value[field] == null;
    if (selected === "custom" && missingPreview) {
      setCustomWithoutPreview((fields) => new Set([...fields, field]));
      return;
    }
    setCustomWithoutPreview((fields) => new Set([...fields].filter((entry) => entry !== field)));
    onChange(selectFuseProfile(value, field, selected === "custom" ? undefined : selected, effectiveText));
  };
  const editProfile = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (customWithoutPreview.has(field) && event.target.value.trim().length > 0) {
      setCustomWithoutPreview((fields) => new Set([...fields].filter((entry) => entry !== field)));
      onChange(selectFuseProfile(value, field, undefined, event.target.value));
      return;
    }
    onChange({ ...value, [field]: event.target.value });
  };
  const keepSavedPreset = () => {
    if (presetId == null) return;
    setCustomWithoutPreview((fields) => new Set([...fields].filter((entry) => entry !== field)));
    onChange(selectFuseProfile(value, field, presetId, ""));
  };
  const placeholder = field === "harness" ? t("fusePlaceholderHarness") : t("fusePlaceholderSolver");

  return (
    <div className="space-y-2 min-w-0">
      <Label htmlFor={`${id}-${field}-preset`}>{t("fuseProfilePreset", { label })}</Label>
      <SearchSelect
        inputId={`${id}-${field}-preset`}
        aria-label={t("fuseProfilePreset", { label })}
        value={custom ? "custom" : presetId}
        allowClear={false}
        options={[
          { value: "custom", label: t("fuseCustomOption") },
          ...(presets ?? []).map((entry) => ({ value: entry.id, label: entry.label, sublabel: entry.id })),
        ]}
        onValueChange={chooseProfile}
      />
      <Textarea
        aria-label={label}
        value={effectiveText}
        readOnly={!custom}
        maxLength={4000}
        rows={4}
        placeholder={placeholder}
        onChange={editProfile}
      />
      {customWithoutPreview.has(field) && presetId != null && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={t("keepSavedPresetAria", { label: label.toLowerCase() })}
          onClick={keepSavedPreset}
        >
          {t("keepSavedPreset")}
        </Button>
      )}
      {presetId && (
        <div className="space-y-1 text-xs text-muted-foreground break-words">
          <p>
            {selectionLabel}: {presetId}
          </p>
          {preset ? (
            <>
              <p>{t("catalogVersionLabel", { version: catalogVersion ?? "" })}</p>
              {preset.model && <p>{t("fuseModelLabel", { model: preset.model })}</p>}
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {preset.sources.map((source, index) => (
                  <a key={source} href={source} target="_blank" rel="noopener noreferrer" className="underline">
                    {t("fuseSourceLink", { index: index + 1 })}
                  </a>
                ))}
              </div>
            </>
          ) : (
            <p>{t("presetPreviewUnavailable")}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function FuseProfilePresets({
  value,
  onChange,
}: {
  value: FuseSettings;
  onChange: (value: FuseSettings) => void;
}) {
  const t = useTranslations("models.addModel");
  const id = React.useId();
  const [customWithoutPreview, setCustomWithoutPreview] = React.useState<ReadonlySet<FuseProfileField>>(
    () => new Set(),
  );
  const { data, isPending, isError } = $api.useQuery(
    "get",
    "/public/complexity_router/fuse_presets",
    {},
    catalogQueryOptions,
  );
  return (
    <div className="space-y-4 min-w-0">
      <p className="text-xs text-muted-foreground">{t("fuseProfileHelp")}</p>
      {isPending && (
        <p role="status" className="text-xs text-muted-foreground">{t("loadingProfilePresets")}</p>
      )}
      {isError && (
        <p role="status" className="text-xs text-muted-foreground">{t("profilePresetsLoadFailed")}</p>
      )}
      {fuseProfileFields.map((field) => (
        <FuseProfilePresetField
          key={field}
          id={id}
          field={field}
          value={value}
          onChange={onChange}
          presets={field === "harness" ? data?.harnesses : data?.models}
          catalogVersion={data?.version}
          customWithoutPreview={customWithoutPreview}
          setCustomWithoutPreview={setCustomWithoutPreview}
        />
      ))}
    </div>
  );
}
