import { z } from "zod/v4";
import type { useTranslations } from "next-intl";

type OrgFormTranslator = ReturnType<typeof useTranslations<"organizations.orgForm">>;

const isBlank = (value: string): boolean => value.trim() === "";

const isJsonObject = (value: string): boolean => {
  try {
    const parsed: unknown = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed);
  } catch {
    return false;
  }
};

const wholeNumberOrEmpty = (t: OrgFormTranslator) =>
  z.string().refine((value) => isBlank(value) || /^\d+$/.test(value.trim()), t("nonNegativeWholeNumber"));

const amountOrEmpty = (t: OrgFormTranslator) =>
  z
    .string()
    .refine(
      (value) => isBlank(value) || (Number.isFinite(Number(value)) && Number(value) >= 0),
      t("nonNegativeNumber"),
    );

const orgSettingsShape = (t: OrgFormTranslator) => ({
  organization_alias: z.string().min(1, t("nameRequired")),
  models: z.array(z.string()),
  max_budget: amountOrEmpty(t),
  budget_duration: z.string(),
  tpm_limit: wholeNumberOrEmpty(t),
  rpm_limit: wholeNumberOrEmpty(t),
  vector_stores: z.array(z.string()),
  mcp: z.object({
    servers: z.array(z.string()),
    accessGroups: z.array(z.string()),
    toolsets: z.array(z.string()),
  }),
  metadata: z.string().refine((value) => isBlank(value) || isJsonObject(value), t("metadataInvalidJson")),
});

export const orgSettingsSchema = (t: OrgFormTranslator) => z.object(orgSettingsShape(t));

export type OrgSettingsFormValues = z.output<ReturnType<typeof orgSettingsSchema>>;
