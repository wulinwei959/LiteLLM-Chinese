/* @vitest-environment jsdom */
import { screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getCallbacksCall, getRouterSettingsCall } from "@/components/networking";
import ModelGroupAliasPanel from "./ModelGroupAliasPanel";
import { renderWithProviders } from "../../../../../tests/test-utils";

vi.mock("@/app/(dashboard)/hooks/useAuthorized", () => ({
  default: () => ({ accessToken: "test-token", userId: "user-1", userRole: "Admin" }),
}));

vi.mock("@/components/networking", () => ({
  getCallbacksCall: vi.fn(),
  getRouterSettingsCall: vi.fn(),
  setCallbacksCall: vi.fn(),
}));

const aliases = {
  "fast-model": "claude-haiku",
  "smart-model": { model: "claude-sonnet", hidden: true },
};

describe("ModelGroupAliasPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getCallbacksCall).mockResolvedValue({ router_settings: { model_group_alias: aliases } });
    vi.mocked(getRouterSettingsCall).mockResolvedValue({ source: { model_group_alias: "db" } });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("locks delete controls when aliases are config-owned", async () => {
    vi.mocked(getRouterSettingsCall).mockResolvedValue({ source: { model_group_alias: "config" } });

    renderWithProviders(<ModelGroupAliasPanel />);

    expect(
      await screen.findByText("这些别名在 config.yaml 中定义，此处只读。请修改配置文件来变更它们。"),
    ).toBeInTheDocument();
    expect(await screen.findByText("fast-model")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "删除别名 smart-model" })).toBeDisabled();
  });

  it("keeps aliases locked while ownership is loading", async () => {
    let resolveOwnership!: (value: Awaited<ReturnType<typeof getRouterSettingsCall>>) => void;
    const pendingOwnership = new Promise<Awaited<ReturnType<typeof getRouterSettingsCall>>>((resolve) => {
      resolveOwnership = resolve;
    });
    vi.mocked(getRouterSettingsCall).mockReturnValue(pendingOwnership);

    renderWithProviders(<ModelGroupAliasPanel />);

    expect(await screen.findByText("fast-model")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeDisabled();

    resolveOwnership({ source: { model_group_alias: "db" } });
    await waitFor(() => expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeEnabled());
  });

  it("leaves delete controls enabled when aliases are database-managed", async () => {
    renderWithProviders(<ModelGroupAliasPanel />);

    await waitFor(() => expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeEnabled());
    expect(screen.getByRole("button", { name: "删除别名 smart-model" })).toBeEnabled();
  });

  it("renders aliases with enabled controls when router settings cannot be fetched", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getRouterSettingsCall).mockRejectedValue(new Error("router settings unavailable"));

    renderWithProviders(<ModelGroupAliasPanel />);

    expect(await screen.findByText("fast-model")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: "删除别名 fast-model" })).toBeEnabled());
  });

  it("still shows the config-owned notice when callbacks cannot be fetched", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getCallbacksCall).mockRejectedValue(new Error("callbacks unavailable"));
    vi.mocked(getRouterSettingsCall).mockResolvedValue({ source: { model_group_alias: "config" } });

    renderWithProviders(<ModelGroupAliasPanel />);

    expect(
      await screen.findByText("这些别名在 config.yaml 中定义，此处只读。请修改配置文件来变更它们。"),
    ).toBeInTheDocument();
  });
});
