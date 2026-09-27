"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useTranslations } from "next-intl";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUiLocale } from "@/contexts/LocaleContext";
import { cn } from "@/lib/cva.config";
import { UI_LOCALES, UiLocale, isUiLocale } from "@/lib/i18n/locales";

// Language names render in their own language in every locale, per common switcher convention.
const LOCALE_LABELS: Record<UiLocale, string> = {
  en: "English",
  "zh-CN": "简体中文",
};

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
  const t = useTranslations("common");
  const { locale, setLocale } = useUiLocale();

  return (
    <div className={cn("flex w-full items-center justify-between gap-2", className)}>
      <div className="flex items-center gap-2">
        <Globe className="size-4" />
        <span className="text-muted-foreground">{t("language")}</span>
      </div>
      <Select
        value={locale}
        onValueChange={(next) => {
          if (isUiLocale(next)) {
            setLocale(next);
          }
        }}
      >
        <SelectTrigger size="sm" aria-label={t("language")} className="w-[120px]">
          <SelectValue>{() => LOCALE_LABELS[locale]}</SelectValue>
        </SelectTrigger>
        <SelectContent align="start">
          {UI_LOCALES.map((available) => (
            <SelectItem key={available} value={available}>
              {LOCALE_LABELS[available]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
