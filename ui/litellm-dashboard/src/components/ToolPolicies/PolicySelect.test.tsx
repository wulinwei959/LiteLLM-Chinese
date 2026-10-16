import { renderWithProviders, screen } from "../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { PolicySelect, inputPolicyOptions, outputPolicyOptions } from "./PolicySelect";

describe("PolicySelect", () => {
  it("should render the translated label of the selected policy", () => {
    renderWithProviders(<PolicySelect value="untrusted" toolName="test-tool" saving={false} onChange={vi.fn()} />);
    expect(screen.getByText("不受信任")).toBeInTheDocument();
  });

  it("should expose the raw policy value so callers never depend on the label language", () => {
    renderWithProviders(<PolicySelect value="trusted" toolName="test-tool" saving={false} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-policy", "trusted");
    expect(screen.getByText("受信任")).toBeInTheDocument();
  });

  it("should be disabled when saving is true", () => {
    renderWithProviders(<PolicySelect value="untrusted" toolName="test-tool" saving={true} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("should not be disabled when saving is false", () => {
    renderWithProviders(<PolicySelect value="untrusted" toolName="test-tool" saving={false} onChange={vi.fn()} />);
    expect(screen.getByRole("combobox")).toBeEnabled();
  });
});

describe("policy option list", () => {
  it("should offer untrusted, trusted and blocked as input policies", async () => {
    renderWithProviders(<PolicySelect value="untrusted" toolName="test-tool" saving={false} onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: "不受信任" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "受信任" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "已阻止" })).toBeInTheDocument();
  });

  it("should not offer blocked as an output policy", async () => {
    renderWithProviders(
      <PolicySelect value="untrusted" toolName="test-tool" saving={false} onChange={vi.fn()} policyType="output" />,
    );
    await userEvent.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: "不受信任" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "受信任" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "已阻止" })).not.toBeInTheDocument();
  });
});

describe("policy option helpers", () => {
  it("should keep the wire values stable regardless of locale", () => {
    const fakeT = ((key: string) => key) as never;

    expect(inputPolicyOptions(fakeT)).toEqual([
      { value: "untrusted", label: "policyUntrusted", dot: "bg-warning" },
      { value: "trusted", label: "policyTrusted", dot: "bg-success" },
      { value: "blocked", label: "policyBlocked", dot: "bg-destructive" },
    ]);
    expect(outputPolicyOptions(fakeT).map((option) => option.value)).toEqual(["untrusted", "trusted"]);
  });
});
