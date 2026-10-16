import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import CloudZeroCostTracking from "./CloudZeroCostTracking";
import { renderWithProviders } from "../../../tests/test-utils";

const mockUseCloudZeroSettings = vi.fn();

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  __esModule: true,
  default: () => ({
    accessToken: "test-token",
  }),
}));

vi.mock("@/app/(dashboard)/hooks/cloudzero/useCloudZeroSettings", () => ({
  useCloudZeroSettings: () => mockUseCloudZeroSettings(),
}));

vi.mock("@/components/networking", () => ({
  getProxyBaseUrl: () => "http://test-proxy",
}));

describe("CloudZeroCostTracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCloudZeroSettings.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
  });

  it("should render", async () => {
    renderWithProviders(<CloudZeroCostTracking />);

    await waitFor(() => {
      expect(screen.getByText("未找到 CloudZero 集成")).toBeInTheDocument();
    });
  });
});
