import { useCallback } from "react";
import { useLocale } from "next-intl";

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

/**
 * Formatting for components, with the locale taken from the React context.
 *
 * The module-level helpers above read the document's language attribute, which
 * `LocaleContext` keeps in sync with the provider but only from an effect. A
 * component that renders before that effect sees the wrong locale, and a test
 * that pins the locale on the provider sees none at all. Components therefore
 * read the locale the provider holds.
 *
 * `Intl` is called directly rather than through next-intl's formatter because
 * that one demands an explicit time zone, and the app renders dates in the
 * reader's own zone.
 */
export const useUiFormat = () => {
  const locale = useLocale();
  const resolved: UiLocale = isUiLocale(locale) ? locale : DEFAULT_UI_LOCALE;
  const date = useCallback(
    (value: Date | number, options?: Intl.DateTimeFormatOptions): string => {
      const dateValue = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(dateValue.getTime())) {
        return "Invalid Date";
      }
      return new Intl.DateTimeFormat(resolved, options).format(dateValue);
    },
    [resolved],
  );
  return { date };
};
