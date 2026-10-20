import { act, renderHook } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";

import zh from "@/messages/zh-CN.json";
import { useConversation } from "./useConversation";

const fetchMock = vi.fn();

describe("useConversation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  const renderConversation = () => {
    const t = createTranslator({ locale: "zh-CN", messages: zh, namespace: "prompts" });
    return renderHook(() => useConversation({ messages: [], config: {}, setEditingToolIndex: () => {} }, "token", t));
  };

  it("reports a failed request in the localized error prefix", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "upstream detail",
    });

    const { result } = renderConversation();
    act(() => result.current.setInputMessage("hello"));
    await act(async () => {
      await result.current.handleSendMessage();
    });

    expect(result.current.messages.at(-1)?.content).toBe("错误：HTTP error! status: 500, upstream detail");
  });

  it("reports a missing response body in the localized wording", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      body: null,
    });

    const { result } = renderConversation();
    act(() => result.current.setInputMessage("hello"));
    await act(async () => {
      await result.current.handleSendMessage();
    });

    expect(result.current.messages.at(-1)?.content).toBe("错误：未收到响应体");
  });
});
