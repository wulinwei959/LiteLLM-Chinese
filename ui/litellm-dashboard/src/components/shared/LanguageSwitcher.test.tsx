import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { chooseSelectOption, renderWithProviders, screen } from "../../../tests/test-utils";

import LanguageSwitcher from "./LanguageSwitcher";
import { UI_LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";

/**
 * The switcher is the only thing that drives the locale through localStorage, so
 * these cases render it unpinned. renderWithProviders pins "zh-CN" by default for
 * translation assertions, which is precisely the path under test here.
 */
const renderSwitcher = () => renderWithProviders(<LanguageSwitcher />, { locale: null });

const browserLanguage = vi.spyOn(window.navigator, "language", "get");

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    window.localStorage.clear();
    browserLanguage.mockReturnValue("en-US");
  });

  it("should render the English labels under an English locale", () => {
    renderSwitcher();

    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent("English");
  });

  it("should follow the browser language when no preference is stored", () => {
    browserLanguage.mockReturnValue("zh-TW");
    renderSwitcher();

    expect(screen.getByText("语言")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveTextContent("简体中文");
  });

  it("should switch the visible text to Chinese and persist the choice", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await chooseSelectOption(user, screen.getByRole("combobox", { name: "Language" }), "简体中文");

    expect(screen.getByText("语言")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveTextContent("简体中文");
    expect(window.localStorage.getItem(UI_LOCALE_STORAGE_KEY)).toBe("zh-CN");
    expect(document.documentElement.lang).toBe("zh-CN");
  });

  it("should restore a stored Chinese preference on mount", async () => {
    window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, "zh-CN");
    renderSwitcher();

    expect(await screen.findByText("语言")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveTextContent("简体中文");
  });
});
