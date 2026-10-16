import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, act, fireEvent } from "@testing-library/react";
import MCPToolSearchSettings from "./MCPToolSearchSettings";
import { renderWithProviders } from "../../../../../tests/test-utils";
import {
  useMCPToolSearchSettings,
  useUpdateMCPToolSearchSettings,
} from "@/app/(dashboard)/hooks/mcpToolSearchSettings/useMCPToolSearchSettings";

vi.mock("@/app/(dashboard)/hooks/mcpToolSearchSettings/useMCPToolSearchSettings", () => ({
  useMCPToolSearchSettings: vi.fn(),
  useUpdateMCPToolSearchSettings: vi.fn(),
}));

vi.mock("@/components/llm_calls/fetch_models", () => ({
  fetchAvailableModels: vi.fn().mockResolvedValue([{ model_group: "text-embedding-3-small", mode: "embedding" }]),
}));

vi.mock("@/lib/toast", () => ({ toast: { success: vi.fn(), fromError: vi.fn() } }));

const mockMutate = vi.fn();

const EDITED_PAYLOAD = {
  embedding_model: "text-embedding-3-small",
  top_k: 8,
  similarity_threshold: 0.25,
  core_tools: ["treasury-get_rates", "weather-forecast"],
};

const STORED = {
  field_schema: {},
  values: {
    embedding_model: "text-embedding-3-small",
    top_k: 3,
    similarity_threshold: 0.25,
    core_tools: ["treasury-get_rates"],
  },
};

type SettingsQuery = ReturnType<typeof useMCPToolSearchSettings>;
type SettingsMutation = ReturnType<typeof useUpdateMCPToolSearchSettings>;

const settled = (data: typeof STORED | undefined, overrides: Partial<SettingsQuery> = {}) =>
  ({ data, isLoading: false, isError: false, error: null, ...overrides }) as SettingsQuery;

async function renderSettings(accessToken: string | null = "token") {
  const result = renderWithProviders(<MCPToolSearchSettings accessToken={accessToken} />);
  await act(async () => {});
  return result;
}

describe("MCPToolSearchSettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useMCPToolSearchSettings).mockReturnValue(settled(STORED));
    vi.mocked(useUpdateMCPToolSearchSettings).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as SettingsMutation);
  });

  it("shows the stored settings and keeps Save disabled until something changes", async () => {
    await renderSettings();

    expect(screen.getByLabelText(/Top K 结果数/i)).toHaveValue(3);
    expect(screen.getByLabelText(/始终优先返回/)).toHaveValue("treasury-get_rates");
    expect(screen.getByRole("slider", { hidden: true })).toHaveAttribute("aria-valuenow", "0.25");
    expect(screen.getByRole("button", { name: /保存设置/ })).toBeDisabled();
  });

  it("sends the edited settings as the proxy's PATCH payload", async () => {
    await renderSettings();

    fireEvent.change(screen.getByLabelText(/Top K 结果数/i), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText(/始终优先返回/), {
      target: { value: "treasury-get_rates\nweather-forecast" },
    });
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /保存设置/ }));
    });

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate.mock.calls[0][0]).toEqual(EDITED_PAYLOAD);
  });

  it("asks the user to log in without a token and surfaces load errors", async () => {
    await renderSettings(null);
    expect(screen.getByText(/请登录/)).toBeInTheDocument();

    vi.mocked(useMCPToolSearchSettings).mockReturnValue(
      settled(undefined, { isError: true, error: new Error("Database not connected") }),
    );
    await renderSettings();
    expect(screen.getByText("Database not connected")).toBeInTheDocument();
  });
});
