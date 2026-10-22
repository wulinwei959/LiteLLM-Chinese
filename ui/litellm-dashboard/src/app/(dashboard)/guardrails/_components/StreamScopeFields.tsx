import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GuardrailField, labelWithHint, type GuardrailFormControl } from "./GuardrailFormField";
import { useTranslations } from "next-intl";
import type { GuardrailsTranslator } from "@/lib/i18n/translators";
import {
  formatGuardrailStreamScope,
  streamScopeOptions,
  type GuardrailStreamScope,
  isGuardrailStreamScope,
} from "./guardrail_info_helpers";

const streamScopeItems = (t: GuardrailsTranslator) =>
  streamScopeOptions(t).map((option) => ({
    label: option.label,
    value: option.value,
  }));

const requestShapeHint = (t: GuardrailsTranslator): string => t("streamScope.hint");

export const StreamScopeFields = ({
  modes,
  value,
  onChange,
}: {
  modes: string[];
  value: Record<string, GuardrailStreamScope>;
  onChange: (next: Record<string, GuardrailStreamScope>) => void;
}) => {
  const t = useTranslations("guardrails");
  if (modes.length === 0) return null;

  return (
    <div className="space-y-3">
      {modes.map((mode) => {
        const selected = value[mode] ?? "both";
        return (
          <div key={mode} className="space-y-1">
            <label htmlFor={`stream-scope-${mode}`} className="block text-sm font-medium text-foreground">
              {t("streamScope.appliesTo", { mode })}
            </label>
            <Select
              items={streamScopeItems(t)}
              value={selected}
              onValueChange={(next: GuardrailStreamScope | null) => {
                if (!isGuardrailStreamScope(next)) return;
                onChange({ ...value, [mode]: next });
              }}
            >
              <SelectTrigger id={`stream-scope-${mode}`} className="w-full">
                <SelectValue placeholder={t("streamScope.both")} />
              </SelectTrigger>
              <SelectContent>
                {streamScopeOptions(t).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
};

export const StreamScopeFormField = ({ control, modes }: { control: GuardrailFormControl; modes: string[] }) => {
  const t = useTranslations("guardrails");
  return (
    <GuardrailField
      control={control}
      name="stream_scope_by_mode"
      label={labelWithHint(t("streamScope.requestShape"), requestShapeHint(t))}
    >
      {({ value, onChange }) => (
        <StreamScopeFields
          modes={modes}
          value={(value as Record<string, GuardrailStreamScope> | undefined) ?? {}}
          onChange={onChange}
        />
      )}
    </GuardrailField>
  );
};

export const GuardrailStreamScopeCaption = ({ raw }: { raw: unknown }) => {
  const t = useTranslations("guardrails");
  const label = formatGuardrailStreamScope(raw, t);
  if (!label) return null;
  return <p className="mt-1 text-sm text-muted-foreground">{label}</p>;
};

export const GuardrailStreamScopeDetail = ({ raw }: { raw: unknown }) => {
  const t = useTranslations("guardrails");
  const label = formatGuardrailStreamScope(raw, t);
  if (!label) return null;
  return (
    <div>
      <p className="font-medium">{t("streamScope.requestShape")}</p>
      <div>{label}</div>
    </div>
  );
};
