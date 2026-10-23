import { z } from "zod";
import type { SystemOneTranslator } from "@/lib/i18n/translators";

export type DecisionEndpoint = "/v1/systemone" | "/typesafe/v1/systemone";

const decisionsJson = z.union([z.string(), z.record(z.string(), z.unknown()), z.array(z.unknown())]);
const decisionInstructions = decisionsJson.nullish();

export const buildDecisionsRequestSchema = (t: SystemOneTranslator) => {
  const decisionQuestionSchema = z.discriminatedUnion("type", [
    z.looseObject({
      type: z.literal("choice"),
      instructions: decisionInstructions,
      criteria: z.record(z.string(), decisionsJson.nullable()).refine(
        (value) => {
          const count = Object.keys(value).length;
          return count >= 1 && count <= 255;
        },
        t("validation.choiceCriteriaRange", { count: 255 }),
      ),
    }),
    z
      .looseObject({
        type: z.literal("noul"),
        instructions: decisionInstructions,
        criteria: z.partialRecord(z.enum(["true", "false"]), decisionsJson.nullable()).nullish(),
      })
      .refine((value) => value.instructions != null || value.criteria != null, {
        message: t("validation.noulNeedsInstructionsOrCriteria"),
      }),
    z.looseObject({
      type: z.literal("score"),
      instructions: decisionInstructions,
      criteria: z.array(decisionsJson).min(1).max(10),
    }),
  ]);

  return z.looseObject({
    model: z
      .string()
      .refine((value) => value.trim().length > 0, t("validation.modelNonEmpty"))
      .optional(),
    state: decisionsJson,
    questions: z.record(z.string().min(1), decisionQuestionSchema).refine(
      (value) => {
        const count = Object.keys(value).length;
        return count >= 1 && count <= 128;
      },
      t("validation.questionsRange", { count: 128 }),
    ),
  });
};

export type DecisionRequest = z.infer<ReturnType<typeof buildDecisionsRequestSchema>>;
export type SystemOneRequest = z.infer<ReturnType<typeof buildSystemOneRequestSchema>>;
export type PlaygroundRequest = SystemOneRequest | DecisionRequest;
export type SystemOneQuestion = z.infer<ReturnType<typeof buildSystemOneQuestionSchema>>;
export type PlaygroundQuestion = SystemOneQuestion | DecisionRequest["questions"][string];

const MAX_CHOICE_OPTIONS = 255;

const nonEmptyString = (message: string) =>
  z.string({ error: message }).refine((value) => value.trim().length > 0, message);

const buildSystemOneQuestionSchema = (t: SystemOneTranslator) => {
  const instructions = z.string({
    error: (iss) =>
      iss.input === undefined ? t("validation.instructionsMissing") : t("validation.instructionsNotString"),
  });

  const choiceQuestionSchema = z.looseObject({
    type: z.literal("choice"),
    instructions,
    criteria: z
      .record(z.string(), z.string({ error: t("validation.choiceDescriptionsNotStrings") }), {
        error: t("validation.choiceCriteriaNotMap"),
      })
      .refine(
        (criteria) => {
          const count = Object.keys(criteria).length;
          return count >= 1 && count <= MAX_CHOICE_OPTIONS;
        },
        t("validation.choiceCriteriaRange", { count: MAX_CHOICE_OPTIONS }),
      ),
  });

  const noulQuestionSchema = z.looseObject({
    type: z.literal("noul"),
    instructions,
    criteria: z
      .looseObject(
        {
          true: z.string({ error: t("validation.noulTrueNotString") }).optional(),
          false: z.string({ error: t("validation.noulFalseNotString") }).optional(),
        },
        { error: t("validation.noulCriteriaNotObject") },
      )
      .optional(),
  });

  const scoreQuestionSchema = z.looseObject({
    type: z.literal("score"),
    instructions,
    criteria: z
      .array(z.string({ error: t("validation.scoreLevelsNotStrings") }), {
        error: t("validation.scoreCriteriaNotArray"),
      })
      .min(2, t("validation.scoreMinLevels", { count: 2 })),
  });

  const QUESTION_ERROR_MESSAGES: Partial<Record<z.core.$ZodIssue["code"], string>> = {
    invalid_union: t("validation.questionTypeInvalid"),
    invalid_type: t("validation.questionNotObject"),
  };

  return z.discriminatedUnion("type", [choiceQuestionSchema, noulQuestionSchema, scoreQuestionSchema], {
    error: (iss) => QUESTION_ERROR_MESSAGES[iss.code],
  });
};

export const buildSystemOneRequestSchema = (t: SystemOneTranslator) =>
  z.looseObject(
    {
      model: nonEmptyString(t("validation.modelNonEmpty")).optional(),
      state: z.unknown().nonoptional({ error: t("validation.stateMissing") }),
      questions: z
        .record(z.string(), buildSystemOneQuestionSchema(t), {
          error: (iss) =>
            iss.input === undefined ? t("validation.questionsMissing") : t("validation.questionsNotObject"),
        })
        .refine((questions) => Object.keys(questions).length > 0, t("validation.questionRequired")),
    },
    { error: t("validation.payloadNotObject") },
  );

const probability = z.number().finite().min(0).max(1);
const probabilities = z.record(z.string(), probability);

const noulAnswerSchema = z.looseObject({ type: z.literal("noul"), noul: probability });

const choiceAnswerShape = {
  type: z.literal("choice"),
  choice: z.string(),
  confidence: probability.optional(),
  probabilities,
};
const choiceAnswerSchema = z.looseObject(choiceAnswerShape);

const scoreAnswerShape = {
  type: z.literal("score"),
  score: z.number().finite(),
  confidence: probability.optional(),
  legend: z.record(z.string(), decisionsJson).optional(),
  probabilities,
};
const scoreAnswerSchema = z.looseObject(scoreAnswerShape);

const tokenCount = z.number().finite().nonnegative();

export const systemOneResponseSchema = z.looseObject({
  model: nonEmptyString("Model must be a non-empty string.").nullish(),
  answers: z.record(
    z.string(),
    z.discriminatedUnion("type", [noulAnswerSchema, choiceAnswerSchema, scoreAnswerSchema]),
  ),
  usage: z.looseObject({ input_tokens: tokenCount, output_tokens: tokenCount }).nullish(),
});

export type SystemOneResponse = z.infer<typeof systemOneResponseSchema>;
export type SystemOneAnswer = SystemOneResponse["answers"][string];
