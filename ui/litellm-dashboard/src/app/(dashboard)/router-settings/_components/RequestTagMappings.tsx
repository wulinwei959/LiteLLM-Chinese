import { useTranslations } from "next-intl";

import type { RouterSettingsTranslator } from "@/lib/i18n/translators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

export interface RequestTagMapping {
  header: "baggage";
  key: string;
  value?: string | null;
  tag?: string | null;
  tag_prefix?: string | null;
  required?: boolean;
  require_budgeted_tag?: boolean;
}

interface Props {
  value: unknown;
  disabled?: boolean;
  onChange: (rules: RequestTagMapping[]) => void;
}

const isMapping = (value: unknown): value is RequestTagMapping => {
  if (typeof value !== "object" || value === null) return false;
  return "key" in value && typeof value.key === "string";
};

const modes = (t: RouterSettingsTranslator) => [
  { value: "exact", label: t("mode.exact") },
  { value: "any", label: t("mode.any") },
];

const BAGGAGE_KEY_PATTERN = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const isExact = (rule: RequestTagMapping) => rule.value !== undefined && rule.value !== null;

const mappingProblem = (rule: RequestTagMapping, t: RouterSettingsTranslator): string | null => {
  if (!rule.key) return t("problem.enterBaggageKey");
  if (!BAGGAGE_KEY_PATTERN.test(rule.key)) return t("problem.invalidBaggageKey");
  if (isExact(rule)) {
    if (!rule.value) return t("problem.enterMatchValue");
    return rule.tag ? null : t("problem.enterTag");
  }
  return rule.tag_prefix ? null : t("problem.enterTagPrefix");
};

const matchIdentity = (rule: RequestTagMapping) => JSON.stringify([rule.key, isExact(rule) ? rule.value : null]);

const problemAt = (rules: RequestTagMapping[], index: number, t: RouterSettingsTranslator): string | null => {
  const identity = matchIdentity(rules[index]);
  const duplicated = rules.slice(0, index).some((earlier) => matchIdentity(earlier) === identity);
  return mappingProblem(rules[index], t) ?? (duplicated ? t("problem.duplicateMapping") : null);
};

export const requestTagMappingsAreValid = (value: unknown, t: RouterSettingsTranslator) =>
  Array.isArray(value) && value.every(isMapping) && value.every((_, index) => problemAt(value, index, t) === null);

export function RequestTagMappingsEditor({ value, onChange, disabled = false }: Props) {
  const t = useTranslations("routerSettings.requestTagMappings");
  const rules = Array.isArray(value) ? value.filter(isMapping) : [];
  const update = (index: number, patch: Partial<RequestTagMapping>) =>
    onChange(rules.map((rule, position) => (position === index ? { ...rule, ...patch } : rule)));

  return (
    <div className="min-w-80 space-y-4 whitespace-normal">
      <p className="text-xs text-muted-foreground">{t("hint.exactPriority")}</p>
      {rules.map((rule, index) => {
        const exact = isExact(rule);
        const problem = problemAt(rules, index, t);
        const label = t("label.mapping", { index: index + 1 });
        return (
          <fieldset key={index} disabled={disabled} className="space-y-3 rounded-lg border p-3 disabled:opacity-60">
            <legend className="px-1 text-xs font-medium">{label}</legend>
            <div className="flex items-center gap-2">
              <Select
                items={modes(t)}
                value={exact ? "exact" : "any"}
                onValueChange={(mode) =>
                  update(
                    index,
                    mode === "exact"
                      ? { value: "", tag: "", tag_prefix: undefined }
                      : { value: undefined, tag: undefined, tag_prefix: "" },
                  )
                }
              >
                <SelectTrigger aria-label={t("aria.mode", { label })}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {modes(t).map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("aria.delete", { label })}
                onClick={() => onChange(rules.filter((_, position) => position !== index))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <label className="flex flex-col gap-1 text-xs">
              {t("field.baggageKey")}
              <Input
                aria-label={t("aria.baggageKey", { label })}
                placeholder="entrypoint"
                value={rule.key}
                onChange={(event) => update(index, { key: event.target.value })}
              />
            </label>
            {exact ? (
              <>
                <label className="flex flex-col gap-1 text-xs">
                  {t("field.matchValue")}
                  <Input
                    aria-label={t("aria.matchValue", { label })}
                    value={rule.value ?? ""}
                    onChange={(event) => update(index, { value: event.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs">
                  {t("field.tag")}
                  <Input
                    aria-label={t("aria.tag", { label })}
                    value={rule.tag ?? ""}
                    onChange={(event) => update(index, { tag: event.target.value })}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  {rule.key}={rule.value || "value"} → {rule.tag || "tag"}
                </p>
              </>
            ) : (
              <>
                <label className="flex flex-col gap-1 text-xs">
                  {t("field.tagPrefix")}
                  <Input
                    aria-label={t("aria.tagPrefix", { label })}
                    placeholder="usecase:"
                    value={rule.tag_prefix ?? ""}
                    onChange={(event) => update(index, { tag_prefix: event.target.value })}
                  />
                </label>
                <p className="text-xs text-muted-foreground">
                  {rule.key}=x → {rule.tag_prefix}x
                </p>
              </>
            )}
            {problem ? <p className="text-xs text-destructive">{problem}</p> : null}
            <label className="flex items-center justify-between gap-3 text-xs">
              {t("field.requireMappedValue")}
              <Switch
                aria-label={t("aria.required", { label })}
                checked={rule.required ?? false}
                onCheckedChange={(checked) => update(index, { required: checked })}
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-xs">
              {t("field.requireTagBudget")}
              <Switch
                aria-label={t("aria.requireBudget", { label })}
                checked={rule.require_budgeted_tag ?? false}
                onCheckedChange={(checked) => update(index, { require_budgeted_tag: checked })}
              />
            </label>
          </fieldset>
        );
      })}
      {disabled ? <p className="text-xs text-muted-foreground">{t("hint.managedInYaml")}</p> : null}
      <Button
        disabled={disabled}
        type="button"
        variant="outline"
        onClick={() => onChange([...rules, { header: "baggage", key: "", value: "", tag: "" }])}
      >
        {t("action.addMapping")}
      </Button>
    </div>
  );
}
