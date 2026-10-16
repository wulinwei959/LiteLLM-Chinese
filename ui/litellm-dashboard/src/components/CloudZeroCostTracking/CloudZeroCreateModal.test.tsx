import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import CloudZeroCreateModal from "./CloudZeroCreateModal";
import { renderWithProviders } from "../../../tests/test-utils";

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  __esModule: true,
  default: () => ({
    accessToken: "test-token",
  }),
}));

vi.mock("@/app/(dashboard)/hooks/cloudzero/useCloudZeroCreate", () => ({
  useCloudZeroCreate: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

describe("CloudZeroCreateModal", () => {
  it("should render", () => {
    renderWithProviders(<CloudZeroCreateModal open={true} onOk={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("创建 CloudZero 集成")).toBeInTheDocument();
    expect(screen.getByLabelText("CloudZero API 密钥")).toBeInTheDocument();
    expect(screen.getByLabelText("连接 ID")).toBeInTheDocument();
    expect(screen.getByLabelText("时区")).toBeInTheDocument();
  });
});
