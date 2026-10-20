import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";

import zh from "@/messages/zh-CN.json";
import { errorPatternReplacement, errorPatterns } from "./errorPatterns";

const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "models.health" });

describe("errorPatterns", () => {
  it("replaces a matched error with its localized wording", () => {
    const missingKey = errorPatterns.find((entry) => entry.pattern.test("Missing OpenAI API Key"));
    expect(missingKey).toBeDefined();
    expect(errorPatternReplacement(t, missingKey!)).toBe("缺少 API 密钥");
  });

  it("localizes a rate limit error", () => {
    const rateLimit = errorPatterns.find((entry) => entry.pattern.test("429 Too Many Requests rate limit"));
    expect(rateLimit).toBeDefined();
    expect(errorPatternReplacement(t, rateLimit!)).toBe("超过速率限制");
  });

  it("localizes a wrapped authentication error", () => {
    const authentication = errorPatterns.find((entry) => entry.pattern.test("litellm.AuthenticationError"));
    expect(authentication).toBeDefined();
    expect(errorPatternReplacement(t, authentication!)).toBe("认证失败");
  });

  it("leaves an unmatched error to the caller's own fallback", () => {
    expect(errorPatterns.some((entry) => entry.pattern.test("something else entirely"))).toBe(false);
  });
});
