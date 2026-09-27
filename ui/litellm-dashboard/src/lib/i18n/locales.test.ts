import { describe, expect, it } from "vitest";

import {
  DEFAULT_UI_LOCALE,
  isUiLocale,
  localeFromBrowserLanguage,
  resolveInitialLocale,
} from "@/lib/i18n/locales";

describe("isUiLocale", () => {
  it("should accept the supported locales", () => {
    expect(isUiLocale("en")).toBe(true);
    expect(isUiLocale("zh-CN")).toBe(true);
  });

  it("should reject unsupported, empty, and missing values", () => {
    expect(isUiLocale("fr")).toBe(false);
    expect(isUiLocale("")).toBe(false);
    expect(isUiLocale(null)).toBe(false);
    expect(isUiLocale(undefined)).toBe(false);
  });
});

describe("localeFromBrowserLanguage", () => {
  it("should map any Chinese language tag to zh-CN", () => {
    expect(localeFromBrowserLanguage("zh")).toBe("zh-CN");
    expect(localeFromBrowserLanguage("zh-CN")).toBe("zh-CN");
    expect(localeFromBrowserLanguage("zh-TW")).toBe("zh-CN");
    expect(localeFromBrowserLanguage("ZH-HANS-CN")).toBe("zh-CN");
  });

  it("should return null for non-Chinese or missing languages", () => {
    expect(localeFromBrowserLanguage("en-US")).toBeNull();
    expect(localeFromBrowserLanguage("ja")).toBeNull();
    expect(localeFromBrowserLanguage(null)).toBeNull();
    expect(localeFromBrowserLanguage(undefined)).toBeNull();
  });
});

describe("resolveInitialLocale", () => {
  it("should prefer a stored valid locale over the browser language", () => {
    expect(resolveInitialLocale({ storedLocale: "en", browserLanguage: "zh-CN" })).toBe("en");
    expect(resolveInitialLocale({ storedLocale: "zh-CN", browserLanguage: "en-US" })).toBe("zh-CN");
  });

  it("should ignore an invalid stored value and fall back to the browser language", () => {
    expect(resolveInitialLocale({ storedLocale: "fr", browserLanguage: "zh-TW" })).toBe("zh-CN");
  });

  it("should default to English when nothing points to Chinese", () => {
    expect(resolveInitialLocale({ storedLocale: null, browserLanguage: "en-US" })).toBe(
      DEFAULT_UI_LOCALE,
    );
    expect(resolveInitialLocale({ storedLocale: null, browserLanguage: null })).toBe("en");
  });
});
