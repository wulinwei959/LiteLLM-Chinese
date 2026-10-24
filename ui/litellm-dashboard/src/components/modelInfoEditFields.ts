import type { Dayjs } from "dayjs";
import { z } from "zod";
import type { CommonTranslator, ModelsAddModelTranslator } from "@/lib/i18n/translators";
import type { CacheControlInjectionPoint } from "./add_model/cache_control_settings";
import { utcIsoToPickerValue } from "../utils/ptuDatetime";
import { isMaskedSecret } from "../utils/maskedSecretUtils";
import {
  MAX_COST_PER_PTU_PER_HOUR,
  MAX_PTU_COUNT,
  PTU_COUNT_FIELD,
  PTU_END_FIELD,
  PTU_RATE_FIELD,
  PTU_START_FIELD,
  isFilledPtuValue,
  isNonNegativePtuRate,
  isPositiveWholePtuCount,
  ptuWindowIsOrdered,
} from "../utils/ptuValidation";

type PtuLabelKey = Parameters<CommonTranslator>[0];
type PtuPlaceholderKey = PtuLabelKey;

interface PtuEditField {
  name: string;
  labelKey: PtuLabelKey;
  placeholderKey?: PtuPlaceholderKey;
  input: "number" | "datetime";
  isCount?: boolean;
}

export const PTU_EDIT_FIELDS: PtuEditField[] = [
  {
    name: PTU_COUNT_FIELD,
    labelKey: "ptuCount",
    placeholderKey: "ptuCountPlaceholder",
    input: "number",
    isCount: true,
  },
  { name: PTU_RATE_FIELD, labelKey: "ptuRateLabel", placeholderKey: "ptuRatePlaceholder", input: "number" },
  { name: PTU_START_FIELD, labelKey: "ptuStart", input: "datetime" },
  { name: PTU_END_FIELD, labelKey: "ptuEnd", input: "datetime" },
];

const PRICING_FIELDS = [
  "input_cost",
  "output_cost",
  "cache_read_cost",
  "cache_write_cost",
  "cache_write_cost_1h",
] as const;
export type TouchedPricingField = (typeof PRICING_FIELDS)[number];

const COST_SOURCES: Record<TouchedPricingField, string> = {
  input_cost: "input_cost_per_token",
  output_cost: "output_cost_per_token",
  cache_read_cost: "cache_read_input_token_cost",
  cache_write_cost: "cache_creation_input_token_cost",
  cache_write_cost_1h: "cache_creation_input_token_cost_above_1hr",
};

const scalar = z.union([z.string(), z.number(), z.null()]).optional();
const textish = z.string().optional();

const isBlank = (value: string | number | null | undefined): boolean => value == null || String(value).trim() === "";

export const perMillionToPerToken = scalar
  .refine(
    (perMillion) => isBlank(perMillion) || (Number.isFinite(Number(perMillion)) && Number(perMillion) >= 0),
    "Enter a price of 0 or more",
  )
  .transform((perMillion) => (isBlank(perMillion) ? null : Number(perMillion) / 1_000_000));

const modelEditShape = {
  model_name: textish,
  litellm_model_name: textish,
  api_base: textish,
  custom_llm_provider: textish,
  organization: textish,
  tpm: scalar,
  rpm: scalar,
  max_retries: scalar,
  timeout: scalar,
  stream_timeout: scalar,
  input_cost: perMillionToPerToken,
  output_cost: perMillionToPerToken,
  cache_read_cost: perMillionToPerToken,
  cache_write_cost: perMillionToPerToken,
  cache_write_cost_1h: perMillionToPerToken,
  ptu_count: scalar,
  cost_per_ptu_per_hour: scalar,
  ptu_effective_from: z.custom<Dayjs | null>().nullish(),
  ptu_effective_to: z.custom<Dayjs | null>().nullish(),
  cache_control: z.boolean().optional(),
  cache_control_injection_points: z.array(z.custom<CacheControlInjectionPoint>()).optional(),
  model_access_group: z.array(z.string()).optional(),
  guardrails: z.array(z.string()).optional(),
  vector_store_ids: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  health_check_model: z.string().nullish(),
  litellm_credential_name: z.string().nullish(),
  litellm_extra_params: textish,
  model_info: textish,
  team_id: textish,
};

export type ModelEditFieldName = keyof typeof modelEditShape;

const isJson = (value: string): boolean => {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
};

export const buildSchema = (
  t: ModelsAddModelTranslator,
  ptuEnabled: boolean,
  isFieldTouched: (field: TouchedPricingField) => boolean,
) =>
  z.object(modelEditShape).superRefine((values, ctx) => {
    const reject = (path: ModelEditFieldName, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (values.litellm_extra_params && !isJson(values.litellm_extra_params)) {
      reject("litellm_extra_params", t("invalidJson"));
    }

    // antd validates only mounted fields, and the PTU block does not render when the flag is off.
    if (!ptuEnabled) {
      return;
    }

    if (!isPositiveWholePtuCount(values.ptu_count)) {
      reject("ptu_count", t("ptuCountRange", { max: MAX_PTU_COUNT.toLocaleString() }));
    }
    if (!isNonNegativePtuRate(values.cost_per_ptu_per_hour)) {
      reject("cost_per_ptu_per_hour", t("ptuRateRange", { max: MAX_COST_PER_PTU_PER_HOUR.toLocaleString() }));
    }
    if (isFilledPtuValue(values.ptu_count) !== isFilledPtuValue(values.cost_per_ptu_per_hour)) {
      const message = t("ptuPairRequired");
      reject("ptu_count", message);
      reject("cost_per_ptu_per_hour", message);
    }
    if (isFilledPtuValue(values.ptu_count) && !isFilledPtuValue(values.ptu_effective_from)) {
      reject("ptu_effective_from", t("ptuStartRequired"));
    }
    if (!ptuWindowIsOrdered(values.ptu_effective_from, values.ptu_effective_to)) {
      const message = t("ptuWindowOrder");
      reject("ptu_effective_from", message);
      reject("ptu_effective_to", message);
    }

    for (const field of PRICING_FIELDS) {
      const value = values[field];
      if (
        isFieldTouched(field) &&
        isFilledPtuValue(values.ptu_count) &&
        isFilledPtuValue(value) &&
        Number(value) !== 0
      ) {
        reject(field, t("ptuCostReservedOnly"));
      }
    }
  });

type ModelEditSchema = ReturnType<typeof buildSchema>;
export type ModelEditFormValues = z.input<ModelEditSchema>;
export type ModelEditSubmitValues = z.output<ModelEditSchema>;

const perMillionTokens = (...rates: (number | null | undefined)[]): number | null => {
  const rate = rates.find((candidate) => candidate != null);
  return rate == null ? null : rate * 1_000_000;
};

export const toModelEditFormValues = (localModelData: any, isWildcardModel: boolean): ModelEditFormValues => ({
  model_name: localModelData.model_name,
  litellm_model_name: localModelData.litellm_model_name,
  api_base: localModelData.litellm_params.api_base,
  custom_llm_provider: localModelData.litellm_params.custom_llm_provider,
  organization: localModelData.litellm_params.organization,
  tpm: localModelData.litellm_params.tpm,
  rpm: localModelData.litellm_params.rpm,
  max_retries: localModelData.litellm_params.max_retries,
  timeout: localModelData.litellm_params.timeout,
  stream_timeout: localModelData.litellm_params.stream_timeout,
  input_cost: perMillionTokens(
    localModelData.litellm_params.input_cost_per_token,
    localModelData.model_info?.input_cost_per_token,
  ),
  output_cost: perMillionTokens(
    localModelData.litellm_params?.output_cost_per_token,
    localModelData.model_info?.output_cost_per_token,
  ),
  ptu_count: localModelData.model_info?.ptu_count ?? null,
  cost_per_ptu_per_hour: localModelData.model_info?.cost_per_ptu_per_hour ?? null,
  ptu_effective_from: utcIsoToPickerValue(localModelData.model_info?.ptu_effective_from),
  ptu_effective_to: utcIsoToPickerValue(localModelData.model_info?.ptu_effective_to),
  cache_read_cost: perMillionTokens(
    localModelData.litellm_params?.cache_read_input_token_cost,
    localModelData.model_info?.cache_read_input_token_cost,
  ),
  cache_write_cost: perMillionTokens(
    localModelData.litellm_params?.cache_creation_input_token_cost,
    localModelData.model_info?.cache_creation_input_token_cost,
  ),
  cache_write_cost_1h: perMillionTokens(
    localModelData.litellm_params?.cache_creation_input_token_cost_above_1hr,
    localModelData.model_info?.cache_creation_input_token_cost_above_1hr,
  ),
  cache_control: localModelData.litellm_params?.cache_control_injection_points ? true : false,
  cache_control_injection_points: localModelData.litellm_params?.cache_control_injection_points || [],
  model_access_group: Array.isArray(localModelData.model_info?.access_groups)
    ? localModelData.model_info.access_groups
    : [],
  guardrails: Array.isArray(localModelData.litellm_params?.guardrails) ? localModelData.litellm_params.guardrails : [],
  vector_store_ids:
    Array.isArray(localModelData.litellm_params?.vector_store_ids) &&
    localModelData.litellm_params.vector_store_ids.length > 0
      ? localModelData.litellm_params.vector_store_ids
      : undefined,
  tags: Array.isArray(localModelData.litellm_params?.tags) ? localModelData.litellm_params.tags : [],
  // antd never mounted this field for a non-wildcard model, so the key must be absent, not null.
  ...(isWildcardModel ? { health_check_model: localModelData.model_info?.health_check_model } : {}),
  litellm_credential_name: localModelData.litellm_params?.litellm_credential_name ?? null,
  litellm_extra_params: JSON.stringify(
    Object.fromEntries(
      Object.entries(localModelData.litellm_params || {}).filter(
        ([key, value]) => key !== "litellm_credential_name" && !isMaskedSecret(value),
      ),
    ),
    null,
    2,
  ),
  team_id: localModelData.model_info?.team_id ?? undefined,
});

export const displayCost = (localModelData: any, field: TouchedPricingField, notSetLabel: string): string => {
  const key = COST_SOURCES[field];
  const rate = localModelData?.litellm_params?.[key] ?? localModelData?.model_info?.[key];
  return rate != null ? (Number(rate) * 1_000_000).toFixed(4) : notSetLabel;
};
