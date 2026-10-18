import { z } from "zod/v4";
import type { UsersTranslator } from "@/lib/i18n/translators";

const isBlank = (value: string): boolean => value.trim() === "";

const amountOrEmpty = (t: UsersTranslator) =>
  z
    .string()
    .refine(
      (value) => isBlank(value) || (Number.isFinite(Number(value)) && Number(value) >= 0),
      t("nonNegativeNumber"),
    );

const defaultTeamRowSchema = (t: UsersTranslator) =>
  z.object({
    team_id: z
      .string()
      .nullable()
      .pipe(z.string({ error: t("infoSelectTeam") }).min(1, t("infoSelectTeam"))),
    max_budget_in_team: amountOrEmpty(t),
    user_role: z.enum(["user", "admin"]),
  });

export type DefaultTeamRowValues = z.input<ReturnType<typeof defaultTeamRowSchema>>;

export const EMPTY_TEAM_ROW: DefaultTeamRowValues = { team_id: null, max_budget_in_team: "", user_role: "user" };

const defaultUserSettingsShape = (t: UsersTranslator) => ({
  user_role: z.string(),
  max_budget: amountOrEmpty(t),
  budget_duration: z.string(),
  models: z.array(z.string()),
  teams: z.array(defaultTeamRowSchema(t)),
});

export const defaultUserSettingsSchema = (t: UsersTranslator) =>
  z.object(defaultUserSettingsShape(t)).superRefine((values, ctx) => {
    const repeatedRows = values.teams.flatMap((team, index) =>
      team.team_id !== "" && values.teams.findIndex((other) => other.team_id === team.team_id) < index ? [index] : [],
    );

    repeatedRows.forEach((index) =>
      ctx.addIssue({
        code: "custom",
        message: t("teamAlreadyListed"),
        path: ["teams", index, "team_id"],
      }),
    );
  });

export type DefaultUserSettingsFormValues = z.input<ReturnType<typeof defaultUserSettingsSchema>>;
export type DefaultUserSettingsSubmitValues = z.output<ReturnType<typeof defaultUserSettingsSchema>>;
