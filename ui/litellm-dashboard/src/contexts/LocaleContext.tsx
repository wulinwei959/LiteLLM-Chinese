"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  ReactNode,
} from "react";
import { NextIntlClientProvider } from "next-intl";

import en from "@/messages/en.json";
import zhCN from "@/messages/zh-CN.json";
import {
  DEFAULT_UI_LOCALE,
  UI_LOCALE_STORAGE_KEY,
  UiLocale,
  isUiLocale,
  localeFromBrowserLanguage,
} from "@/lib/i18n/locales";
import {
  LOCAL_STORAGE_EVENT,
  emitLocalStorageChange,
  getLocalStorageItem,
  setLocalStorageItem,
} from "@/utils/localStorageUtils";

const MESSAGES = {
  en,
  "zh-CN": zhCN,
} as const;

function subscribe(callback: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === UI_LOCALE_STORAGE_KEY) {
      callback();
    }
  };
  const onCustom = (e: Event) => {
    const { key } = (e as CustomEvent).detail;
    if (key === UI_LOCALE_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(LOCAL_STORAGE_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(LOCAL_STORAGE_EVENT, onCustom);
  };
}

function getSnapshot(): UiLocale {
  const stored = getLocalStorageItem(UI_LOCALE_STORAGE_KEY);
  if (isUiLocale(stored)) {
    return stored;
  }
  return localeFromBrowserLanguage(navigator.language) ?? DEFAULT_UI_LOCALE;
}

function getServerSnapshot(): UiLocale {
  return DEFAULT_UI_LOCALE;
}

interface LocaleContextType {
  locale: UiLocale;
  setLocale: (locale: UiLocale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useUiLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useUiLocale must be used within a LocaleProvider");
  }
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: UiLocale) => {
    setLocalStorageItem(UI_LOCALE_STORAGE_KEY, next);
    emitLocalStorageChange(UI_LOCALE_STORAGE_KEY);
  };

  return (
    <NextIntlClientProvider locale={locale} messages={MESSAGES[locale]}>
      <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>
    </NextIntlClientProvider>
  );
};
