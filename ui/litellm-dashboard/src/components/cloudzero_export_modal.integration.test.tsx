import React from "react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders as render } from "../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CloudZeroExportModal from "./cloudzero_export_modal";

vi.mock("@/lib/toast", () => ({
  toast: { success: vi.fn(), fromError: vi.fn(), info: vi.fn() },
}));

vi.mock("@/components/networking", () => ({
  getGlobalLitellmHeaderName: () => "Authorization",
}));

const jsonResponse = (status: number, body: unknown) =>
  ({ ok: status >= 200 && status < 300, status, json: async () => body }) as Response;

const bodyOf = (call: unknown[]) => JSON.parse((call[1] as RequestInit).body as string);

const callsTo = (fetchMock: ReturnType<typeof vi.fn>, path: string) =>
  fetchMock.mock.calls.filter((call) => call[0] === path);

describe("CloudZeroExportModal", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn(async (url: string) => {
      if (url === "/cloudzero/settings") return jsonResponse(404, { error: "not configured" });
      if (url === "/cloudzero/init") return jsonResponse(200, { message: "saved" });
      if (url === "/cloudzero/export") return jsonResponse(200, { message: "exported" });
      return jsonResponse(500, { error: "unexpected" });
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  const open = () => render(<CloudZeroExportModal isOpen onClose={vi.fn()} accessToken="sk-test" />);

  it("saves the settings with a hardcoded UTC timezone before exporting", async () => {
    const user = userEvent.setup();
    open();

    fireEvent.change(await screen.findByLabelText("CloudZero API 密钥"), { target: { value: "cz-key-123" } });
    fireEvent.change(screen.getByLabelText("连接 ID"), { target: { value: "conn-abc" } });
    await user.click(screen.getByRole("button", { name: "导出到 CloudZero" }));

    await waitFor(() => expect(callsTo(fetchMock, "/cloudzero/init")).toHaveLength(1));

    const [initCall] = callsTo(fetchMock, "/cloudzero/init");
    expect((initCall[1] as RequestInit).method).toBe("POST");
    expect(bodyOf(initCall)).toEqual({
      api_key: "cz-key-123",
      connection_id: "conn-abc",
      timezone: "UTC",
    });
  });

  it("exports with a fixed limit and operation once the settings are saved", async () => {
    const user = userEvent.setup();
    open();

    fireEvent.change(await screen.findByLabelText("CloudZero API 密钥"), { target: { value: "cz-key-123" } });
    fireEvent.change(screen.getByLabelText("连接 ID"), { target: { value: "conn-abc" } });
    await user.click(screen.getByRole("button", { name: "导出到 CloudZero" }));

    await waitFor(() => expect(callsTo(fetchMock, "/cloudzero/export")).toHaveLength(1));

    const [exportCall] = callsTo(fetchMock, "/cloudzero/export");
    expect((exportCall[1] as RequestInit).method).toBe("POST");
    expect(bodyOf(exportCall)).toEqual({ limit: 100000, operation: "replace_hourly" });
  });

  it("sends nothing while a required field is still empty", async () => {
    const user = userEvent.setup();
    open();

    fireEvent.change(await screen.findByLabelText("CloudZero API 密钥"), { target: { value: "cz-key-123" } });
    await user.click(screen.getByRole("button", { name: "导出到 CloudZero" }));

    await screen.findByText("请输入你的 CloudZero 连接 ID");
    expect(callsTo(fetchMock, "/cloudzero/init")).toHaveLength(0);
    expect(callsTo(fetchMock, "/cloudzero/export")).toHaveLength(0);
  });

  it("reports both required messages when the form is untouched", async () => {
    const user = userEvent.setup();
    open();

    await screen.findByLabelText("CloudZero API 密钥");
    await user.click(screen.getByRole("button", { name: "导出到 CloudZero" }));

    expect(await screen.findByText("请输入你的 CloudZero API 密钥")).toBeInTheDocument();
    expect(screen.getByText("请输入你的 CloudZero 连接 ID")).toBeInTheDocument();
    expect(callsTo(fetchMock, "/cloudzero/init")).toHaveLength(0);
  });

  it("skips the save entirely when CloudZero is already configured", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url === "/cloudzero/settings")
        return jsonResponse(200, {
          api_key_masked: "cz-1****4567",
          connection_id: "conn-existing",
          status: "configured",
        });
      if (url === "/cloudzero/export") return jsonResponse(200, { message: "exported" });
      return jsonResponse(500, { error: "unexpected" });
    });
    const user = userEvent.setup();
    open();

    await screen.findByText(/conn-existing/);
    expect(screen.queryByLabelText("CloudZero API 密钥")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "导出到 CloudZero" }));

    await waitFor(() => expect(callsTo(fetchMock, "/cloudzero/export")).toHaveLength(1));
    expect(callsTo(fetchMock, "/cloudzero/init")).toHaveLength(0);
  });

  it("masks the API key it echoes back after a successful save", async () => {
    const user = userEvent.setup();
    open();

    fireEvent.change(await screen.findByLabelText("CloudZero API 密钥"), { target: { value: "cz-key-123456789" } });
    fireEvent.change(screen.getByLabelText("连接 ID"), { target: { value: "conn-abc" } });
    await user.click(screen.getByRole("button", { name: "导出到 CloudZero" }));

    await waitFor(() => expect(callsTo(fetchMock, "/cloudzero/export")).toHaveLength(1));
    expect(bodyOf(callsTo(fetchMock, "/cloudzero/init")[0]).api_key).toBe("cz-key-123456789");
  });

  it("switches to the CSV destination without touching the CloudZero endpoints", async () => {
    const user = userEvent.setup();
    open();

    await screen.findByLabelText("CloudZero API 密钥");
    await user.click(screen.getByRole("combobox"));
    await user.click(await screen.findByRole("option", { name: "导出为 CSV" }));

    expect(screen.queryByLabelText("CloudZero API 密钥")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "导出 CSV" }));

    expect(callsTo(fetchMock, "/cloudzero/init")).toHaveLength(0);
    expect(callsTo(fetchMock, "/cloudzero/export")).toHaveLength(0);
  });

  it("keeps the API key entry obscured", async () => {
    open();
    expect(await screen.findByLabelText("CloudZero API 密钥")).toHaveAttribute("type", "password");
  });
});
