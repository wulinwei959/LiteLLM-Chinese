import { createTranslator } from "use-intl";
import { DEFAULT_UI_LOCALE, isUiLocale, type UiLocale } from "@/lib/i18n/locales";
import enMessages from "@/messages/en.json";
import zhMessages from "@/messages/zh-CN.json";

const MESSAGES = {
  en: enMessages,
  "zh-CN": zhMessages,
} as const;

const currentUiLocale = (): UiLocale =>
  typeof document !== "undefined" && isUiLocale(document.documentElement.lang)
    ? document.documentElement.lang
    : DEFAULT_UI_LOCALE;

export const createModuleTranslator = <Namespace extends keyof typeof enMessages & string>(namespace: Namespace) => {
  const locale = currentUiLocale();
  return createTranslator({ locale, messages: MESSAGES[locale], namespace });
};
