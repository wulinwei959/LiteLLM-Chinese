import { render } from "@testing-library/react";
import { fireEvent, act } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import UISettings from "./UISettings";
import { toast } from "@/lib/toast";
import { renderWithProviders, screen } from "@/../tests/test-utils";

const mockUseAuthorized = vi.hoisted(() => vi.fn());
const mockUseUISettings = vi.hoisted(() => vi.fn());
const mockUseUpdateUISettings = vi.hoisted(() => vi.fn());

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  __esModule: true,
  default: mockUseAuthorized,
}));

vi.mock("@/app/(dashboard)/hooks/uiSettings/useUISettings", () => ({
  useUISettings: mockUseUISettings,
}));

vi.mock("@/app/(dashboard)/hooks/uiSettings/useUpdateUISettings", () => ({
  useUpdateUISettings: mockUseUpdateUISettings,
}));

const buildSettingsResponse = (overrides?: Partial<Record<string, unknown>>) => ({
  data: {
    field_schema: {
      description: "UI settings description",
      properties: {
        disable_model_add_for_internal_users: {
          description: "Disable model add for internal users",
        },
        disable_team_admin_delete_team_user: {
          description: "Disable team admin delete team user",
        },
        require_auth_for_public_ai_hub: {
          description: "Require authentication for public AI Hub",
        },
      },
    },
    values: {
      disable_model_add_for_internal_users: false,
      disable_team_admin_delete_team_user: false,
      require_auth_for_public_ai_hub: false,
    },
  },
  isLoading: false,
  isError: false,
  error: null,
  ...overrides,
});

describe("UISettings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthorized.mockReturnValue({ accessToken: "test-token" });
    mockUseUISettings.mockReturnValue(buildSettingsResponse());
    mockUseUpdateUISettings.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      error: null,
    });
  });

  it("should render", () => {
    renderWithProviders(<UISettings />);

    expect(screen.getByText("界面设置")).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Disable model add for internal users" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Disable team admin delete team user" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Require authentication for public AI Hub" })).toBeInTheDocument();
  });

  it("should toggle setting and call update", () => {
    const mutateMock = vi.fn((_settings, options) => {
      options?.onSuccess?.();
    });

    mockUseUpdateUISettings.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });

    renderWithProviders(<UISettings />);

    const toggle = screen.getByRole("switch", { name: "Disable model add for internal users" });

    act(() => {
      fireEvent.click(toggle);
    });

    expect(mutateMock).toHaveBeenCalledWith(
      { disable_model_add_for_internal_users: true },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("界面设置更新成功");
  });

  it("should toggle disable team admin delete team user setting and call update", () => {
    const mutateMock = vi.fn((_settings, options) => {
      options?.onSuccess?.();
    });

    mockUseUpdateUISettings.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });

    renderWithProviders(<UISettings />);

    const toggle = screen.getByRole("switch", { name: "Disable team admin delete team user" });

    act(() => {
      fireEvent.click(toggle);
    });

    expect(mutateMock).toHaveBeenCalledWith(
      { disable_team_admin_delete_team_user: true },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("界面设置更新成功");
  });

  it("disconnects Moyai by patching moyai_url to null", () => {
    const mutateMock = vi.fn((_settings, options) => {
      options?.onSuccess?.();
    });

    mockUseUpdateUISettings.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });
    mockUseUISettings.mockReturnValue(
      buildSettingsResponse({
        data: {
          ...buildSettingsResponse().data,
          values: { ...buildSettingsResponse().data.values, moyai_url: "https://moyai.example.com" },
        },
      }),
    );

    renderWithProviders(<UISettings />);

    expect(screen.getByText("已连接到 https://moyai.example.com")).toBeInTheDocument();
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "断开连接" }));
    });

    expect(mutateMock).toHaveBeenCalledWith(
      { moyai_url: null },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("shows a link to the Moyai page when not connected", () => {
    renderWithProviders(<UISettings />);

    expect(screen.getByText("未连接")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "从 Moyai 页面连接" })).toHaveAttribute("href", "/ui/moyai");
  });

  it("should toggle require auth for public AI Hub setting and call update", () => {
    const mutateMock = vi.fn((_settings, options) => {
      options?.onSuccess?.();
    });

    mockUseUpdateUISettings.mockReturnValue({
      mutate: mutateMock,
      isPending: false,
      error: null,
    });

    renderWithProviders(<UISettings />);

    const toggle = screen.getByRole("switch", { name: "Require authentication for public AI Hub" });

    act(() => {
      fireEvent.click(toggle);
    });

    expect(mutateMock).toHaveBeenCalledWith(
      { require_auth_for_public_ai_hub: true },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );
    expect(toast.success).toHaveBeenCalledWith("界面设置更新成功");
  });
});
