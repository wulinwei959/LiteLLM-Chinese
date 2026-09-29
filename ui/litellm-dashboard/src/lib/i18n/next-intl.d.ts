import type { UiLocale } from "./locales";
import type enMessages from "@/messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: UiLocale;
    Messages: typeof enMessages;
  }
}
