import { z } from "zod";
import type { useTranslations } from "next-intl";

type AddModelTranslator = ReturnType<typeof useTranslations<"models.addModel">>;

const sharedShape = (t: AddModelTranslator) => ({
  auto_router_name: z.string().min(1, t("autoRouterNameRequired")),
  model_access_group: z.array(z.string()),
});

const complexityRouterShape = (t: AddModelTranslator) => ({
  ...sharedShape(t),
  auto_router_default_model: z
    .string()
    .nullable()
    .transform((value) => value ?? ""),
  auto_router_embedding_model: z
    .string()
    .nullable()
    .transform((value) => value ?? ""),
});

const semanticRouterShape = (t: AddModelTranslator) => ({
  ...sharedShape(t),
  auto_router_default_model: z
    .string()
    .nullable()
    .pipe(z.string({ error: t("editDefaultModelRequired") }).min(1, t("editDefaultModelRequired"))),
  auto_router_embedding_model: z
    .string()
    .nullable()
    .pipe(z.string({ error: t("editEmbeddingModelRequired") }).min(1, t("editEmbeddingModelRequired"))),
});

export const complexityRouterSchema = (t: AddModelTranslator) => z.object(complexityRouterShape(t));
export const semanticRouterSchema = (t: AddModelTranslator) => z.object(semanticRouterShape(t));

export type EditAutoRouterFormValues = z.infer<ReturnType<typeof semanticRouterSchema>>;

export const EMPTY_FORM_VALUES: z.input<ReturnType<typeof semanticRouterSchema>> = {
  auto_router_name: "",
  auto_router_default_model: null,
  auto_router_embedding_model: null,
  model_access_group: [],
};
