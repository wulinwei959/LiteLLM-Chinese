import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders, testQueryClient } from "@/../tests/test-utils";
import { apiClient } from "@/components/networking";
import { WorkerSetup } from "./WorkerSetup";

vi.mock("@/components/networking", () => ({
  apiClient: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  proxyBaseUrl: "https://gateway.example/proxy",
}));

const created = {
  token: "lens-test-token",
  worker: {
    id: "worker",
    name: "Lens worker",
    last_seen: "1970-01-01T00:00:00Z",
    scope: { all_teams: true, api_key_hash: "", team_id: "" },
    revoked: false,
    analysis_key_id: "b".repeat(64),
  },
};

describe("Worker setup", () => {
  beforeEach(() => {
    testQueryClient.clear();
    vi.clearAllMocks();
    vi.mocked(apiClient.get).mockImplementation(async (path) =>
      path === "/key/info"
        ? { info: { models: ["analysis-model"], max_budget: 15, budget_duration: "1mo" } }
        : {
            keys: [{ token: "b".repeat(64), key_alias: "Analysis" }],
            total_pages: 1,
          },
    );
  });
  it("generates a complete command using one worker credential and the configured proxy address", async () => {
    vi.mocked(apiClient.post).mockResolvedValue(created);
    const user = userEvent.setup();
    renderWithProviders(<WorkerSetup accessToken="admin" workers={[]} onClose={vi.fn()} onChanged={vi.fn()} />);
    await user.click(screen.getByText("高级选项"));
    await user.click(screen.getByRole("switch", { name: "使用已有的虚拟密钥" }));
    expect(screen.getByRole("textbox", { name: "LiteLLM 代理 URL" })).toHaveValue("https://gateway.example/proxy");
    expect(screen.getByRole("button", { name: "获取安装命令" })).toBeDisabled();
    await user.click(screen.getByRole("combobox", { name: "分析费用计入" }));
    await user.click(await screen.findByRole("option", { name: "Analysis" }));
    await user.click(screen.getByRole("button", { name: "获取安装命令" }));
    expect(apiClient.post).toHaveBeenCalledWith("/lens/workers/register", {
      accessToken: "admin",
      body: { name: "Lens worker", analysis_key_id: "b".repeat(64) },
    });
    expect(screen.getByRole("status")).toHaveTextContent("正在等待你的工作进程连接");
    expect(screen.getByLabelText("Docker 命令预览")).not.toBeVisible();
    await user.click(screen.getByRole("button", { name: "复制 Docker 命令" }));
    const command = await navigator.clipboard.readText();
    expect(command).toContain("LITELLM_URL=https://gateway.example/proxy");
    expect(command).toContain("LENS_WORKER_TOKEN=lens-test-token");
    expect(command).toContain("--add-host host.docker.internal:host-gateway");
    expect(command).toContain("ghcr.io/berriai/litellm-lens-worker@sha256:");
  });
  it("assigns billing to an existing worker without replacing its access token", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    vi.mocked(apiClient.put).mockResolvedValue(created.worker);
    renderWithProviders(
      <WorkerSetup
        accessToken="admin"
        workers={[{ ...created.worker, analysis_key_id: null }]}
        onClose={vi.fn()}
        onChanged={changed}
      />,
    );
    expect(screen.getByText("需要计费密钥")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "设置" }));
    await user.click(screen.getByRole("combobox", { name: "分析费用计入" }));
    await user.click(await screen.findByRole("option", { name: "Analysis" }));
    await user.click(screen.getByRole("button", { name: "保存分析访问权限" }));
    expect(apiClient.put).toHaveBeenCalledWith("/lens/workers/worker/billing-key", {
      accessToken: "admin",
      body: { analysis_key_id: "b".repeat(64) },
    });
    expect(changed).toHaveBeenCalledOnce();
    expect(apiClient.post).not.toHaveBeenCalled();
  });
  it("requires revoking the current worker before setting up a replacement", async () => {
    const user = userEvent.setup();
    const changed = vi.fn();
    vi.mocked(apiClient.delete).mockResolvedValue(true);
    const props = { accessToken: "admin", onClose: vi.fn(), onChanged: changed };
    const view = renderWithProviders(<WorkerSetup {...props} workers={[created.worker]} />);
    expect(screen.queryByRole("button", { name: "Add worker" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "获取安装命令" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "撤销访问权限" }));
    expect(apiClient.delete).toHaveBeenCalledWith("/lens/workers/worker", { accessToken: "admin" });
    expect(changed).toHaveBeenCalledOnce();
    view.rerender(<WorkerSetup {...props} workers={[{ ...created.worker, revoked: true }]} />);
    expect(screen.getByRole("button", { name: "获取安装命令" })).toBeDisabled();
    expect(screen.getByRole("combobox", { name: "分析模型" })).toBeVisible();
  });
  it("cleans up a newly created key when registration fails before retrying", async () => {
    const user = userEvent.setup();
    vi.mocked(apiClient.get).mockImplementation(async (path) => {
      if (path === "/models") return { data: [{ id: "analysis-model" }] };
      if (path === "/lens") return { workers: [] };
      return { keys: [], total_pages: 0 };
    });
    vi.mocked(apiClient.post)
      .mockResolvedValueOnce({ token_id: "limited-key-id", key: "sk-secret-not-displayed" })
      .mockRejectedValueOnce(new Error("Registration unavailable"))
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ token_id: "retry-key-id" })
      .mockResolvedValueOnce(created);
    renderWithProviders(<WorkerSetup accessToken="admin" workers={[]} onClose={vi.fn()} onChanged={vi.fn()} />);
    expect(screen.getByRole("button", { name: "获取安装命令" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "LiteLLM 代理 URL", hidden: true })).not.toBeVisible();
    await user.click(screen.getByRole("combobox", { name: "分析模型" }));
    await user.click(await screen.findByRole("option", { name: "analysis-model" }));
    await user.clear(screen.getByLabelText("每月上限（美元）"));
    await user.type(screen.getByLabelText("每月上限（美元）"), "12");
    await user.click(screen.getByRole("button", { name: "获取安装命令" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Registration unavailable");
    expect(apiClient.post).toHaveBeenNthCalledWith(1, "/key/generate", {
      accessToken: "admin",
      body: {
        key_alias: "Lens analysis",
        models: ["analysis-model"],
        max_budget: 12,
        budget_duration: "1mo",
        metadata: { purpose: "lens" },
      },
    });
    await user.click(screen.getByRole("button", { name: "获取安装命令" }));
    expect(await screen.findByRole("status")).toHaveTextContent("正在等待你的工作进程");
    expect(apiClient.post).toHaveBeenCalledWith("/key/delete", {
      accessToken: "admin",
      body: { keys: ["limited-key-id"] },
    });
    expect(apiClient.post).toHaveBeenCalledTimes(5);
    expect(apiClient.post).toHaveBeenLastCalledWith("/lens/workers/register", {
      accessToken: "admin",
      body: { name: "Lens worker", analysis_key_id: "retry-key-id" },
    });
    expect(screen.queryByText("sk-secret-not-displayed")).not.toBeInTheDocument();
  });
});
