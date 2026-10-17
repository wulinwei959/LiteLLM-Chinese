import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders as render } from "@/../tests/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ChatUI from "./ChatUI";
import * as fetchModelsModule from "@/components/llm_calls/fetch_models";
import { makeOpenAIChatCompletionRequest } from "@/components/llm_calls/chat_completion";
import { makeAnthropicMessagesRequest } from "../../llm_calls/anthropic_messages";

vi.mock("@/components/llm_calls/fetch_models", () => ({
  fetchAvailableModels: vi.fn(),
}));

vi.mock("@/components/llm_calls/chat_completion", () => ({
  makeOpenAIChatCompletionRequest: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("../../llm_calls/anthropic_messages", () => ({
  makeAnthropicMessagesRequest: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/components/networking", () => ({
  tagListCall: vi.fn().mockResolvedValue({}),
  vectorStoreListCall: vi.fn().mockResolvedValue({ data: [] }),
  getGuardrailsList: vi.fn().mockResolvedValue({ data: [] }),
  getPoliciesList: vi.fn().mockResolvedValue({ data: [] }),
  modelHubCall: vi.fn().mockResolvedValue({ data: [] }),
  fetchMCPServers: vi.fn().mockResolvedValue([]),
  fetchMCPToolsets: vi.fn().mockResolvedValue([]),
  listMCPTools: vi.fn().mockResolvedValue({ tools: [] }),
  callMCPTool: vi.fn(),
}));

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
});

const CHAT_REQUEST_ARG_COUNT = 27;
const STREAMING_ENABLED_ARG_INDEX = 25;
const CHAT_CUSTOM_HEADERS_ARG_INDEX = 26;
const MESSAGES_REQUEST_ARG_COUNT = 20;
const MESSAGES_STREAMING_ENABLED_ARG_INDEX = 18;
const MESSAGES_CUSTOM_HEADERS_ARG_INDEX = 19;

async function openComboboxByPlaceholder(placeholder: string) {
  const user = userEvent.setup();
  const combobox = await screen.findByPlaceholderText(placeholder);
  await user.click(combobox);
  return combobox;
}

async function selectComboboxOption(placeholder: string, optionLabel: string) {
  const user = userEvent.setup();
  await openComboboxByPlaceholder(placeholder);
  const option = await screen.findByText(optionLabel);
  await user.click(option);
}

describe("ChatUI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();

    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockResolvedValue([
      { model_group: "Model 1", mode: "chat" },
      { model_group: "Model 2", mode: "chat" },
      { model_group: "Model 3", mode: "chat" },
    ]);
  });

  it("should render the chat UI", async () => {
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );
    expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
  });

  it("should show the voice selector when the endpoint type is audio_speech", async () => {
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/audio/speech");

    await waitFor(() => {
      expect(screen.getByText("语音")).toBeInTheDocument();
      expect(screen.getByLabelText("语音")).toBeInTheDocument();
    });
  });

  it("should show the SDK type by its human label rather than its wire value", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByRole("button", { name: /get code|获取代码/i }));

    const sdkTrigger = await screen.findByLabelText(/SDK 类型|SDK Type/);
    expect(sdkTrigger).toHaveTextContent("OpenAI SDK");

    await user.click(sdkTrigger);
    await user.click(await screen.findByRole("option", { name: "Azure SDK" }));

    expect(await screen.findByLabelText(/SDK 类型|SDK Type/)).toHaveTextContent("Azure SDK");
  });

  it("should show the voice by its human label rather than its wire value", async () => {
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/audio/speech");

    await waitFor(() => {
      expect(screen.getByLabelText("语音")).toHaveTextContent("Alloy - Professional and confident");
    });
  });

  it("should allow the user to select a model", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await openComboboxByPlaceholder(/选择模型|输入自定义模型名称/);

    await waitFor(() => {
      expect(screen.getAllByText("Model 1").length).toBeGreaterThan(0);
    });
    await user.click(screen.getByRole("option", { name: "Model 1Mode: chat" }));
    expect(screen.getByPlaceholderText(/选择模型|enter custom model|输入自定义模型名称|Select Model/)).toHaveValue(
      "Model 1",
    );

    await user.click(screen.getAllByRole("button", { name: "Clear" })[0]);
    const input = screen.getByPlaceholderText(/Describe the image|描述您想生成的图片/);
    fireEvent.change(input, { target: { value: "Contract endpoint check" } });
    expect(screen.getByRole("button", { name: "发送消息" })).toBeDisabled();
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input).toHaveValue("Contract endpoint check");
    expect(makeOpenAIChatCompletionRequest).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("endpointType")).toBeNull();

    await selectComboboxOption("端点类型", "/v1/chat/completions");
    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");
    expect(screen.getByRole("button", { name: "发送消息" })).toBeEnabled();
  });

  it("shows only endpoint-compatible models when chat endpoint is selected", async () => {
    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { model_group: "ChatModel", mode: "chat" },
      { model_group: "SpeechModel", mode: "audio_speech" },
      { model_group: "ImageModel", mode: "image_generation" },
      { model_group: "ResponsesModel", mode: "responses" },
      { model_group: "RealtimeModel", mode: "realtime" },
      { model_group: "NoModeModel" },
    ]);

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/chat/completions");
    await openComboboxByPlaceholder(/选择模型|输入自定义模型名称/);

    await waitFor(() => {
      expect(screen.getAllByText("ChatModel").length).toBeGreaterThan(0);
      expect(screen.getAllByText("NoModeModel").length).toBeGreaterThan(0);
      expect(screen.queryByText("SpeechModel")).not.toBeInTheDocument();
      expect(screen.queryByText("ImageModel")).not.toBeInTheDocument();
      expect(screen.queryByText("ResponsesModel")).not.toBeInTheDocument();
      expect(screen.queryByText("RealtimeModel")).not.toBeInTheDocument();
    });
  });

  it("shows only realtime models when realtime endpoint is selected", async () => {
    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { model_group: "ChatModel", mode: "chat" },
      { model_group: "RealtimeModel", mode: "realtime" },
      { model_group: "NoModeModel" },
    ]);

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/realtime");
    await openComboboxByPlaceholder(/选择模型|输入自定义模型名称/);

    await waitFor(() => {
      expect(screen.getAllByText("RealtimeModel").length).toBeGreaterThan(0);
      expect(screen.getAllByText("NoModeModel").length).toBeGreaterThan(0);
      expect(screen.queryByText("ChatModel")).not.toBeInTheDocument();
    });
  });

  it("should show 'Enter custom model' option in model selector", async () => {
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await openComboboxByPlaceholder(/选择模型|输入自定义模型名称/);

    await waitFor(() => {
      expect(screen.getByText("Enter custom model")).toBeInTheDocument();
    });
  });

  it("should enable the MCP tools selector for chat completions", async () => {
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    const mcpInput = () => screen.getByLabelText(/Select MCP servers|选择 MCP 服务器/);

    await selectComboboxOption("端点类型", "/v1/embeddings");

    await waitFor(() => {
      expect(mcpInput()).toBeDisabled();
    });

    await selectComboboxOption("端点类型", "/v1/chat/completions");

    await waitFor(() => {
      expect(mcpInput()).toBeEnabled();
    });
  });

  it("should show Simulate failure to test fallbacks in Model Settings when chat endpoint is selected", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");

    await waitFor(() => {
      expect(screen.getByTestId("model-settings-button")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("model-settings-button"));

    await waitFor(() => {
      expect(screen.getByText("模型设置")).toBeInTheDocument();
      expect(screen.getByText(/模拟失败以测试回退/)).toBeInTheDocument();
    });

    const fallbacksCheckbox = screen.getByRole("checkbox", {
      name: /模拟失败以测试回退/,
    });
    expect(fallbacksCheckbox).not.toBeChecked();

    await user.click(fallbacksCheckbox);

    await waitFor(() => {
      expect(screen.getByRole("checkbox", { name: /模拟失败以测试回退/ })).toBeChecked();
    });
  });

  it("should send the chat request non-streaming after Stream responses is unchecked", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");

    await waitFor(() => {
      expect(screen.getByTestId("model-settings-button")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("model-settings-button"));

    const streamingCheckbox = await screen.findByRole("checkbox", { name: /流式响应/ });
    expect(streamingCheckbox).toBeChecked();

    await user.click(streamingCheckbox);

    await waitFor(() => {
      expect(screen.getByRole("checkbox", { name: /流式响应/ })).not.toBeChecked();
    });

    const messageInput = screen.getByPlaceholderText("输入消息... (Shift+Enter 换行)");
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: "hello" } });
    });
    await act(async () => {
      fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      expect(makeOpenAIChatCompletionRequest).toHaveBeenCalledTimes(1);
    });

    const requestArgs = vi.mocked(makeOpenAIChatCompletionRequest).mock.calls[0];
    expect(requestArgs).toHaveLength(CHAT_REQUEST_ARG_COUNT);
    expect(requestArgs[STREAMING_ENABLED_ARG_INDEX]).toBe(false);
  });

  it("should send the /v1/messages request non-streaming after Stream responses is unchecked", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/messages");
    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");

    await user.click(await screen.findByTestId("model-settings-button"));

    const streamingCheckbox = await screen.findByRole("checkbox", { name: /流式响应/ });
    expect(streamingCheckbox).toBeChecked();
    await user.click(streamingCheckbox);

    await waitFor(() => {
      expect(screen.getByRole("checkbox", { name: /流式响应/ })).not.toBeChecked();
    });

    const messageInput = screen.getByPlaceholderText("输入消息... (Shift+Enter 换行)");
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: "hello" } });
    });
    await act(async () => {
      fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      expect(makeAnthropicMessagesRequest).toHaveBeenCalledTimes(1);
    });

    const requestArgs = vi.mocked(makeAnthropicMessagesRequest).mock.calls[0];
    expect(requestArgs).toHaveLength(MESSAGES_REQUEST_ARG_COUNT);
    expect(requestArgs[MESSAGES_STREAMING_ENABLED_ARG_INDEX]).toBe(false);
  });

  it("should send custom headers entered in the sidebar with /v1/chat/completions and /v1/messages requests", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");
    await user.click(screen.getByRole("button", { name: "添加请求头" }));
    await user.click(screen.getByRole("button", { name: "添加请求头" }));
    const [firstName] = screen.getAllByPlaceholderText("请求头名称");
    const [firstValue, secondValue] = screen.getAllByPlaceholderText("请求头的值");
    fireEvent.change(firstName, { target: { value: "anthropic-beta" } });
    fireEvent.change(firstValue, { target: { value: "context-1m-2025-08-07" } });
    fireEvent.change(secondValue, { target: { value: "ignored because the name is blank" } });

    const messageInput = screen.getByPlaceholderText("输入消息... (Shift+Enter 换行)");
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: "hello" } });
    });
    await act(async () => {
      fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      expect(makeOpenAIChatCompletionRequest).toHaveBeenCalledTimes(1);
    });
    const chatArgs = vi.mocked(makeOpenAIChatCompletionRequest).mock.calls[0];
    expect(chatArgs).toHaveLength(CHAT_REQUEST_ARG_COUNT);
    expect(chatArgs[CHAT_CUSTOM_HEADERS_ARG_INDEX]).toEqual({ "anthropic-beta": "context-1m-2025-08-07" });

    await selectComboboxOption("端点类型", "/v1/messages");
    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: "hello again" } });
    });
    await act(async () => {
      fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      expect(makeAnthropicMessagesRequest).toHaveBeenCalledTimes(1);
    });
    const messagesArgs = vi.mocked(makeAnthropicMessagesRequest).mock.calls[0];
    expect(messagesArgs).toHaveLength(MESSAGES_REQUEST_ARG_COUNT);
    expect(messagesArgs[MESSAGES_CUSTOM_HEADERS_ARG_INDEX]).toEqual({ "anthropic-beta": "context-1m-2025-08-07" });
  });

  it("should force streaming in simplified mode even when the playground setting is off", async () => {
    sessionStorage.setItem("streamingEnabled", "false");

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
        simplified
        fixedModel="Model 1"
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Chat|对话/).length).toBeGreaterThan(0);
    });

    const messageInput = screen.getByPlaceholderText("输入消息... (Shift+Enter 换行)");
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: "hello" } });
    });
    await act(async () => {
      fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      expect(makeOpenAIChatCompletionRequest).toHaveBeenCalledTimes(1);
    });

    const requestArgs = vi.mocked(makeOpenAIChatCompletionRequest).mock.calls[0];
    expect(requestArgs).toHaveLength(CHAT_REQUEST_ARG_COUNT);
    expect(requestArgs[STREAMING_ENABLED_ARG_INDEX]).toBe(true);
    expect(sessionStorage.getItem("streamingEnabled")).toBe("false");
  });

  it("should offer the streaming toggle for a responses-only model without advanced params", async () => {
    const user = userEvent.setup();
    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockResolvedValue([
      { model_group: "ResponsesModel", mode: "responses" },
    ]);

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/responses");
    await selectComboboxOption(/选择模型|输入自定义模型名称/, "ResponsesModel");

    await waitFor(() => {
      expect(screen.getByTestId("model-settings-button")).toBeInTheDocument();
    });

    await user.click(screen.getByTestId("model-settings-button"));

    expect(await screen.findByRole("checkbox", { name: /流式响应/ })).toBeChecked();
    expect(screen.queryByText("Temperature")).not.toBeInTheDocument();
    expect(screen.queryByText("Use Advanced Parameters")).not.toBeInTheDocument();
  });

  it("should show Fill button and populate customProxyBaseUrl when proxySettings.LITELLM_UI_API_DOC_BASE_URL is provided", async () => {
    const testProxyUrl = "http://localhost:5000";

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
        proxySettings={{
          LITELLM_UI_API_DOC_BASE_URL: testProxyUrl,
        }}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    const fillButton = screen.getByText("填入");
    expect(fillButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(fillButton);
    });

    await waitFor(() => {
      expect(sessionStorage.getItem("customProxyBaseUrl")).toBe(testProxyUrl);
    });

    await waitFor(() => {
      expect(screen.queryByText("Fill")).not.toBeInTheDocument();
    });

    const customProxyInput = screen.getByPlaceholderText(/Optional: Enter custom proxy URL|可选：输入自定义代理 URL/);
    expect(customProxyInput).toHaveValue(testProxyUrl);
  });

  it("should enable search functionality for MCP server selector", async () => {
    const user = userEvent.setup();
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByText(/MCP Servers|所有 MCP 服务器|MCP 服务器/)[0]).toBeInTheDocument();

    const mcpInput = screen.getByLabelText(/Select MCP servers|选择 MCP 服务器/);
    expect(mcpInput).toBeInTheDocument();
    expect(mcpInput).toBeEnabled();

    await user.click(mcpInput);

    await waitFor(() => {
      expect(screen.getByText("All MCP Servers")).toBeInTheDocument();
    });
  });

  it("should keep the chosen endpoint when a model that endpoint can serve is picked", async () => {
    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { model_group: "ChatModel", mode: "chat" },
    ]);

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/responses");
    await selectComboboxOption(/选择模型|输入自定义模型名称/, "ChatModel");

    expect(screen.getByPlaceholderText("端点类型")).toHaveValue("/v1/responses");
  });

  it("should not offer a model the selected endpoint cannot serve", async () => {
    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
      { model_group: "ChatModel", mode: "chat" },
      { model_group: "SpeechModel", mode: "audio_speech" },
    ]);

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/responses");
    await openComboboxByPlaceholder(/选择模型|输入自定义模型名称/);

    await waitFor(() => {
      expect(screen.getAllByText("ChatModel").length).toBeGreaterThan(0);
    });
    expect(screen.queryByText("SpeechModel")).not.toBeInTheDocument();
  });

  it("should attach an audio file dropped on the transcription upload area", async () => {
    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/audio/transcriptions");

    const dropZone = (await screen.findByText(/Click or drag audio file|点击或拖拽音频文件上传/)).closest("label");
    const file = new File(["clip"], "clip.wav", { type: "audio/wav" });
    fireEvent.drop(dropZone as HTMLElement, { dataTransfer: { files: [file] } });

    expect(await screen.findByText("clip.wav")).toBeInTheDocument();
  });

  it("should name the virtual key source options instead of showing raw values", async () => {
    const user = userEvent.setup();

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    const keySourceTrigger = screen.getByLabelText(/Virtual Key Source|虚拟密钥来源/);
    expect(keySourceTrigger).toHaveTextContent(/Current UI Session|当前 UI 会话/);
    expect(keySourceTrigger).not.toHaveTextContent("session");

    await user.click(keySourceTrigger);
    await user.click(await screen.findByRole("option", { name: /Virtual Key|虚拟密钥/ }));

    await waitFor(() => {
      expect(screen.getByLabelText(/Virtual Key Source|虚拟密钥来源/)).toHaveTextContent("虚拟密钥");
    });
    expect(screen.getByLabelText(/Virtual Key Source|虚拟密钥来源/)).not.toHaveTextContent("custom");
  });

  it("should re-enable the model selector when the virtual key is cleared mid-load", async () => {
    const user = userEvent.setup();
    (fetchModelsModule.fetchAvailableModels as ReturnType<typeof vi.fn>).mockImplementation(
      () => new Promise(() => {}),
    );

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await user.click(screen.getByLabelText(/Virtual Key Source|虚拟密钥来源/));
    await user.click(await screen.findByRole("option", { name: /Virtual Key|虚拟密钥/ }));

    const keyField = await screen.findByPlaceholderText(/Enter custom Virtual Key|输入自定义虚拟密钥/);
    fireEvent.change(keyField, { target: { value: "sk-test" } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Loading models|正在加载模型/)).toBeInTheDocument();
    });

    await user.clear(keyField);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/选择模型|enter custom model|输入自定义模型名称|Select Model/)).toBeEnabled();
    });
  });

  it("sends scroll the chat pane to the new message, tokens do not, jump button scrolls to bottom", async () => {
    const scrollTopSetter = vi.spyOn(HTMLElement.prototype, "scrollTop", "set");
    let streamChunk: ((chunk: string, model?: string) => void) | undefined;
    vi.mocked(makeOpenAIChatCompletionRequest).mockImplementation(async (...args) => {
      streamChunk = args[1] as (chunk: string, model?: string) => void;
    });

    render(
      <ChatUI
        accessToken="1234567890"
        token="1234567890"
        userRole="user"
        userID="1234567890"
        disabledPersonalKeyCreation={false}
      />,
    );

    await waitFor(() => {
      expect(screen.getAllByText(/Test Key|虚拟密钥来源|当前 UI 会话/).length).toBeGreaterThan(0);
    });

    await selectComboboxOption("端点类型", "/v1/chat/completions");
    await selectComboboxOption(/选择模型|输入自定义模型名称/, "Model 1");
    const messageInput = screen.getByPlaceholderText("输入消息... (Shift+Enter 换行)");
    await act(async () => {
      fireEvent.change(messageInput, { target: { value: "hello" } });
    });
    await act(async () => {
      fireEvent.keyDown(messageInput, { key: "Enter", code: "Enter" });
    });

    await waitFor(() => {
      expect(makeOpenAIChatCompletionRequest).toHaveBeenCalledTimes(1);
    });

    expect(scrollTopSetter).toHaveBeenCalled();
    scrollTopSetter.mockClear();

    const scrollIntoViewMock = vi.mocked(Element.prototype.scrollIntoView);
    const scrollIntoViewCallsBeforeTokens = scrollIntoViewMock.mock.calls.length;

    await act(async () => {
      streamChunk?.("Hello world", "Model 1");
    });

    expect(scrollTopSetter).not.toHaveBeenCalled();
    expect(scrollIntoViewMock.mock.calls.length).toBe(scrollIntoViewCallsBeforeTokens);

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Jump to bottom" }));

    expect(scrollTopSetter).toHaveBeenCalled();
  });
});
