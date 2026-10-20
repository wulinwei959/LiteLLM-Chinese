import { DEFAULT_UI_LOCALE, isUiLocale, type UiLocale } from "./locales";

/**
 * The locale the UI is currently rendering in.
 *
 * The choice lives in localStorage and reaches the document through
 * `LocaleContext`, which stamps `document.documentElement.lang`. Reading that
 * attribute keeps formatting helpers usable from plain modules, which have no
 * React context to read from, and matches how `toast.ts` resolves its messages.
 */
export const currentUiLocale = (): UiLocale =>
  typeof document !== "undefined" && isUiLocale(document.documentElement.lang)
    ? document.documentElement.lang
    : DEFAULT_UI_LOCALE;

export const formatDate = (value: Date | number, options?: Intl.DateTimeFormatOptions): string => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat(currentUiLocale(), options).format(date);
};

export const formatTime = (value: Date | number, options?: Intl.DateTimeFormatOptions): string =>
  new Intl.DateTimeFormat(currentUiLocale(), { ...options, timeStyle: options?.timeStyle ?? "short" }).format(value);

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat(currentUiLocale(), options).format(value);

export const formatCurrency = (
  value: number,
  options: Omit<Intl.NumberFormatOptions, "style"> & { readonly currency?: string },
): string => {
  const { currency = "USD", ...rest } = options;
  return new Intl.NumberFormat(currentUiLocale(), { ...rest, style: "currency", currency }).format(value);
};
