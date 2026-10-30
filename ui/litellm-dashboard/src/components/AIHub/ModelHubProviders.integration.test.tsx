import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { act, fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { chooseSelectOption, renderWithProviders } from "../../../tests/test-utils";
import ModelHubProviders, { ProviderLogo } from "./ModelHubProviders";

function ProviderFilter({ initialProvider = "" }: { initialProvider?: string }) {
  const [provider, setProvider] = useState<string | null>(initialProvider);
  return (
    <ModelHubProviders
      providers={["openai", "anthropic"]}
      selectedProviders={provider ? [provider] : []}
      onSelect={setProvider}
    />
  );
}

describe("ModelHubProviders", () => {
  it("shows the selected provider and its decorative logo", () => {
    renderWithProviders(<ProviderFilter initialProvider="anthropic" />);

    const dropdown = screen.getByRole("combobox", { name: "提供商" });
    expect(dropdown).toHaveTextContent("Anthropic");
    expect(within(dropdown).getByAltText("")).toHaveAttribute("src", expect.stringContaining("anthropic.svg"));
  });

  it("selects a provider and resets the filter back to all providers", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProviderFilter />);

    const dropdown = screen.getByRole("combobox", { name: "提供商" });
    expect(dropdown).toHaveTextContent("全部提供商");
    await chooseSelectOption(user, dropdown, "OpenAI");
    expect(dropdown).toHaveTextContent("OpenAI");
    await chooseSelectOption(user, dropdown, "全部提供商");
    expect(dropdown).toHaveTextContent("全部提供商");
    expect(within(dropdown).queryByAltText("")).not.toBeInTheDocument();
  });

  it("stays disabled until the initial provider list arrives", () => {
    renderWithProviders(<ModelHubProviders providers={[]} selectedProviders={[]} onSelect={() => undefined} loading />);

    const dropdown = screen.getByRole("combobox", { name: "提供商" });
    expect(dropdown).toBeDisabled();
    expect(dropdown).toHaveTextContent("正在加载提供商");
  });

  it("lets keyboard users open the dropdown and pick a provider", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProviderFilter />);

    const dropdown = screen.getByRole("combobox", { name: "提供商" });
    await user.tab();
    expect(dropdown).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("option", { name: "Anthropic" })).toBeInTheDocument();
    await user.keyboard("{End}{Enter}");
    expect(dropdown).toHaveTextContent("Anthropic");
    expect(dropdown).toHaveFocus();
  });
});

describe("ProviderLogo", () => {
  it("falls back to the provider initial when the logo is unknown", () => {
    renderWithProviders(<ProviderLogo provider="local-models" />);

    expect(screen.getByText("L")).toBeInTheDocument();
    expect(screen.queryByAltText("")).not.toBeInTheDocument();
  });

  it("falls back after a broken logo and loads another provider's logo", () => {
    const { rerender } = renderWithProviders(<ProviderLogo provider="openai" />);

    act(() => fireEvent.error(screen.getByAltText("")));
    expect(screen.getByText("O")).toBeInTheDocument();
    expect(screen.queryByAltText("")).not.toBeInTheDocument();

    rerender(<ProviderLogo provider="anthropic" />);
    expect(screen.getByAltText("")).toHaveAttribute("src", expect.stringContaining("anthropic.svg"));
    expect(screen.queryByText("O")).not.toBeInTheDocument();
  });
});
