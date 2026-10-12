import React, { PropsWithChildren } from "react";
import { render, RenderOptions, screen, waitFor } from "@testing-library/react";
import type userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsTestingAdapter, OnUrlUpdateFunction } from "nuqs/adapters/testing";
import { expect } from "vitest";

import { LocaleProvider } from "@/contexts/LocaleContext";
import type { UiLocale } from "@/lib/i18n/locales";

/** Pinned locale for the suite; the catalog translation assertions read. */
const DEFAULT_TEST_LOCALE: UiLocale = "zh-CN";

// Create a client for testing
export const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: false,
    },
  },
});

interface ProviderOptions {
  searchParams?: string | Record<string, string> | URLSearchParams;
  onUrlUpdate?: OnUrlUpdateFunction;
  /**
   * Locale the tree is pinned to. Defaults to "zh-CN", which is what translation
   * assertions want: they read the real Chinese copy rather than a key name. Pass
   * null to leave it unpinned, so the tree follows localStorage and the browser
   * language instead. A test of the locale mechanism itself needs that, because
   * pinning short-circuits the very path it exists to exercise.
   */
  locale?: UiLocale | null;
}

export const renderWithProviders = (ui: React.ReactElement, options?: RenderOptions & ProviderOptions) => {
  const { searchParams, onUrlUpdate, locale = DEFAULT_TEST_LOCALE, ...renderOptions } = options ?? {};
  const Providers: React.FC<PropsWithChildren> = ({ children }) => (
    <NuqsTestingAdapter searchParams={searchParams} onUrlUpdate={onUrlUpdate} hasMemory>
      <QueryClientProvider client={testQueryClient}>
        <LocaleProvider locale={locale ?? undefined}>{children}</LocaleProvider>
      </QueryClientProvider>
    </NuqsTestingAdapter>
  );
  return render(ui, { wrapper: Providers, ...renderOptions });
};

const pointerBlocked = (element: HTMLElement): boolean => {
  for (let node: HTMLElement | null = element; node !== null; node = node.parentElement) {
    if (node.style.pointerEvents === "none") return true;
  }
  return false;
};

export const chooseSelectOption = async (
  user: Pick<ReturnType<typeof userEvent.setup>, "click">,
  trigger: HTMLElement,
  optionName: string | RegExp,
  role: "option" | "menuitem" | "menuitemradio" = "option",
) => {
  await user.click(trigger);
  const option = await screen.findByRole(role, { name: optionName });
  await waitFor(() => expect(pointerBlocked(option)).toBe(false));
  await user.click(option);
};

export * from "@testing-library/react";
