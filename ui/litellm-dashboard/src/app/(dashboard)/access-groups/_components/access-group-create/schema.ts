import { useTranslations } from "next-intl";
import { z } from "zod/v4";

export const buildAccessGroupCreateSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    name: z.string().refine((value) => value.trim() !== "", t("groupNameRequired")),
    description: z.string(),
    modelIds: z.array(z.string()),
    mcpServerIds: z.array(z.string()),
    agentIds: z.array(z.string()),
  });

export type AccessGroupCreateFormValues = z.output<ReturnType<typeof buildAccessGroupCreateSchema>>;
