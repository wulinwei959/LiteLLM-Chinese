import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { chooseSelectOption, renderWithProviders, screen } from "../../../tests/test-utils";

import LanguageSwitcher from "./LanguageSwitcher";
import { UI_LOCALE_STORAGE_KEY } from "@/lib/i18n/locales";

const renderSwitcher = () => renderWithProviders(<LanguageSwitcher />);

describe("LanguageSwitcher", () => {
  it("shows English labels by default", () => {
    renderSwitcher();

    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Language" })).toHaveTextContent("English");
  });

  it("switches the visible text to Chinese and persists the choice", async () => {
    const user = userEvent.setup();
    renderSwitcher();

    await chooseSelectOption(user, screen.getByRole("combobox", { name: "Language" }), "简体中文");

    expect(screen.getByText("语言")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveTextContent("简体中文");
    expect(window.localStorage.getItem(UI_LOCALE_STORAGE_KEY)).toBe("zh-CN");
    expect(document.documentElement.lang).toBe("zh-CN");
  });

  it("restores a stored Chinese preference on mount", async () => {
    window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, "zh-CN");
    renderSwitcher();

    expect(await screen.findByText("语言")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "语言" })).toHaveTextContent("简体中文");
  });
});
