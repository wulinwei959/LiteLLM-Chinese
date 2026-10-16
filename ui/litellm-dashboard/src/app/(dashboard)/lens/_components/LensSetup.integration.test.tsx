import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/../tests/test-utils";
import { MonitoringSetup } from "./LensOverview";
import { LensSetup } from "./LensSetup";
import { apiClient } from "@/components/networking";
import type { Settings } from "./lensData";

vi.mock("@/components/networking", () => ({ apiClient: { post: vi.fn(), get: vi.fn() } }));

const settings: Settings = {
  lookback_hours: 24,
  name: "Research quality",
  model: "analysis",
  source: "traces",
  context: "",
  enabled: false,
  filters: [],
  interval_minutes: 15,
  monthly_budget: 20,
  sample_size: 100,
  sample_percent: 100,
  concurrency: 8,
  team_id: "",
  execution_ids: [],
  service: "",
  agent_name: "",
  checks: [
    { id: "first", instruction: "Find repeated searches", enabled: false },
    { id: "second", instruction: "Find incomplete reports", enabled: true },
  ],
};

beforeEach(() => {
  vi.mocked(apiClient.get).mockReset();
  vi.mocked(apiClient.get).mockResolvedValue([]);
  vi.mocked(apiClient.post).mockReset();
  vi.mocked(apiClient.post).mockResolvedValue({ eligible: 1, selected: 1, executions: [] });
});
describe("Lens setup", () => {
  it("preserves check identity and disabled state when a check is edited", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderWithProviders(
      <LensSetup initial={settings} models={["analysis"]} accessToken="test" onClose={vi.fn()} onSave={save} />,
    );
    await user.click(screen.getByRole("button", { name: "继续" }));
    fireEvent.change(screen.getByRole("textbox", { name: "检查 1" }), {
      target: { value: "Find repetitive searches\nInclude retries that add no information" },
    });
    await user.click(screen.getByRole("button", { name: "继续" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "保存更改" })).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "保存更改" }));
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        checks: [
          { ...settings.checks[0], instruction: "Find repetitive searches\nInclude retries that add no information" },
          settings.checks[1],
        ],
      }),
    );
  });

  it("rejects invalid metadata before reviewing the selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LensSetup models={["analysis"]} accessToken="test" onClose={vi.fn()} onSave={vi.fn()} />);
    await user.click(screen.getByText("高级筛选"));
    await user.click(screen.getByRole("button", { name: "添加条件" }));
    fireEvent.change(screen.getByRole("combobox", { name: "元数据键 1" }), { target: { value: "swarm" } });
    await user.click(screen.getByRole("button", { name: "继续" }));
    expect(screen.getByRole("alert")).toHaveTextContent("每个条件都要填写键和值，否则请将其移除");
    expect(screen.queryByRole("textbox", { name: "检查 1" })).not.toBeInTheDocument();
  });
  it("previews identifiable matching runs and saves the same filter selection", async () => {
    const save = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    vi.mocked(apiClient.post).mockImplementation(async (_path, options) => {
      const body = options?.body as { settings: Settings };
      return body.settings.filters?.some((f) => f.key === "swarm" && f.value === "research")
        ? {
            eligible: 1,
            selected: 1,
            executions: [
              {
                id: "run",
                source: "requests",
                trace_id: "request-42",
                name: "Research report",
                start_time: "2026-09-30 18:00:00.000",
                span_count: 1,
              },
            ],
          }
        : { eligible: 0, executions: [] };
    });
    renderWithProviders(
      <LensSetup models={["analysis"]} defaultModel="analysis" accessToken="test" onClose={vi.fn()} onSave={save} />,
    );
    fireEvent.change(screen.getByRole("textbox", { name: "调查名称" }), {
      target: { value: "Research follow-up" },
    });
    await user.click(screen.getByText("高级筛选"));
    await user.click(screen.getByRole("button", { name: "添加条件" }));
    fireEvent.change(screen.getByRole("combobox", { name: "元数据键 1" }), { target: { value: "swarm" } });
    fireEvent.change(screen.getByRole("combobox", { name: "元数据值 1" }), { target: { value: "research" } });
    await user.click(screen.getByRole("button", { name: "继续" }));
    await user.type(screen.getByRole("textbox", { name: "检查 1" }), "Find incomplete reports");
    await user.click(screen.getByRole("button", { name: "添加检查" }));
    fireEvent.change(screen.getByRole("textbox", { name: "检查 2" }), {
      target: { value: "Find repeated searches\nInclude retries that add no information" },
    });
    await user.click(screen.getByRole("button", { name: "添加检查" }));
    await user.click(screen.getByRole("button", { name: "移除检查 3" }));
    await user.click(screen.getByRole("button", { name: "继续" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "运行调查" })).toBeEnabled());
    expect(screen.getByText("1 个匹配运行")).toBeInTheDocument();
    expect(screen.getByText("Research report")).toBeInTheDocument();
    expect(screen.getByText(/2026-09-30/)).toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: "每月上限（美元）" })).not.toBeVisible();
    await user.click(screen.getByRole("button", { name: "运行调查" }));
    const expected = {
      name: "Research follow-up",
      service: "",
      agent_name: "",
      filters: [{ key: "swarm", value: "research" }],
      enabled: false,
      sample_size: null,
      model: "analysis",
      monthly_budget: 100,
      checks: [
        expect.objectContaining({ instruction: "Find incomplete reports" }),
        expect.objectContaining({ instruction: "Find repeated searches\nInclude retries that add no information" }),
      ],
    };
    expect(save).toHaveBeenCalledWith(expect.objectContaining(expected));
  });
});

it("searches providers and saves custom history while preserving existing schedule values", async () => {
  const user = userEvent.setup();
  const save = vi.fn().mockResolvedValue(undefined);
  renderWithProviders(
    <LensSetup
      initial={settings}
      models={["review", "other"]}
      modelDetails={[
        { model_group: "review", providers: ["OpenAI"], mode: "chat", supported_openai_params: ["response_format"] },
        { model_group: "other", providers: ["Anthropic"], mode: "chat" },
      ]}
      accessToken="test"
      onClose={vi.fn()}
      onSave={save}
    />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "审查最近单位" }), "1");
  fireEvent.change(screen.getByRole("spinbutton", { name: "审查最近" }), { target: { value: "3" } });
  expect(screen.getByText(/已不可用/)).toBeVisible();
  await user.clear(screen.getByRole("combobox", { name: "分析模型" }));
  await user.type(screen.getByRole("combobox", { name: "分析模型" }), "OpenAI");
  expect(screen.queryByRole("option", { name: /Anthropic/ })).not.toBeInTheDocument();
  await user.click(await screen.findByRole("option", { name: /review.*支持 JSON 输出/ }));
  await waitFor(() => expect(screen.getByRole("button", { name: "保存更改" })).toBeEnabled());
  await user.click(screen.getByRole("button", { name: "保存更改" }));
  const expected = { model: "review", lookback_hours: 3, interval_minutes: 15, enabled: false };
  expect(save).toHaveBeenCalledWith(expect.objectContaining(expected));
});

it("configures monitoring separately and rejects a zero interval", async () => {
  const user = userEvent.setup();
  const save = vi.fn().mockResolvedValue(undefined);
  renderWithProviders(<MonitoringSetup settings={settings} ready onSave={save} onClose={vi.fn()} />);
  fireEvent.change(screen.getByRole("spinbutton", { name: "每多久检查一次" }), { target: { value: "2" } });
  await user.click(screen.getByRole("button", { name: "启用监控" }));
  expect(save).toHaveBeenCalledWith(expect.objectContaining({ interval_minutes: 2, enabled: true }));
  fireEvent.change(screen.getByRole("spinbutton", { name: "每多久检查一次" }), { target: { value: "0" } });
  expect(screen.getByRole("button", { name: "启用监控" })).toBeDisabled();
});

it("keeps the draft when readiness changes and blocks a run until the worker recovers", async () => {
  const user = userEvent.setup();
  const save = vi.fn();
  const props = {
    initial: settings,
    mode: "duplicate" as const,
    models: ["analysis"],
    accessToken: "test",
    onClose: vi.fn(),
    onSave: save,
  };
  const view = renderWithProviders(<LensSetup {...props} ready />);
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.type(screen.getByRole("textbox", { name: "智能体应该做什么？" }), "Finish the report");
  view.rerender(<LensSetup {...props} ready={false} />);
  expect(screen.getByRole("textbox", { name: "智能体应该做什么？" })).toHaveValue("Finish the report");
  await user.click(screen.getByRole("button", { name: "继续" }));
  expect(screen.getByRole("button", { name: "运行调查" })).toBeDisabled();
  view.rerender(<LensSetup {...props} ready />);
  await waitFor(() => expect(screen.getByRole("button", { name: "运行调查" })).toBeEnabled());
});

it.each(["empty", "error"])("allows editing saved settings when the preview is %s", async (state) => {
  if (state === "error") vi.mocked(apiClient.post).mockRejectedValue(new Error("Storage unavailable"));
  else vi.mocked(apiClient.post).mockResolvedValue({ eligible: 0, selected: 0, executions: [] });
  const user = userEvent.setup();
  renderWithProviders(
    <LensSetup initial={settings} models={["analysis"]} accessToken="test" onClose={vi.fn()} onSave={vi.fn()} />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  expect(screen.getByRole("button", { name: "保存更改" })).toBeEnabled();
  if (state === "error") expect(await screen.findByRole("button", { name: "重试预览" })).toBeVisible();
  else expect(await screen.findByText(/无匹配项/)).toBeVisible();
});

it.each(["loading", "error"])("saves edits with the existing model while models are %s", async (state) => {
  const user = userEvent.setup();
  const save = vi.fn().mockResolvedValue(undefined);
  renderWithProviders(
    <LensSetup
      initial={settings}
      models={[]}
      modelsLoading={state === "loading"}
      modelsError={state === "error" ? "Temporarily unavailable" : undefined}
      accessToken="test"
      onClose={vi.fn()}
      onSave={save}
    />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  fireEvent.change(screen.getByRole("textbox", { name: "智能体应该做什么？" }), {
    target: { value: "Include verified sources" },
  });
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "保存更改" }));
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ model: settings.model, context: "Include verified sources" }),
  );
});

it.each(["new", "duplicate"] as const)("blocks a %s investigation until its model is verified", async (mode) => {
  const user = userEvent.setup();
  const save = vi.fn();
  renderWithProviders(
    <LensSetup
      initial={settings}
      mode={mode}
      models={[]}
      modelsError="Temporarily unavailable"
      accessToken="test"
      onClose={vi.fn()}
      onSave={save}
    />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  expect(await screen.findByText("1 个匹配运行")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "运行调查" })).toBeDisabled();
  expect(save).not.toHaveBeenCalled();
});

it("shows optional budget and repeat controls only under advanced options and saves their values", async () => {
  const user = userEvent.setup();
  const save = vi.fn().mockResolvedValue(undefined);
  renderWithProviders(
    <LensSetup
      initial={settings}
      mode="duplicate"
      models={["analysis"]}
      accessToken="test"
      onClose={vi.fn()}
      onSave={save}
    />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "运行调查" })).toBeEnabled());
  await user.click(screen.getByText("高级选项"));
  expect(screen.getByRole("checkbox", { name: "重复此调查" })).not.toBeChecked();
  fireEvent.change(screen.getByRole("spinbutton", { name: "每月上限（美元）" }), { target: { value: "8" } });
  await user.click(screen.getByRole("checkbox", { name: "重复此调查" }));
  fireEvent.change(screen.getByRole("spinbutton", { name: "重复间隔" }), { target: { value: "120" } });
  await user.click(screen.getByRole("button", { name: "运行并监控" }));
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ enabled: true, interval_minutes: 120, monthly_budget: 8 }),
  );
});

it("does not silently analyze everything after individual selection is enabled", async () => {
  const user = userEvent.setup();
  vi.mocked(apiClient.post).mockResolvedValue({
    eligible: 1,
    selected: 1,
    executions: [
      {
        id: "selected-run",
        name: "Example run",
        trace_id: "trace",
        source: "traces",
        start_time: "2026-10-01T12:00:00Z",
        span_count: 2,
      },
    ],
  });
  renderWithProviders(
    <LensSetup initial={settings} models={["analysis"]} accessToken="test" onClose={vi.fn()} onSave={vi.fn()} />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByText("高级选项"));
  await user.click(screen.getByRole("checkbox", { name: "选择单个运行" }));
  expect(screen.getByRole("button", { name: "保存更改" })).toBeDisabled();
  await user.click(await screen.findByRole("checkbox", { name: "选择 Example run" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "保存更改" })).toBeEnabled());
});

it("refreshes agent suggestions when the first activity arrives", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  try {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.mocked(apiClient.post).mockResolvedValue({ eligible: 0, selected: 0, executions: [] });
    renderWithProviders(<LensSetup models={["analysis"]} accessToken="test" onClose={vi.fn()} onSave={vi.fn()} />);
    await vi.advanceTimersByTimeAsync(400);
    await user.click(screen.getByRole("combobox", { name: "智能体（可选）" }));
    expect(await screen.findByText(/无匹配项。你可以输入/)).toBeVisible();
    await user.keyboard("{Escape}");
    vi.mocked(apiClient.post).mockResolvedValue({
      eligible: 1,
      selected: 1,
      executions: [
        {
          id: "new-run",
          name: "First support run",
          service: "support-agent",
          trace_id: "new-trace",
          source: "traces",
          start_time: "2026-10-01T12:00:00Z",
          span_count: 2,
        },
      ],
    });
    vi.mocked(apiClient.get).mockResolvedValue(["support-agent"]);
    await vi.advanceTimersByTimeAsync(15000);
    await user.click(screen.getByRole("combobox", { name: "智能体（可选）" }));
    expect(await screen.findByRole("option", { name: "support-agent" })).toBeVisible();
  } finally {
    vi.useRealTimers();
  }
});

it.each(["empty", "error"])("blocks a new investigation when its preview is %s", async (state) => {
  if (state === "error") vi.mocked(apiClient.post).mockRejectedValue(new Error("Storage unavailable"));
  else vi.mocked(apiClient.post).mockResolvedValue({ eligible: 0, selected: 0, executions: [] });
  const user = userEvent.setup();
  renderWithProviders(
    <LensSetup
      mode="duplicate"
      initial={settings}
      models={["analysis"]}
      accessToken="test"
      onClose={vi.fn()}
      onSave={vi.fn()}
    />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  expect(screen.getByRole("button", { name: "运行调查" })).toBeDisabled();
});

it("exposes an unsupported inherited model before allowing a run", async () => {
  const user = userEvent.setup();
  renderWithProviders(
    <LensSetup
      mode="duplicate"
      initial={settings}
      models={["analysis"]}
      modelDetails={[{ model_group: "analysis", mode: "embedding", providers: [] }]}
      accessToken="test"
      onClose={vi.fn()}
      onSave={vi.fn()}
    />,
  );
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  expect(screen.getByText("请选择支持 JSON 输出的对话模型")).toBeVisible();
  expect(screen.getByRole("combobox", { name: "分析模型" })).toBeVisible();
  expect(screen.getByRole("button", { name: "运行调查" })).toBeDisabled();
});

it("saves a discovered agent independently of the application name", async () => {
  vi.mocked(apiClient.get).mockResolvedValue(["research_agent", "support_agent"]);
  const user = userEvent.setup();
  const save = vi.fn();
  renderWithProviders(
    <LensSetup
      initial={{ ...settings, service: "shared-service" }}
      models={["analysis"]}
      accessToken="test"
      onClose={vi.fn()}
      onSave={save}
    />,
  );
  await user.click(screen.getByRole("combobox", { name: "智能体（可选）" }));
  await user.click(await screen.findByRole("option", { name: "research_agent" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "继续" }));
  await user.click(screen.getByRole("button", { name: "保存更改" }));
  expect(save).toHaveBeenCalledWith(
    expect.objectContaining({ agent_name: "research_agent", service: "shared-service" }),
  );
});
