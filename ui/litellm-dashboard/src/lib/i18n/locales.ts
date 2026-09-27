export const UI_LOCALE_STORAGE_KEY = "litellm-ui-locale";

export const UI_LOCALES = ["en", "zh-CN"] as const;

export type UiLocale = (typeof UI_LOCALES)[number];

export const DEFAULT_UI_LOCALE: UiLocale = "en";

export function isUiLocale(value: string | null | undefined): value is UiLocale {
  return (UI_LOCALES as readonly string[]).includes(value ?? "");
}

export function localeFromBrowserLanguage(language: string | null | undefined): UiLocale | null {
  return language?.toLowerCase().startsWith("zh") ? "zh-CN" : null;
}

export function resolveInitialLocale(args: {
  storedLocale: string | null;
  browserLanguage: string | null;
}): UiLocale {
  if (isUiLocale(args.storedLocale)) {
    return args.storedLocale;
  }
  return localeFromBrowserLanguage(args.browserLanguage) ?? DEFAULT_UI_LOCALE;
}
