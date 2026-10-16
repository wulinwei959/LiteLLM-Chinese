import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CloudZeroUpdateModal from "./CloudZeroUpdateModal";
import { CloudZeroSettings } from "./types";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  __esModule: true,
  default: () => ({
    accessToken: "test-token",
  }),
}));

vi.mock("@/app/(dashboard)/hooks/cloudzero/useCloudZeroSettings", () => ({
  useCloudZeroUpdateSettings: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe("CloudZeroUpdateModal", () => {
  const mockSettings: CloudZeroSettings = {
    connection_id: "test-connection-id",
    api_key_masked: "****",
    timezone: "UTC",
    status: "Active",
  };

  it("should render", () => {
    renderWithProviders(<CloudZeroUpdateModal open={true} onOk={vi.fn()} onCancel={vi.fn()} settings={mockSettings} />);

    expect(screen.getByText("编辑 CloudZero 集成")).toBeInTheDocument();
    expect(screen.getByLabelText("CloudZero API 密钥")).toBeInTheDocument();
    expect(screen.getByLabelText("连接 ID")).toBeInTheDocument();
    expect(screen.getByLabelText("时区")).toBeInTheDocument();
  });
});
