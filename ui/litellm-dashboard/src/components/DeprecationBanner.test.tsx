import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DeprecationBanner } from "./DeprecationBanner";

describe("DeprecationBanner", () => {
  it("names the deprecated feature", () => {
    render(<DeprecationBanner featureName="Workflows" />);

    expect(screen.getByText("Memory 已列入草案废弃清单")).toBeInTheDocument();
    expect(screen.getByText(/Memory 是我们正在考虑移除的多个实验特性之一/)).toBeInTheDocument();
  });

  it("states the target removal date and that the list is not final", () => {
    render(<DeprecationBanner featureName="Memory" />);

    expect(screen.getByText(/最早可能于 2026年9月1日 移除/)).toBeInTheDocument();
    expect(screen.getByText(/这份清单仍是草案，尚未定稿/)).toBeInTheDocument();
  });

  it("links to the deprecation discussion in a new tab without leaking the opener", () => {
    render(<DeprecationBanner featureName="Workflows" />);

    const link = screen.getByRole("link", { name: "废弃讨论" });
    expect(link).toHaveAttribute("href", "https://github.com/BerriAI/litellm/discussions/32090");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("exposes a named close control", () => {
    render(<DeprecationBanner featureName="Memory" />);

    expect(screen.getByRole("button", { name: /关闭/i })).toBeInTheDocument();
  });

  it("hides the banner once the close control is used", async () => {
    const user = userEvent.setup();
    render(<DeprecationBanner featureName="Memory" />);

    await user.click(screen.getByRole("button", { name: /关闭/i }));

    expect(screen.queryByText("Memory 已列入草案废弃清单")).not.toBeInTheDocument();
  });
});
