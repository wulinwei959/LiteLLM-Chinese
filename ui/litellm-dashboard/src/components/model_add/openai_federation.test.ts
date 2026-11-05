import { describe, expect, it } from "vitest";
import { isOpenAIProvider, validateOpenAIFederationApiBase } from "./openai_federation";
import type { ModelAddTranslator } from "@/lib/i18n/translators";
import { enMessagesFor } from "@/../tests/i18nStub";

const t = enMessagesFor("modelAdd") as unknown as ModelAddTranslator;

describe("isOpenAIProvider", () => {
  it.each(["OpenAI", "openai"])("matches %s", (provider) => {
    expect(isOpenAIProvider(provider)).toBe(true);
  });

  it.each(["OpenAI_Compatible", "OpenAI_Text", "Azure", "", null, undefined])("does not match %s", (provider) => {
    expect(isOpenAIProvider(provider)).toBe(false);
  });
});

describe("validateOpenAIFederationApiBase", () => {
  it.each([
    "",
    "  ",
    undefined,
    "https://api.openai.com/v1",
    "https://api.openai.com",
    "https://us.api.openai.com/v1",
    "https://API.OPENAI.COM/v1",
  ])("accepts %s, which the proxy sends the federated token to", (apiBase) => {
    expect(validateOpenAIFederationApiBase(t)(apiBase)).toBe(true);
  });

  it.each([
    "http://api.openai.com/v1",
    "https://api.openai.com.evil.example/v1",
    "https://evilapi.openai.com/v1",
    "https://openai.com/v1",
    "https://gateway.example.com/v1",
    "api.openai.com/v1",
    "not a url",
  ])("refuses %s, which the proxy rejects for workload identity federation", (apiBase) => {
    expect(validateOpenAIFederationApiBase(t)(apiBase)).toEqual(expect.stringContaining("only reaches the OpenAI API"));
  });
});
