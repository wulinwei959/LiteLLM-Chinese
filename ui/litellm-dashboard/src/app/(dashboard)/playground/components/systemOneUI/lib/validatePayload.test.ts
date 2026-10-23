import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import zh from "@/messages/zh-CN.json";
import { SYSTEM_ONE_EXAMPLE } from "./example";
import { validateOpenAIDecisionsPayload, validateSystemOnePayload } from "./validatePayload";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "playground.systemOne" });

const requestWith = (fields: Record<string, unknown> = {}) =>
  JSON.stringify({
    state: "A support request",
    questions: { category: { type: "choice", instructions: "Route the message", criteria: { support: "Help" } } },
    ...fields,
  });

describe("validateSystemOnePayload", () => {
  it("rejects empty input", () => {
    const emptyIssue = { path: "root", label: "请求", message: "请求内容不能为空。", severity: "error" };
    expect(validateSystemOnePayload(" ", t).issues).toContainEqual(emptyIssue);
  });

  it("reports JSON syntax errors", () => {
    expect(validateSystemOnePayload("{", t).issues[0]?.path).toBe("syntax");
  });

  it("requires an object root", () => {
    expect(validateSystemOnePayload("[]", t).issues).toContainEqual(
      expect.objectContaining({ path: "root", message: "请求内容必须是 JSON 对象。", severity: "error" }),
    );
  });

  it("requires the state key while accepting null state", () => {
    expect(validateSystemOnePayload(requestWith({ state: undefined }), t).issues).toContainEqual(
      expect.objectContaining({
        path: "state",
        message: "缺少必填属性 'state'。",
        severity: "error",
      }),
    );
    expect(validateSystemOnePayload(requestWith({ state: null }), t).isValid).toBe(true);
  });

  it.each([null, "", 123])("requires a non-empty string model when present: %s", (model) => {
    expect(validateSystemOnePayload(requestWith({ model }), t).issues).toContainEqual(
      expect.objectContaining({ path: "model", message: "模型必须是非空字符串。", severity: "error" }),
    );
  });

  it("requires questions", () => {
    expect(validateSystemOnePayload(JSON.stringify({ state: null }), t).issues).toContainEqual(
      expect.objectContaining({
        path: "questions",
        message: "缺少必填属性 'questions'。",
        severity: "error",
      }),
    );
  });

  it.each([
    [null, "问题必须是非空对象。"],
    [[], "问题必须是非空对象。"],
    ["questions", "问题必须是非空对象。"],
    [{}, "至少需要一个问题。"],
  ])("requires a non-empty questions object: %s", (questions, message) => {
    expect(validateSystemOnePayload(requestWith({ questions }), t).issues).toContainEqual(
      expect.objectContaining({ path: "questions", message, severity: "error" }),
    );
  });

  it.each([null, [], "question"])("requires each question to be an object: %s", (question) => {
    expect(validateSystemOnePayload(requestWith({ questions: { invalid: question } }), t).issues).toContainEqual(
      expect.objectContaining({
        path: "questions.invalid",
        message: "问题必须是对象。",
        severity: "error",
      }),
    );
  });

  it("requires a supported question type", () => {
    expect(
      validateSystemOnePayload(requestWith({ questions: { invalid: { type: "other", instructions: "Do this" } } }), t)
        .issues,
    ).toContainEqual(
      expect.objectContaining({
        path: "questions.invalid.type",
        message: "问题类型必须是 choice、noul 或 score。",
        severity: "error",
      }),
    );
  });

  it("requires instructions", () => {
    expect(
      validateSystemOnePayload(requestWith({ questions: { category: { type: "noul" } } }), t).issues,
    ).toContainEqual(
      expect.objectContaining({
        path: "questions.category.instructions",
        message: "缺少必填属性 'instructions'。",
        severity: "error",
      }),
    );
  });

  it("requires instructions to be a string", () => {
    const result = validateSystemOnePayload(
      requestWith({
        questions: { category: { type: "choice", instructions: { text: "Route" }, criteria: { support: "Help" } } },
      }),
      t,
    );
    expect(result.isValid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "questions.category.instructions",
        message: "指令必须是字符串。",
        severity: "error",
      }),
    );
  });

  it.each([undefined, null, [], "criteria"])("requires choice criteria as an object: %s", (criteria) => {
    expect(
      validateSystemOnePayload(
        requestWith({ questions: { category: { type: "choice", instructions: "Route", criteria } } }),
        t,
      ).issues,
    ).toContainEqual(
      expect.objectContaining({
        path: "questions.category.criteria",
        message: "选项条件必须是从名称到说明的对象。",
        severity: "error",
      }),
    );
  });

  it("requires choice descriptions to be strings", () => {
    const result = validateSystemOnePayload(
      requestWith({
        questions: { category: { type: "choice", instructions: "Route", criteria: { support: { text: "Help" } } } },
      }),
      t,
    );
    expect(result.isValid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "questions.category.criteria.support",
        message: "选项说明必须是字符串。",
        severity: "error",
      }),
    );
  });

  it.each([{}, Object.fromEntries(Array.from({ length: 256 }, (_, index) => [`option-${index}`, "Description"]))])(
    "requires between 1 and 255 choice criteria",
    (criteria) => {
      expect(
        validateSystemOnePayload(
          requestWith({ questions: { category: { type: "choice", instructions: "Route", criteria } } }),
          t,
        ).issues,
      ).toContainEqual(
        expect.objectContaining({
          path: "questions.category.criteria",
          message: "选项条件必须包含 1 到 255 个选项。",
          severity: "error",
        }),
      );
    },
  );

  it("accepts 1 and 255 choice criteria", () => {
    const one = { first: "First option" };
    const twoHundredFiftyFiveOptions = Object.fromEntries(
      Array.from({ length: 255 }, (_, index) => [`option-${index}`, "Option"]),
    );
    expect(
      validateSystemOnePayload(
        requestWith({ questions: { category: { type: "choice", instructions: "Route", criteria: one } } }),
        t,
      ).isValid,
    ).toBe(true);
    expect(
      validateSystemOnePayload(
        requestWith({
          questions: { category: { type: "choice", instructions: "Route", criteria: twoHundredFiftyFiveOptions } },
        }),
        t,
      ).isValid,
    ).toBe(true);
  });

  it.each([null, {}, "criteria"])("requires score criteria as an array: %s", (criteria) => {
    expect(
      validateSystemOnePayload(
        requestWith({ questions: { urgency: { type: "score", instructions: "Rate urgency", criteria } } }),
        t,
      ).issues,
    ).toContainEqual(
      expect.objectContaining({
        path: "questions.urgency.criteria",
        message: "分数条件必须是等级数组。",
        severity: "error",
      }),
    );
  });

  it("requires at least two score levels", () => {
    expect(
      validateSystemOnePayload(
        requestWith({ questions: { urgency: { type: "score", instructions: "Rate urgency", criteria: ["Low"] } } }),
        t,
      ).issues,
    ).toContainEqual(
      expect.objectContaining({
        path: "questions.urgency.criteria",
        message: "分数条件必须至少包含 2 个等级。",
        severity: "error",
      }),
    );
  });

  it("requires score levels to be strings", () => {
    const result = validateSystemOnePayload(
      requestWith({
        questions: {
          urgency: { type: "score", instructions: "Rate urgency", criteria: ["Low", { level: "High" }] },
        },
      }),
      t,
    );
    expect(result.isValid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "questions.urgency.criteria.1",
        message: "分数等级必须是字符串。",
        severity: "error",
      }),
    );
  });

  it("warns about more than ten score levels without invalidating the request", () => {
    const result = validateSystemOnePayload(
      requestWith({
        questions: {
          urgency: {
            type: "score",
            instructions: "Rate urgency",
            criteria: Array.from({ length: 11 }, () => "Level"),
          },
        },
      }),
      t,
    );
    expect(result.isValid).toBe(true);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "questions.urgency.criteria",
        message: "分数等级超过 10 个可能降低结果质量。",
        severity: "warning",
      }),
    );
  });

  it("labels a score-level warning by its question key even when the key is all digits", () => {
    const result = validateSystemOnePayload(
      requestWith({
        questions: {
          "2": { type: "score", instructions: "Rate urgency", criteria: Array.from({ length: 11 }, () => "Level") },
        },
      }),
      t,
    );
    expect(result.issues.map((issue) => issue.label)).toEqual(["问题“2” 选项"]);
  });

  it("accepts a score question with two levels", () => {
    expect(
      validateSystemOnePayload(
        requestWith({
          questions: { urgency: { type: "score", instructions: "Rate urgency", criteria: ["Low", "High"] } },
        }),
        t,
      ).isValid,
    ).toBe(true);
  });

  it.each([null, [], "criteria"])("requires optional noul criteria to be an object: %s", (criteria) => {
    expect(
      validateSystemOnePayload(
        requestWith({ questions: { escalation: { type: "noul", instructions: "Escalate?", criteria } } }),
        t,
      ).issues,
    ).toContainEqual(
      expect.objectContaining({
        path: "questions.escalation.criteria",
        message: "是 / 否问题的条件如果提供，必须是对象。",
        severity: "error",
      }),
    );
  });

  it("allows omitted noul criteria", () => {
    expect(
      validateSystemOnePayload(
        requestWith({ questions: { escalation: { type: "noul", instructions: "Escalate?" } } }),
        t,
      ).isValid,
    ).toBe(true);
  });

  it("requires noul criteria definitions to be strings", () => {
    const result = validateSystemOnePayload(
      requestWith({
        questions: {
          escalation: {
            type: "noul",
            instructions: "Escalate?",
            criteria: { true: { meaning: "yes" }, false: 1 },
          },
        },
      }),
      t,
    );
    expect(result.isValid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: "questions.escalation.criteria.true",
          message: "是 / 否问题的 true 条件必须是字符串。",
          severity: "error",
        }),
        expect.objectContaining({
          path: "questions.escalation.criteria.false",
          message: "是 / 否问题的 false 条件必须是字符串。",
          severity: "error",
        }),
      ]),
    );
  });

  it("keeps fields outside the known schema so they reach the upstream model", () => {
    const result = validateSystemOnePayload(
      requestWith({
        temperature: 0,
        questions: {
          category: { type: "choice", instructions: "Route", criteria: { support: "Help" }, weight: 2 },
          escalate: { type: "noul", instructions: "Escalate?", criteria: { true: "Yes", unsure: "Maybe" } },
        },
      }),
      t,
    );
    expect(result.payload).toMatchObject({ temperature: 0, questions: { category: { weight: 2 } } });
    expect(result.payload?.questions.escalate).toEqual({
      type: "noul",
      instructions: "Escalate?",
      criteria: { true: "Yes", unsure: "Maybe" },
    });
  });

  it("accepts the built-in example without issues", () => {
    expect(validateSystemOnePayload(JSON.stringify(SYSTEM_ONE_EXAMPLE), t)).toMatchObject({
      isValid: true,
      issues: [],
    });
  });
});

describe("blank context", () => {
  const question = { type: "choice", instructions: "Pick one", criteria: { a: "", b: "" } };

  it.each(["", "   "])("rejects /v1/systemone with state %j even when the schema passes", (state) => {
    const result = validateSystemOnePayload(JSON.stringify({ state, questions: { q: question } }), t, "/v1/systemone");
    expect(result).toMatchObject({ isValid: false, payload: expect.anything() });
    expect(result.issues.map((issue) => issue.path)).toEqual(["state"]);
  });

  it("reports only the missing state while the blank question is still invalid", () => {
    const raw = JSON.stringify({ state: "", questions: { "": { type: "choice", instructions: "", criteria: {} } } });
    expect(validateSystemOnePayload(raw, t, "/v1/systemone").issues.map((issue) => issue.path)).toEqual(["state"]);
    const filled = validateSystemOnePayload(raw.replace('"state":""', '"state":"A ticket"'), t, "/v1/systemone");
    expect(filled.isValid).toBe(false);
    expect(filled.issues).toEqual([
      { path: "questions", label: "问题", message: "请给每个问题起个名字。", severity: "error" },
    ]);
  });

  it("labels a /v1/systemone question by its key even when the key is all digits", () => {
    const raw = JSON.stringify({
      state: "A ticket",
      questions: { "2": { type: "choice", instructions: "", criteria: {} } },
    });
    const labels = validateSystemOnePayload(raw, t, "/v1/systemone").issues.map((issue) => issue.label);
    expect(labels).toContain("问题“2” 选项");
    expect(labels.some((label) => label.startsWith("问题 3"))).toBe(false);
  });

  it("accepts /v1/systemone once the state carries text", () => {
    const raw = JSON.stringify({ state: "A customer wrote in", questions: { q: question } });
    expect(validateSystemOnePayload(raw, t, "/v1/systemone")).toMatchObject({ isValid: true, issues: [] });
  });

  it.each(["", "  ", []])("rejects /v1/decisions with %j input even when the schema passes", (input) => {
    const raw = JSON.stringify({ input, questions: [{ type: "predicate", name: "q", instructions: "Is it?" }] });
    const result = validateOpenAIDecisionsPayload(raw, t);
    expect(result.isValid).toBe(false);
    expect(result.issues.map((issue) => issue.path)).toEqual(["input"]);
  });

  it("labels a /v1/decisions issue by the question's position", () => {
    const duplicateChoices = [{ value: "a" }, { value: "a" }];
    const raw = JSON.stringify({
      input: "Ship it?",
      questions: [
        { type: "predicate", name: "q", instructions: "Is it?" },
        { type: "choice", name: "pick", instructions: "Pick one", choices: duplicateChoices },
      ],
    });
    expect(validateOpenAIDecisionsPayload(raw, t).issues).toEqual([
      {
        path: "questions.1.choices",
        label: "问题 2 choices",
        message: "选项值必须唯一，包括其字符串形式。",
        severity: "error",
      },
    ]);
  });

  it("accepts /v1/decisions once the input carries text", () => {
    const raw = JSON.stringify({
      input: "Ship it?",
      questions: [{ type: "predicate", name: "q", instructions: "Is it?" }],
    });
    expect(validateOpenAIDecisionsPayload(raw, t)).toMatchObject({ isValid: true, issues: [] });
  });
});
