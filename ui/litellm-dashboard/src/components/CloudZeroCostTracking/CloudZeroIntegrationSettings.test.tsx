import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { CloudZeroIntegrationSettings } from "./CloudZeroIntegrationSettings";
import { CloudZeroSettings } from "./types";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  __esModule: true,
  default: () => ({
    accessToken: "test-token",
  }),
}));

vi.mock("@/app/(dashboard)/hooks/cloudzero/useCloudZeroDryRun", () => ({
  useCloudZeroDryRun: () => ({
    mutate: vi.fn(),
    isPending: false,
    data: null,
  }),
}));

vi.mock("@/app/(dashboard)/hooks/cloudzero/useCloudZeroExport", () => ({
  useCloudZeroExport: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe("CloudZeroIntegrationSettings", () => {
  const mockSettings: CloudZeroSettings = {
    connection_id: "test-connection-id",
    api_key_masked: "****",
    timezone: "UTC",
    status: "Active",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render", () => {
    renderWithProviders(<CloudZeroIntegrationSettings settings={mockSettings} onSettingsUpdated={vi.fn()} />);

    expect(screen.getByText("CloudZero 配置")).toBeInTheDocument();
    expect(screen.getByText("API 密钥（已脱敏）")).toBeInTheDocument();
    expect(screen.getByText("连接 ID")).toBeInTheDocument();
    expect(screen.getByText("时区")).toBeInTheDocument();
  });

  it("should display the correct values from settings", () => {
    renderWithProviders(<CloudZeroIntegrationSettings settings={mockSettings} onSettingsUpdated={vi.fn()} />);

    expect(screen.getByText(mockSettings.api_key_masked)).toBeInTheDocument();
    expect(screen.getByText(mockSettings.connection_id)).toBeInTheDocument();
  });
});
