import { afterEach, describe, expect, it } from "vitest";

import { currentUiLocale, formatCurrency, formatDate, formatNumber } from "./format";

const setDocumentLang = (lang: string): void => {
  document.documentElement.lang = lang;
};

afterEach(() => {
  setDocumentLang("en");
});

describe("currentUiLocale", () => {
  it("follows the document language when it names a supported locale", () => {
    setDocumentLang("zh-CN");
    expect(currentUiLocale()).toBe("zh-CN");
  });

  it("falls back to the default locale for an unsupported language", () => {
    setDocumentLang("de-DE");
    expect(currentUiLocale()).toBe("en");
  });
});

describe("formatDate", () => {
  it("formats the date in the current locale", () => {
    setDocumentLang("zh-CN");
    expect(formatDate(new Date(2026, 6, 7), { month: "short", day: "numeric" })).toBe("7月7日");
  });

  it("returns Invalid Date instead of throwing for an unparseable value", () => {
    expect(formatDate(new Date("nonsense"))).toBe("Invalid Date");
  });
});

describe("formatNumber", () => {
  it("groups digits the same way in either locale", () => {
    setDocumentLang("zh-CN");
    expect(formatNumber(1234567.89, { minimumFractionDigits: 2, maximumFractionDigits: 2 })).toBe("1,234,567.89");
  });
});

describe("formatCurrency", () => {
  it("keeps the dollar sign narrow so both locales read the same", () => {
    setDocumentLang("zh-CN");
    expect(
      formatCurrency(1234.56, { currency: "USD", currencyDisplay: "narrowSymbol", maximumFractionDigits: 2 }),
    ).toBe("$1,234.56");
  });
});
