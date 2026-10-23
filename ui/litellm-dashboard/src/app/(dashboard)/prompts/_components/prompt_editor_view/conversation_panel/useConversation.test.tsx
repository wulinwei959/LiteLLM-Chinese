import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/contexts/LocaleContext";

import { useConversation } from "./useConversation";

const fetchMock = vi.fn();

const wrapper = ({ children }: { children: ReactNode }) => <LocaleProvider locale="zh-CN">{children}</LocaleProvider>;

describe("useConversation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
  });

  const renderConversation = () =>
    renderHook(() => useConversation({ messages: [], config: {}, setEditingToolIndex: () => {} }, "token"), {
      wrapper,
    });

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
