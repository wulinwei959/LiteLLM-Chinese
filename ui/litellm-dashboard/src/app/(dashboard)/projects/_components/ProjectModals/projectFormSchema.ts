import { useTranslations } from "next-intl";
import { z } from "zod/v4";

export const ALL_TEAM_MODELS = "all-team-models";

const repeatsEarlierValue = (values: readonly string[], index: number): boolean =>
  values[index] !== "" && values.indexOf(values[index]) !== index;

type ProjectMessages = ReturnType<typeof useTranslations<"projects">>;

const buildModelLimitSchema = (t: ProjectMessages) =>
  z.object({
    model: z.string().min(1, t("missingModel")),
    tpm: z.number().optional(),
    rpm: z.number().optional(),
    itpm: z.number().optional(),
    otpm: z.number().optional(),
  });

export const buildProjectFormSchema = (t: ProjectMessages) =>
  z
    .object({
      project_alias: z.string().min(1, t("projectNameRequired")),
      team_id: z
        .string()
        .nullable()
        .pipe(z.string({ error: t("teamRequired") }).min(1, t("teamRequired"))),
      description: z.string().optional(),
      models: z.array(z.string()),
      max_budget: z.number().nullish(),
      isBlocked: z.boolean(),
      guardrails: z.array(z.string()).optional(),
      modelLimits: z.array(buildModelLimitSchema(t)).optional(),
      metadata: z
        .array(
          z.object({
            key: z.string().min(1, t("missingKey")),
            value: z.string().min(1, t("missingValue")),
          }),
        )
        .optional(),
    })
    .superRefine((values, ctx) => {
      const models = (values.modelLimits ?? []).map((entry) => entry.model);
      models.forEach((_, index) => {
        if (repeatsEarlierValue(models, index)) {
          ctx.addIssue({ code: "custom", message: t("duplicateModel"), path: ["modelLimits", index, "model"] });
        }
      });

      const keys = (values.metadata ?? []).map((entry) => entry.key);
      keys.forEach((_, index) => {
        if (repeatsEarlierValue(keys, index)) {
          ctx.addIssue({ code: "custom", message: t("duplicateKey"), path: ["metadata", index, "key"] });
        }
      });
    });

export type ProjectFormValues = z.input<ReturnType<typeof buildProjectFormSchema>>;
export type ProjectSubmitValues = z.output<ReturnType<typeof buildProjectFormSchema>>;

export const emptyProjectFormValues: ProjectFormValues = {
  project_alias: "",
  team_id: null,
  description: undefined,
  models: [],
  max_budget: undefined,
  isBlocked: false,
  guardrails: undefined,
  modelLimits: undefined,
  metadata: undefined,
};
