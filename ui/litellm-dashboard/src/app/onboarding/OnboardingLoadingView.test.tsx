import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "@/../tests/test-utils";
import { describe, it, expect } from "vitest";
import { OnboardingLoadingView } from "./OnboardingLoadingView";

describe("OnboardingLoadingView", () => {
  it("should expose the loading state to assistive technology", () => {
    render(<OnboardingLoadingView />);
    expect(screen.getByRole("status", { name: "正在加载邀请..." })).toBeInTheDocument();
  });

  it("should apply centering layout classes", () => {
    const { container } = render(<OnboardingLoadingView />);
    expect(container.firstChild).toHaveClass("flex", "justify-center");
  });
});
