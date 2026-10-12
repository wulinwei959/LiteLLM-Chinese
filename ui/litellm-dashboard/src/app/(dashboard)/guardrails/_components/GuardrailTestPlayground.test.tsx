import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GuardrailTestPlayground from "./GuardrailTestPlayground";

vi.mock("@/components/networking");

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("GuardrailTestPlayground", () => {
  const mockAccessToken = "test-token";
  const mockGuardrails = [
    {
      guardrail_id: "guard-1",
      guardrail_name: "test-guardrail",
      litellm_params: {
        guardrail: "presidio",
        mode: "pre_call",
        default_on: false,
      },
      guardrail_info: {},
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should allow selecting a guardrail and show test panel", async () => {
    /**
     * Tests that clicking on a guardrail selects it and displays the test panel.
     * This validates the core workflow of selecting and testing guardrails.
     */
    const user = userEvent.setup();

    renderWithProviders(
      <GuardrailTestPlayground
        guardrailsList={mockGuardrails}
        isLoading={false}
        accessToken={mockAccessToken}
        onClose={vi.fn()}
      />,
    );

    // Initially, the empty state should be shown
    expect(screen.getByText("选择要测试的护栏")).toBeInTheDocument();

    // Click on the guardrail to select it
    const guardrailItem = screen.getByText("test-guardrail");
    await user.click(guardrailItem);

    // Verify the test panel is now shown
    await waitFor(() => {
      expect(screen.getByText("测试护栏：")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("输入要用护栏测试的文本...")).toBeInTheDocument();
    });

    // Verify the selected count
    expect(screen.getByText("已选择 1 个，共 1 个")).toBeInTheDocument();
  });
});
