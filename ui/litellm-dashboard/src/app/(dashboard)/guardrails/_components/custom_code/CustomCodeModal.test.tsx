import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../../../../tests/test-utils";
import userEvent from "@testing-library/user-event";
import CustomCodeModal from "./CustomCodeModal";
import { createGuardrailCall, updateGuardrailCall, testCustomCodeGuardrail } from "@/components/networking";

vi.mock("@/components/networking", () => ({
  createGuardrailCall: vi.fn(),
  updateGuardrailCall: vi.fn(),
  testCustomCodeGuardrail: vi.fn(),
}));

const mockCreate = vi.mocked(createGuardrailCall);
const mockUpdate = vi.mocked(updateGuardrailCall);
const mockTest = vi.mocked(testCustomCodeGuardrail);

describe("CustomCodeModal", () => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();

  const renderModal = (overrides = {}) =>
    renderWithProviders(
      <CustomCodeModal visible onClose={onClose} onSuccess={onSuccess} accessToken="test-token" {...overrides} />,
    );

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({} as never);
    mockUpdate.mockResolvedValue({} as never);
  });

  it("should render the create heading and the editor scaffolding", async () => {
    renderModal();

    expect(await screen.findByText("创建自定义护栏")).toBeInTheDocument();
    expect(screen.getByText("使用类 Python 语法定义自定义逻辑")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("例如 block-pii-custom")).toBeInTheDocument();
    expect(screen.getByText("护栏名称")).toBeInTheDocument();
    expect(screen.getByText("模式（可多选）")).toBeInTheDocument();
    expect(screen.getByText("可用原语")).toBeInTheDocument();
    expect(screen.getByText("Python 逻辑")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /保存护栏/ })).toBeInTheDocument();
  });

  it("should seed the editor with the empty template", async () => {
    renderModal();

    const editor = await screen.findByDisplayValue(/async def apply_guardrail/);
    expect(editor).toBeInTheDocument();
  });

  it("should not render its content when not visible", () => {
    renderModal({ visible: false });

    expect(screen.queryByText("创建自定义护栏")).not.toBeInTheDocument();
  });

  it("should render the edit heading and existing values in edit mode", async () => {
    renderModal({
      editData: {
        guardrail_id: "g-1",
        guardrail_name: "existing-guardrail",
        litellm_params: { mode: "post_call", default_on: true, custom_code: "def apply_guardrail(): pass" },
      },
    });

    expect(await screen.findByText("编辑自定义护栏")).toBeInTheDocument();
    expect(screen.getByDisplayValue("existing-guardrail")).toBeInTheDocument();
    expect(screen.getByDisplayValue("def apply_guardrail(): pass")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /更新护栏/ })).toBeInTheDocument();
  });

  it("should keep save disabled until a guardrail name is entered", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(await screen.findByRole("button", { name: /保存护栏/ }));
    expect(mockCreate).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText("例如 block-pii-custom"), "my-guardrail");
    await user.click(screen.getByRole("button", { name: /保存护栏/ }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledTimes(1);
    });
  });

  it("should create the guardrail with the entered name, mode and code", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.type(await screen.findByPlaceholderText("例如 block-pii-custom"), "block-pii");
    await user.click(screen.getByRole("button", { name: /保存护栏/ }));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });

    const [token, payload] = mockCreate.mock.calls[0] as [string, Record<string, never>];
    expect(token).toBe("test-token");
    expect(payload).toMatchObject({
      guardrail_name: "block-pii",
      litellm_params: { guardrail: "custom_code", mode: ["pre_call"], default_on: false },
    });
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("should switch the editor contents when a template is chosen", async () => {
    const user = userEvent.setup();
    renderModal();

    expect(await screen.findByDisplayValue(/async def apply_guardrail/)).toBeInTheDocument();

    const comboboxes = screen.getAllByRole("combobox");
    await user.click(comboboxes[comboboxes.length - 1]);
    const options = await screen.findAllByText("拦截 SSN");
    await user.click(options[options.length - 1]);

    expect(await screen.findByDisplayValue(/SSN detected/)).toBeInTheDocument();
  });

  it("should narrow the mode options to the typed search text", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getAllByRole("combobox")[0]);
    await user.keyboard("mcp");

    expect(await screen.findByText("pre_mcp_call（MCP 工具调用前）")).toBeInTheDocument();
    expect(screen.queryByText("logging_only")).not.toBeInTheDocument();
  });

  it("should expand the test section and run a test against the backend", async () => {
    const user = userEvent.setup();
    mockTest.mockResolvedValue({ success: true, result: { action: "allow" } } as never);
    renderModal();

    await user.click(await screen.findByText("测试你的护栏"));

    const runButton = await screen.findByRole("button", { name: /运行测试/ });
    await user.click(runButton);

    await waitFor(() => {
      expect(mockTest).toHaveBeenCalled();
    });
    expect(await screen.findByText("已放行")).toBeInTheDocument();
  });

  it("should surface a backend test error", async () => {
    const user = userEvent.setup();
    mockTest.mockResolvedValue({ success: false, error: "boom", error_type: "SyntaxError" } as never);
    renderModal();

    await user.click(await screen.findByText("测试你的护栏"));
    await user.click(await screen.findByRole("button", { name: /运行测试/ }));

    expect(await screen.findByText("boom")).toBeInTheDocument();
    expect(screen.getByText("[SyntaxError]")).toBeInTheDocument();
  });

  it("should cancel through the footer button", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(await screen.findByRole("button", { name: "取消" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
