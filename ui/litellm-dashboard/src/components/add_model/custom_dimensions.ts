import { z } from "zod";
import type { useTranslations } from "next-intl";
import { DIMENSION_LABEL_KEYS } from "./heuristic_scoring_knobs";

type AddModelTranslator = ReturnType<typeof useTranslations<"models.addModel">>;

const customDimensionShape = {
  name: z.string(),
  weight: z.number(),
  keywords: z.array(z.string()).optional(),
  patterns: z.array(z.string()).optional(),
  scoring_mode: z.enum(["binary", "match_count"]).optional(),
};
const customDimensionSchema = z.object(customDimensionShape);

export type CustomDimension = z.infer<typeof customDimensionSchema>;
export type CustomDimensionRow = CustomDimension & { id: string };

export const hydrateCustomDimensions = (raw: unknown): CustomDimensionRow[] | undefined => {
  if (raw === undefined) return undefined;
  const parsed = z.array(customDimensionSchema).safeParse(raw);
  return parsed.success ? parsed.data.map((row, index) => ({ ...row, id: `stored-${index}` })) : undefined;
};

export const serializeCustomDimensions = (rows: CustomDimensionRow[]): CustomDimension[] =>
  rows.map(({ id: _id, ...dimension }) => dimension);

export const customDimensionsError = (
  t: AddModelTranslator,
  rows: CustomDimensionRow[] | undefined,
  builtinNames: string[] = Object.keys(DIMENSION_LABEL_KEYS),
): string | null => {
  if (!rows) return null;
  if (rows.length > 16) return t("customDimensionLimit");
  const names = rows.map((row) => row.name.toLowerCase());
  for (const [index, row] of rows.entries()) {
    const prefix = t("customDimensionPrefix", { index: index + 1 });
    if (!/^[A-Za-z][A-Za-z0-9_]{0,63}$/.test(row.name)) return prefix + t("customDimensionNameInvalid");
    if (builtinNames.some((name) => name.toLowerCase() === row.name.toLowerCase()))
      return prefix + t("customDimensionBuiltinName");
    if (names.indexOf(row.name.toLowerCase()) !== index) return prefix + t("customDimensionNamesUnique");
    if (!Number.isFinite(row.weight) || row.weight <= 0 || row.weight > 1)
      return prefix + t("customDimensionWeightRange");
    const matchers = [...(row.keywords ?? []), ...(row.patterns ?? [])];
    if (!matchers.length || matchers.some((matcher) => !matcher.trim()))
      return prefix + t("customDimensionMatchersRequired");
    if (
      matchers.length > 32 ||
      matchers.some((matcher) => [...matcher].length > 256) ||
      matchers.reduce((total, matcher) => total + [...matcher].length, 0) > 4096
    )
      return prefix + t("customDimensionMatchersTooLarge");
  }
  return null;
};
