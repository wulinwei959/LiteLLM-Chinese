import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React, { ReactNode } from "react";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { useDiscountConfig } from "./use_discount_config";
import { toast } from "@/lib/toast";

vi.mock("@/components/networking", () => ({
  getProxyBaseUrl: vi.fn(() => ""),
  getGlobalLitellmHeaderName: vi.fn(() => "Authorization"),
}));

vi.mock("./provider_display_helpers", () => ({
  getProviderBackendValue: vi.fn((enumKey: string) => {
    const map: Record<string, string> = {
      OpenAI: "openai",
      Anthropic: "anthropic",
      Vertex_AI: "vertex_ai",
      Openrouter: "openrouter",
    };
    return map[enumKey] ?? null;
  }),
}));

vi.mock("@/components/provider_info_helpers", () => ({
  Providers: {
    OpenAI: "OpenAI",
    Anthropic: "Anthropic",
    Vertex_AI: "Vertex AI",
    Openrouter: "OpenRouter",
  },
}));

const wrapper = ({ children }: { children: ReactNode }) =>
  // LocaleProviderProps.children 为必填，children 作 createElement 第三参传会 TS2769
  // eslint-disable-next-line react/no-children-prop
  React.createElement(LocaleProvider, { locale: "zh-CN", children });

describe("useDiscountConfig", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchDiscountConfig", () => {
    it("should populate discountConfig with fetched values on success", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: { openai: 0.05, anthropic: 0.1 } }),
      } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      expect(result.current.discountConfig).toEqual({ openai: 0.05, anthropic: 0.1 });
    });

    it("should set an empty config when the response has no values", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: {} }),
      } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      expect(result.current.discountConfig).toEqual({});
    });

    it("should show an error notification when the fetch throws", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      expect(toast.fromError).toHaveBeenCalledWith("获取折扣配置失败");
    });
  });

  describe("handleAddProvider", () => {
    it("should return false and notify when no provider is selected", async () => {
      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider(undefined, "5", "");
      });

      expect(success!).toBe(false);
      expect(toast.fromError).toHaveBeenCalledWith("请选择供应商并输入折扣百分比");
    });

    it("should return false and notify when no discount is provided", async () => {
      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "", "");
      });

      expect(success!).toBe(false);
      expect(toast.fromError).toHaveBeenCalledWith("请选择供应商并输入折扣百分比");
    });

    it("should return false and notify when the discount exceeds 100", async () => {
      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "150", "");
      });

      expect(success!).toBe(false);
      expect(toast.fromError).toHaveBeenCalledWith("折扣必须在 0% 到 100% 之间");
    });

    it("should return false and notify when the provider already exists in the config", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { openai: 0.05 } }),
        } as Response)
        .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "10", "");
      });

      expect(success!).toBe(false);
      expect(toast.fromError).toHaveBeenCalledWith("OpenAI 的折扣已存在，请在上方的表格中编辑。");
    });

    it("should reject a duplicate even when the stored discount is 0", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: { vertex_ai: 0 } }),
      } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      vi.clearAllMocks();

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("Vertex_AI", "5", "");
      });

      expect(success!).toBe(false);
      expect(toast.fromError).toHaveBeenCalledWith("Vertex AI 的折扣已存在，请在上方的表格中编辑。");
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it("should save the config and return true on a valid new provider", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => ({ values: {} }) } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ values: { openai: 0.05 } }) } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "5", "");
      });

      expect(success!).toBe(true);
      expect(toast.success).toHaveBeenCalledWith("折扣配置更新成功");
    });

    it("should store a <provider>/<pattern> key when a model pattern is given", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => ({ values: {} }) } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ values: { "openai/gpt-*": 0.2 } }) } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "20", "gpt-*");
      });

      expect(success!).toBe(true);
      const patchCall = vi.mocked(global.fetch).mock.calls.find(([, init]) => init?.method === "PATCH");
      expect(patchCall).toBeDefined();
      expect(JSON.parse(patchCall![1]!.body as string)).toEqual({ "openai/gpt-*": 0.2 });
      expect(result.current.discountConfig).toHaveProperty("openai/gpt-*", 0.2);
    });

    it("should store the bare provider key when the pattern is empty or whitespace", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({ values: { openai: 0.05 } }) } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "5", "   ");
      });

      expect(success!).toBe(true);
      const patchCall = vi.mocked(global.fetch).mock.calls.find(([, init]) => init?.method === "PATCH");
      expect(JSON.parse(patchCall![1]!.body as string)).toEqual({ openai: 0.05 });
    });

    it("should compose a nested pattern with slashes into the config key", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { "openrouter/anthropic/claude-*": 0.15 } }),
        } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("Openrouter", "15", "anthropic/claude-*");
      });

      expect(success!).toBe(true);
      const patchCall = vi.mocked(global.fetch).mock.calls.find(([, init]) => init?.method === "PATCH");
      expect(JSON.parse(patchCall![1]!.body as string)).toEqual({ "openrouter/anthropic/claude-*": 0.15 });
    });

    it("should let a provider with a bare discount also get a pattern entry", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({ ok: true, json: async () => ({ values: { openai: 0.05 } }) } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { openai: 0.05, "openai/gpt-*": 0.2 } }),
        } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "20", "gpt-*");
      });

      expect(success!).toBe(true);
      const patchCall = vi.mocked(global.fetch).mock.calls.find(([, init]) => init?.method === "PATCH");
      expect(JSON.parse(patchCall![1]!.body as string)).toEqual({ openai: 0.05, "openai/gpt-*": 0.2 });
    });

    it("should reject a duplicate pattern key", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: { "openai/gpt-*": 0.2 } }),
      } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      let success: boolean;
      await act(async () => {
        success = await result.current.handleAddProvider("OpenAI", "10", "gpt-*");
      });

      expect(success!).toBe(false);
      expect(toast.fromError).toHaveBeenCalledWith("OpenAI（gpt-*）的折扣已存在，请在上方的表格中编辑。");
    });
  });

  describe("handleRemoveProvider", () => {
    it("should remove the provider from the config and save", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { openai: 0.05, anthropic: 0.1 } }),
        } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { anthropic: 0.1 } }),
        } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      expect(result.current.discountConfig).toHaveProperty("openai");

      await act(async () => {
        await result.current.handleRemoveProvider("openai");
      });

      // The optimistic update removes openai immediately
      expect(result.current.discountConfig).not.toHaveProperty("openai");
    });
  });

  describe("handleDiscountChange", () => {
    it("should update the discount value and save when the value is valid", async () => {
      vi.spyOn(global, "fetch")
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { openai: 0.05 } }),
        } as Response)
        .mockResolvedValueOnce({ ok: true, json: async () => ({}) } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ values: { openai: 0.1 } }),
        } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      await act(async () => {
        await result.current.handleDiscountChange("openai", "0.1");
      });

      // Optimistic update applied immediately
      expect(result.current.discountConfig["openai"]).toBe(0.1);
    });

    it("should not save when the value is greater than 1 (invalid fraction)", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({ values: { openai: 0.05 } }),
      } as Response);

      const { result } = renderHook(() => useDiscountConfig({ accessToken: "test-token" }), { wrapper });

      await act(async () => {
        await result.current.fetchDiscountConfig();
      });

      // Clear mocks after the initial fetch so we can check that no PATCH was made
      vi.clearAllMocks();

      await act(async () => {
        await result.current.handleDiscountChange("openai", "1.5");
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });
  });
});
